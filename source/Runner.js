Inspec.Runner = Inspec.Class.extend({
  init : function(behaviorRoot, exampleGroupRoot, messenger){
    this.behaviorRoot = behaviorRoot;
    this.exampleGroupRoot = exampleGroupRoot;
    this.messenger = messenger;
  },
  
  // runs the entire set
  // executes all example groups in order
  execute : function() {
    this.messenger.send("beginTest");
    this.behaviorRoot.eachChild(function(behavior){
      if(behavior)
        this.executeBehavior(behavior);
    }, this);
    this.messenger.send("endTest");
  },
  
  executeBehavior : function(behavior){
    var exampleGroups = behavior.getExampleGroups();
    for(var i=0; i< exampleGroups.length; i++){
      var exampleGroup = exampleGroups[i];
      this.executeExampleGroupTree(exampleGroup);
    }
  },
  
  executeExampleGroupTree : function(exampleGroup){
    this.executeExampleGroup(exampleGroup);
    exampleGroup.eachChild(function(child){
      if(child){
        this.executeExampleGroupTree(child);
      }
    }, this);
  },
  // executes the specified example group
  executeExampleGroup : function(exampleGroup){
    if(exampleGroup.hasExamples())
    {
      var executionError = null;
      this.messenger.send("beginExampleGroup", {exampleGroup : exampleGroup});
      var scope = exampleGroup.defaultScope;

      // temporarily taking before all's out of the try catch block.
      // It should skip the whole implementation if before all fails.
      this.executeBeforeAll(exampleGroup, scope);


      this.executeExamples(exampleGroup, scope);
      
      try{
        this.executeAfterAll(exampleGroup, scope);
      }catch(e){
        executionError = executionError || e;
      }
      
      this.messenger.send("endExampleGroup", {exampleGroup : exampleGroup, error : executionError});
    }
  },
  
  // runs all examples in this example group
  executeExamples : function(exampleGroup, scope){
    for(var i=0; i< exampleGroup.examples.length; i++){
      this.executeExample(exampleGroup.examples[i], Inspec.clone(scope));
    }    
  },
  
  // runs before all clauses of all parent and current example groups.
  // immediate parents are run last
  executeBeforeAll : function(exampleGroup, scope){
    var parent = exampleGroup.getParent();
    if(parent){
      this.executeBeforeAll(parent, scope);
    }
        
    for(var i=0; i< exampleGroup.before.all.length; i++){
      exampleGroup.before.all[i].call(scope);
    }
  },

  // runs after all caluases of all parent and current example groups.
  // current is run first, and then immediate parent is run  
  executeAfterAll : function(exampleGroup, scope){
    for(var i=0; i< exampleGroup.after.all.length; i++){
      exampleGroup.after.all[i].call(scope);
    }
    var parent = exampleGroup.getParent();
    if(parent){
      this.executeAfterAll(parent, scope);
    }
  },

  // runs before each clauses of all parent and current example groups.
  // immediate parents are run last    
  executeBeforeEach : function(exampleGroup, scope){
    var parent = exampleGroup.getParent();
    if(parent){
      this.executeBeforeEach(parent, scope);
    }
    for(var i=0; i< exampleGroup.before.each.length; i++){
      exampleGroup.before.each[i].call(scope);
    }
  },
  
  // runs after each caluases of all parent and current example groups.
  // current is run first, and then immediate parent is run
  executeAfterEach : function(exampleGroup, scope){
    for(var i=0; i< exampleGroup.after.each.length; i++){
      exampleGroup.after.each[i].call(scope);
    }
    var parent = exampleGroup.getParent();
    if(parent){
      this.executeAfterEach(parent, scope);
    }
  },
  
  // executes user specified implementation of this example
  // Returns success or failure
  // exceptions are caught and recorded
  executeExample : function(example, scope){
    var executionError = null;
    var exampleGroup = example.exampleGroup;
    this.messenger.send("beginExample", {example : example});
    try{
      this.executeBeforeEach(exampleGroup, scope);
      this.executeExampleImplementation(example, scope);
    }catch(e){
      executionError = executionError || e;
    }
    try{
      this.executeAfterEach(exampleGroup, scope);
    }catch(e){
      executionError = executionError || e;
    }
    
    var success = executionError ? false : true;
    
    this.messenger.send("endExample", {example : example, success : success, error : executionError});   
  },
  
  // run the implementation of the example group
  executeExampleImplementation : function(example, scope){
    if(!example.implementation){
      throw new Inspec.ExamplePending();
    }
    example.implementation.call(scope);
  }
});


