Inspec.ExampleGroupManager = Inspec.Class.extend({
  // creates an exmaple group manager
  init : function(){
    this.sharedExampleGroups = {};
    this.behaviorRoot = new Inspec.Behavior('root');
    this.exampleGroupRoot = new Inspec.ExampleGroup('root');
    this.currentBehavior = this.behaviorRoot;
    this.currentExampleGroup = this.exampleGroupRoot;
  },
  
  // Add an example group to shared for later use if the example group is
  // shared. Add an example group to standard if it is not shared. If the
  // added example group is concrete, we initialize it. If the added example
  // group is not concrete, it will later be solidified using a shared example
  // group.
  add : function(description, exampleGroup){
    if(exampleGroup.isShared()){
      this.sharedExampleGroups[description] = exampleGroup;
    } else {
      var behavior = this.findOrCreateBehavior(description);
      behavior.addExampleGroup(exampleGroup);
      this.currentExampleGroup.add(exampleGroup);
      this.initExampleGroup(exampleGroup);
    }
  },
  
  findOrCreateBehavior : function(description){
    return (this.currentBehavior.get(description) || this.currentBehavior.add(new Inspec.Behavior(description)));
  },
  
  // Todo: refactor!!!
  solidify : function(implementation){
    var str = implementation.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1];
    var regex = /itShouldBehaveLike\s*[(]\s*(?:['"])(.*?)(?:['"])\s*[)]\s*;*/m;
    
    if(!regex.test(str)) return implementation;

    var results = null;
    
    while(results = regex.exec(str)){
      var sharedExampleGroup = this.sharedExampleGroups[results[1]];
      if(!sharedExampleGroup)
        throw new Error("Shared Behavior: '" + results[1] + "' not found! Did you include it before this script?");

      var subStr = sharedExampleGroup.getImplementation().toString();
      var contents = subStr.match(/^[^\{]*{((.*\n*)*)}/m)[1];
      str = str.replace(results[0], contents);
    }
    str = "with (dsl){ with(matchers) { " + str + " } }";
    // using "new Function" approach, so the scope chain is empty
    var fn = new Function("dsl", "matchers", str);
    // assigning default scope as the global scope
    
    implementation = function(){
      fn.call(this, Inspec.options.dsl, Inspec.Matchers);
    };
        
    return implementation;
  },
  
  // initializes an example group. Do nothing if the example group is not
  // concrete. Because it doesn't have an implementation. It sets the current
  // exaple group first, then runs the implementation of the example group,
  // finally, it sets the current example group to the parent example group.
  initExampleGroup : function(exampleGroup){
    if(!exampleGroup.isConcrete())
      return;
    
    this.currentBehavior = exampleGroup.getBehavior();
    this.currentExampleGroup = exampleGroup;
    exampleGroup.setImplementation(this.solidify(exampleGroup.getImplementation()));
    exampleGroup.getImplementation().call(exampleGroup.defaultScope);
    this.currentBehavior = exampleGroup.getBehavior().getParent();
    this.currentExampleGroup = exampleGroup.getParent();
  },
  
  // returns the current example group
  currentExampleGroup : function(){
    return this.current.getContent();
  }
});
