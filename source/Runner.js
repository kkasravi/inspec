Inspec.Runner = Inspec.Class.extend({
  init : function(root, messenger){
    this.root = root;
    this.messenger = messenger;
  },
  
  // runs the entire set
  // executes all example groups in order
  execute : function() {
    this.messenger.send("beginTest");
    this.root.each(function(node){
      var exampleGroup = node.getContent();
      if(exampleGroup)
        this.executeExampleGroup(exampleGroup);
    }, this);
    this.messenger.send("endTest");
  },
  
  // executes the specified example group
  executeExampleGroup : function(exampleGroup){
    if(exampleGroup.hasExamples())
    {
      var executionError = null;
      this.messenger.send("beginExampleGroup", {exampleGroup : exampleGroup});
      var scope = exampleGroup.defaultScope;
      try{
        this.executeBeforeAll(exampleGroup, scope);
      }catch(e){
        executionError = executionError || e;
      }
      
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
      this.executeBeforeAll(parent);
    }
    if(typeof exampleGroup.beforeAll == "function")
      exampleGroup.beforeAll.call(scope);
  },

  // runs after all caluases of all parent and current example groups.
  // current is run first, and then immediate parent is run  
  executeAfterAll : function(exampleGroup, scope){
    if(typeof exampleGroup.afterAll == "function")
      exampleGroup.afterAll.call(scope);
    var parent = exampleGroup.getParent();
    if(parent){
      this.executeAfterAll(parent);
    }
  },

  // runs before each clauses of all parent and current example groups.
  // immediate parents are run last    
  executeBeforeEach : function(exampleGroup, scope){
    var parent = exampleGroup.getParent();
    if(parent){
      this.executeBeforeEach(parent);
    }
    if(typeof exampleGroup.beforeEach == "function")
      exampleGroup.beforeEach.call(scope);
  },
  
  // runs after each caluases of all parent and current example groups.
  // current is run first, and then immediate parent is run
  executeAfterEach : function(exampleGroup, scope){
    if(typeof exampleGroup.afterEach == "function")
      exampleGroup.afterEach.call(scope);
    var parent = exampleGroup.getParent();
    if(parent){
      this.executeAfterEach(parent);
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


