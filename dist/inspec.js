var Inspec={};
Inspec.util = {};
Inspec.reporters = {};
Inspec.matchers = {};
Inspec.reporters = {};
Inspec.dsl = {};
Inspec.options = {};

Inspec.root = this;

Inspec.load = function(){
  var files = [];
  while(arguments.length){
    var temp = Array.prototype.shift.call(arguments);
    if(typeof temp == "array"){
      files = files.concat(temp);
    } else if(typeof temp == "string"){
      files.push(temp);
    }
  }

  var env = Inspec.Environment.getInstance();
  for(var i=0; i< files.length; i++){
    env.load(files[i]);
  }
  return this;
};

Inspec.run = function(){
  var env = Inspec.Environment.getInstance();
  env.run();
}

Inspec.merge = function(a, b){
  var rv = this.clone(a);
  for(var i in b) rv[i] = b[i];
  return rv;
}

Inspec.clone = function(a) {
  var rv = {};
  for(var i in a) rv[i] = a[i];
  return rv;
}


/**
 * @class Base class to emulate classical class-based OOP
 */
Inspec.Class = function() {};
Inspec.Class._initializing = false;
Inspec.Class._fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

/**
 * @param {object} base Base class to be extended
 * @return {Inspec.Class} Extended class instance
 */
Inspec.Class.extend = function(base) {
	// Inspired by http://ejohn.org/blog/simple-javascript-inheritance/
	var _super = this.prototype;
	
	Inspec.Class._initializing = true;
	var prototype = new this();
	Inspec.Class._initializing = false;
	
	for(var name in base) {
		prototype[name] = typeof base[name] == 'function' && 
		typeof _super[name] == 'function' && Inspec.Class._fnTest.test(base[name]) ?
		(function(name, fn){
			return function() {
				var tmp = this._super;
				this._super = _super[name];
				var ret = fn.apply(this, arguments);        
				this._super = tmp;
				return ret;
			};
		})(name, base[name]) :
		base[name];
	}

	function Class() {
		if (!Inspec.Class._initializing && this.init)
		  this.init.apply(this, arguments);
	}

	Class.prototype = prototype;
	Class.constructor = Class;
	Class.extend = arguments.callee;
	
	return Class;
};


// Constructor
// Creates a new node
Inspec.util.TreeNode = function(name, content){
  if(!name)
    throw "Node name HAS to be provided";
    
  this._parent = null;
  this._name = name;
  this._content = content;
  this._children = [];
  this._childrenHash = {};
};

Inspec.util.TreeNode.max = function(array){
  return Math.max.apply(Math, array);
};

Inspec.util.TreeNode.min = function(array){
  return Math.min.apply(Math, array);
};

Inspec.util.TreeNode.prototype ={
  // Adds the specified child node to the receiver node.  The child node's
  // parent is set to be the receiver.  The child is added as the last child in
  // the current list of children for the receiver node.
  add : function(child){
    if(typeof this._childrenHash[child.getName()] != "undefined")
      throw "Child already added";
      
    this._children.push(child);
    this._childrenHash[child.getName()] = this._children.length - 1;
    
    child.setParent(this);
    return child;
  },
  
  // Removes the specified child node from the receiver node.  The removed
  // children nodes are orphaned but available if an alternate reference
  // exists.
  //
  // Returns the child node.
  remove : function(child){
    if(child){
      var index = this._childrenHash[child.getName()];
      this._children.splice(index, 1);
      delete this._childrenHash[child.getName()];
      child.setAsRoot();
    }
    return child;
  },
  
  // Removes this node from its parent. If this is the root node, then does
  // nothing.
  removeFromParent : function(){
    if(this.isRoot())
      return;
    this.getParent().remove(this);
  },
  
  // Removes all children from the receiver node.
  removeAll : function(){
    this.eachChildren(function(child){
      child.setAsRoot();
    }, this);

    this._children = [];
    this._childrenHash = {};
  },
  
  // Returns the requested node from the set of immediate children by the name
  // of the child node
  get : function(name){
    var index = this._childrenHash[name];
    return this.getAt(index);
  },

  // Returns the requested node from the set of immediate children by the
  // position of the child node
  getAt : function(index){
    if(index)
      return this._children[index];
    return null;
  },
  
  // Returns the content of the requested node. Returns null if the requested
  // node has no content specified.
  getContent : function(){
    return this._content;
  },
  
  // Returns the name of the requested node.
  getName : function(){
    return this._name;
  },
  
  // Returns the immediate parent of the requested node.
  getParent : function(){
    return this._parent;
  },
      
  // Returns an array of ancestors in reversed order (the first element is the
  // immediate parent). Returns nil if this is a root node.
  getAllParents : function(){
    if(this.isRoot())
      return null;
    
    var parentArray = [];
    var previousParent = this.getParent();
    while(previousParent){
      parentArray.push(previousParent);
      previousParent = previousParent.getParent();
    }    
    return parentArray;    
  },
  
  // Returns the first child of this node. Will return null if no children are
  // present.
  getFirstChild : function(){
    return this._children[0];
  },
  
  // Returns the last child of this node. Will return nil if no children are
  // present.
  getLastChild : function(){
    return this._children[this._children.length - 1];
  },
  
  // Returns the root for this tree. Root's root is itself.
  getRoot : function(){
    var root = this
    while(!root.isRoot()){
      root = root.getParent();
    }
    return root;
  },
  
  // Returns the first sibling for this node. If this is the root node, returns
  // itself
  getFirstSibling : function(){
    if(this.isRoot())
      return this;
    return this.getParent()._children[0];
  },

  // Returns the last sibling for this node.  If this node is the root, returns
  // itself
  getLastSibling : function(){
    if(this.isRoot())
      return this;
    return this.getParent()._children[this._children.length - 1];
  },

  // Returns the next sibling for this node. Will return null if no subsequent
  // node is present.
  getNextSibling : function(){
    var index = this.position();
    if(index == -1 ||  index == this.getParent().size() -1 )
      return null;
    
    return this.getParent()._children[index+1];
  },
  
  position : function(){
    if(this.isRoot())
      return -1;
    var nodes = this.getParent()._children;
    for(var i=0; i< nodes.length; i++){
      if(nodes[i] == this)
        return i;
    }
    return -1;
  },
  
  // Returns the previous sibling for this node. Will return null if no 
  // subsequent node is present.
  getPreviousSibling : function(){
    var index = this.position();
    if(index <= 0 )
      return null;
      
    return this.getParent()._children[index-1];
  },
  
  // Sets the content of the requested node to the specified content.
  setContent : function(content){
    this._content = content;
  },

  // Indicates whether this node has any associated content.
  hasContent : function(){
    rv = (this.getContent() != null && typeof this.getContent() != "undefined");
    return rv;
  },
  
  // Indicates whether this node has any immediate child nodes.
  hasChildren : function(){
    return (this._children.length > 0)
  },
            
  // Indicates whether this node is a root node. Note that
  // orphaned children will also be reported as root nodes.
  isRoot : function(){
    return (this._parent == null);
  },
  
  // Indicates whether this node is a 'leaf' - i.e., one without
  // any children
  isLeaf : function(){
    return (!this.hasChildren());
  },

  // Returns true if this node is the first sibling.
  isFirstSibling : function(){
    return (this.getFirstSibling() === this);
  },

  // Returns true if this node is the last sibling.
  isLastSibling : function(){
   return (this.getLastSibling() === this);
  },
  
  // Returns true if this node is the only child of its parent
  isOnlyChild : function(){
    return (this.getParent()._children.length == 1);
  },
    
  // If a function is given,
  // yields each child node to the block.
  eachChild : function(fn, scope){
    if(typeof fn == "function"){
      for(var i=0; i<this._children.length; i++){
        fn.call(scope, this._children[i]);
      }
    }
  },
  
  // Returns an array of siblings for this node.
  // If a block is provided, yields each of the sibling
  // nodes to the block. The root always has null siblings.
  eachSibling : function(fn, scope){
    if(this.isRoot()) return null;
    
    this.getParent().eachChild(function(sibling){
      if(sibling != this)
        fn.call(scope, sibling);
    }, this);
  },

  
  each : function(fn, scope){
    this.preorderedEach(fn, scope);
  },

  // Returns every node (including the receiver node) from the tree to the
  // specified block. The traversal is depth first and from left to right in
  // pre-ordered sequence.
  preorderedEach : function(fn, scope){
    fn.call(scope, this);
    this.eachChild(function(child){
      child.preorderedEach(fn, scope);
    }, this);  
  },
  
  // Performs breadth first traversal of the tree rooted at this node. The
  // traversal in a given level is from left to right.
  breadthEach : function(fn, scope){
    var nodeQueue = [this];
    
    // Use a queue to do breadth traversal
    while(nodeQueue.length > 0){
      var nodeToTraverse = nodeQueue.shift
      fn.call(scope, nodeToTraverse);
      // Enqueue the children from left to right.
      nodeToTraverse.eachChild(function(child){
        nodeQueue.push(child);
      }, this);
    }
  },
  
  // Yields all leaf nodes from this node to the specified block. May yield
  // this node as well if this is a leaf node.  Leaf traversal depth first and
  // left to right.
  eachLeaf : function(fn, scope){
    this.each(function(node){
      if(node.isLeaf())
        fn.call(scope, node);
    }, this);
  },
  
  // Returns the total number of nodes in this tree, rooted at the receiver
  // node.
  size : function(){
    return this._children.length;
  },
  
  // @see #size
  length : function(){
    return this.size();
  },

  // Returns depth of the tree from this node. A single leaf node has a
  // depth of 1.
  depth : function(){
    var depth = 1;
    if(!this.isLeaf()){
      var ary = [];
      this.eachChildren(function(child){
        ary.push(child.depth());
      }, this);
      deapth += Inspec.util.TreeNode.max(ary);
    }
    return depath;
  },
  
  // Returns breadth of the tree at this node level. A single node has a
  // breadth of 1.
  breadth : function(){
    if(this.isRoot())
      return 1;
      
    return this.getParent().size();
  },
  
  // Protected method to set the parent node.
  // This method should NOT be invoked by client code.
  setParent : function(node){
    this._parent = node;
  },
  
  // Protected method which sets this node as a root node.
  setAsRoot : function(){
    this.setParent(null);
  }
}


Inspec.util.Messenger = function(){
  this.events = {};
};

Inspec.util.Messenger.prototype = {
  send : function(subject, message){
    var handlers = this.events[subject];
    if(!handlers) return;
    for(var i=0; i<handlers.length; i++)
      handlers[i].fn.call(handlers[i].scope, message);
  },
  
  on : function(subject, fn, scope){
    this.events[subject] = this.events[subject] || [];
    var handler = {};
    handler.fn = fn;
    handler.scope = scope || this;
    this.events[subject].push(handler);
  },
  
  un : function(subject, fn, scope){
    var handlers = this.events[subject];
    if(!handlers) return;
    scope = scope || this;
    for(var i=0; i<handlers.length; i++)
      if(handlers[i].fn === fn && handlers[i].scope === scope)
        handlers.splice(i--, 1);
  }
};


Inspec.dsl.BDD = {
  describe : function(description, implementation){
    Inspec.ExampleGroup.createExampleGroup(description, implementation);
  },
  
  shareExamplesFor : function(description, implementation){
    Inspec.ExampleGroup.createExampleGroup(description, implementation, {shared : true});
  },
  
  itShouldBehaveLike : function(description){
    Inspec.ExampleGroup.createExampleGroup(description, null);
  },
  
  expect : function(subject){
    return new Inspec.Expectation(subject);
  },

  it : function(description, implementation){
    Inspec.Example.createExample(description, implementation);
  },
  
  beforeEach : function(implementation){
    Inspec.ExampleGroup.setBeforeEach(implementation);
  },
  
  afterEach : function(implementation){
    Inspec.ExampleGroup.setAfterEach(implementation);
  },
  
  beforeAll : function(implementation){
    Inspec.ExampleGroup.setBeforeAll(implementation);
  },
  
  afterAll : function(implementation){
    Inspec.ExampleGroup.setAfterAll(implementation);
  }  
};

Inspec.dsl.BDD.context = Inspec.dsl.BDD.describe;

Inspec.dsl.BDD.sharedExamplesFor = Inspec.dsl.BDD.shareExamplesFor;


Inspec.Example = Inspec.Class.extend({
  // constructor
  init : function(exampleGroup, description, implementation, options){
    this.exampleGroup = exampleGroup;
    this.description = description;
    this.implementation = implementation;
    this.options = options;
  },
  
  // returns the description of this example
  getDescription : function(){
    return this.description;
  } 
});

// creates a new example and adds it to the current example group
Inspec.Example.createExample = function(description, implementation){
  var currentExampleGroup = Inspec.ExampleGroup.current();
  if(!currentExampleGroup){
    throw new Error("Cannot Create examples outside of ExampleGroup!");
  }
  var example = new Inspec.Example(currentExampleGroup, description, implementation);
  currentExampleGroup.addExample(example);
};


Inspec.ExampleGroupManager = Inspec.Class.extend({
  // creates an exmaple group manager
  init : function(){
    this.shared = {}
    this.root = new Inspec.util.TreeNode('root');
    this.current = this.root;
  },
  
  // Add an example group to shared for later use if the example group is
  // shared. Add an example group to standard if it is not shared. If the
  // added example group is concrete, we initialize it. If the added example
  // group is not concrete, it will later be solidified using a shared example
  // group.
  add : function(exampleGroup){
    if(exampleGroup.isShared()){
      this.shared[exampleGroup.getDescription()] = exampleGroup;
    } else {
      var newNode = new Inspec.util.TreeNode(exampleGroup.getDescription(), exampleGroup);
      this.current.add(newNode);
      exampleGroup.setNode(newNode);
      this.initExampleGroup(exampleGroup);
    }
  },
  
  // solidifies a non-concrete example group using a shared example group.
  solidifySharedExampleGroup : function(exampleGroup){
    // do nothing if it is concrete
    if(exampleGroup.isConcrete())
      return;
    
    var sharedExampleGroup = this.shared[exampleGroup.getDescription()];
    exampleGroup.implementation = sharedExampleGroup.implementation;
    this.initExampleGroup(exampleGroup);
  },
  
  // initializes an example group. Do nothing if the example group is not
  // concrete. Because it doesn't have an implementation. It sets the current
  // exaple group first, then runs the implementation of the example group,
  // finally, it sets the current example group to the parent example group.
  initExampleGroup : function(exampleGroup){
    if(!exampleGroup.isConcrete())
      return;
    
    this.current = exampleGroup.node;
    exampleGroup.implementation.call(exampleGroup.defaultScope);
    this.current = exampleGroup.node.getParent();
  },
    
  // iterate through all example groups, and solidify exmaple groups
  prepare : function() {
    this.root.each(function(node){
      if(node.hasContent() && (!node.getContent().isConcrete()))
        this.solidifySharedExampleGroup(node.getContent());
    }, this);   
  },
  
  // returns the current example group
  currentExampleGroup : function(){
    return this.current.getContent();
  }
});


Inspec.ExampleGroup = Inspec.Class.extend({
  // constructor
  // An example group is concrete if implementation is given. Example groups that
  // are not concrete will later be solidified with the matching shared example 
  // groups. An example group is shared if the shared flag is set. Shared example
  // groups cannot be run directly, and will later become solidified.
  init : function(description, implementation, shared){
    this.description = description;
    this.implementation = implementation;
    this.examples = [];
    this.shared = false;
    if(shared)
      this.shared = true;
    this.node = null;
    this.defaultScope = {};
  },
  
  // returns the description of the example group
  getDescription : function(){
    return this.description;
  },
  
  // returns the implementation of the example group
  getImplementation : function(){
    return this.implementation;
  },
  
  // returns the TreeNode that this example group belongs to.
  // returns null if it doesn't belong a TreeNode. e.g. shared example groups
  getNode : function(){
    return this.node;
  },
  
  //sets up the node, and the default scope
  setNode : function(node){
    this.node = node;
    this.initDefaultScope(this);
  },
  
  //recursively sets the scope from it's parents
  initDefaultScope: function(exampleGroup){
    var parent = exampleGroup.getParent();
    
    if(parent)
      this.initDefaultScope(parent);
    
    this.defaultScope = Inspec.merge(this.defaultScope, exampleGroup.defaultScope);
  },
  
  // returns the parent example group of this example group
  // returns null if this example group has no parent
  getParent : function(){
    var parent = this.getNode().getParent();
    if(parent){
      return parent.getContent();
    }
    return null;
  },
  
  // returns all child example groups in an array. Return values are in order.
  getChildren : function(){
    var scope = {children : []};
    this.getNode().eachChild(function(node){
      this.children.push(node.getContent());
    }, scope);
    return scope.children;
  },
  
  // returns the before each function
  getBeforeEach : function(){
    return this.beforeEach;
  },
  
  // returns the after each function
  getAfterEach : function(){
    return this.afterEach;
  },
  
  // returns the before all function
  getBeforeAll : function(){
    return this.beforeAll;
  },
  
  // return the after all function
  getAfterAll : function(){
    return this.afterAll;
  },
  
  // sets before each for this example group
  setBeforeEach : function(fn){
    this.beforeEach = fn;
  },
  
  // sets after each for this example group
  setAfterEach : function(fn){
    this.afterEach = fn;
  },
  
  // sets before all for tis example group
  setBeforeAll : function(fn){
    this.beforeAll = fn;
  },
  
  // sets after all for this example group
  setAfterAll : function(fn){
    this.afterAll = fn;
  },
  
  // indicates if this example group is shared
  isShared : function(){
    return this.shared;
  },
  
  // indicates if this example group is concrete
  isConcrete : function(){
    return (this.implementation && typeof this.implementation == 'function');
  },  
  
  //indicates if this example group has any examples
  hasExamples : function(){
    return (this.isConcrete() && this.examples.length > 0);
  },
  
  // add an example to this example group
  addExample : function(example){
    this.examples.push(example);
  }
});

// returns current example group
Inspec.ExampleGroup.current = function(){
  return Inspec.Environment.getInstance().getExampleGroupManager().currentExampleGroup();
};

// sets before each for current example group
Inspec.ExampleGroup.setBeforeEach = function(implementation){
  this.current().setBeforeEach(implementation);
};

// sets after each for current example group
Inspec.ExampleGroup.setAfterEach = function(implementation){
  this.current().setAfterEach(implementation);
};

// sets before all for current example group
Inspec.ExampleGroup.setBeforeAll = function(implementation){
  this.current().setBeforeAll(implementation);
};

// sets after all for current example group
Inspec.ExampleGroup.setAfterAll = function(implementation){
  this.current().setAfterAll(implementation);  
};

// creates an exmaple gorup and add it into examplegroup manager
Inspec.ExampleGroup.createExampleGroup = function(description, implementation, shared){
  var exampleGroup = new Inspec.ExampleGroup(description, implementation, shared);
  Inspec.Environment.getInstance().getExampleGroupManager().add(exampleGroup);
};


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


Inspec.Reporter = Inspec.Class.extend({
  init : function(messenger){
    this.messenger = messenger;
    this.subscribeMessages();
  },
  
  log : function(msg){
    Inspec.Environment.getInstance().log(msg);
  },

  subscribeMessages : function(){
    this.messenger.on("beginTest", this.onStartTest, this);
    this.messenger.on("endTest", this.onEndTest, this);
    this.messenger.on("beginExampleGroup", this.onStartExampleGroup, this);
    this.messenger.on("endExampleGroup", this.onEndExampleGroup, this);
    this.messenger.on("beginExample", this.onStartExample, this);
    this.messenger.on("endExample", this.onEndExample, this);
  },
  
  onStartTest : function(message){
    throw new Inspec.NotImplemented();
  },
  
  onEndTest : function(message){
    throw new Inspec.NotImplemented();
  },
  
  onStartExampleGroup : function(message){
    throw new Inspec.NotImplemented();
  },
  
  onEndExampleGroup : function(message){
    throw new Inspec.NotImplemented();
  },
  
  onStartExample : function(message){
    throw new Inspec.NotImplemented();
  },
  
  onEndExample : function(message){
    throw new Inspec.NotImplemented();
  }
});


Inspec.ConsoleReporter = Inspec.Reporter.extend({
  onStartTest : function(message){
    this.log("Start Test");
  },
  
  onEndTest : function(message){
    this.log("End Test");
  },
  
  onStartExampleGroup : function(message){
  },
  
  onEndExampleGroup : function(message){
  },
  
  onStartExample : function(message){
     this.log(this.getDescription(message.example));
  },
  
  onEndExample : function(message){
    var example = message.example;
    var success = message.success;
    var error = message.error;
    if(success)
      this.log("success");
    else{
      if(error instanceof Inspec.ExpectationFailure){
        this.log("Failure : " + error);
      } else if(error instanceof Error){
        this.log("Error : " + error);
      }
    }
  },
  
  getExampleGroupDescription : function(exampleGroup){
    var parent = exampleGroup.getParent();
    var description = exampleGroup.getDescription();
    if(parent)
      description = this.getExampleGroupDescription(parent) + " " + description;
    return description;
  },
  
  getDescription : function(example){
    var desc =  this.getExampleGroupDescription(example.exampleGroup)
      + " " + example.getDescription();
    return desc;
  }
});


Inspec.HtmlReporter = Inspec.Reporter.extend({
  onStartTest : function(message){
    this.document = Inspec.root.document;
    var body = this.document.getElementsByTagName('body')[0];
    var viewport = this.document.createElement('div');
    viewport.id = "inspec";
    body.appendChild(viewport);
    this.viewport = viewport;
  },
  
  onEndTest : function(message){
    console.log("End Test");
  },
  
  onStartExampleGroup : function(message){
  },
  
  onEndExampleGroup : function(message){
  },
  
  onStartExample : function(message){
  },
  
  onEndExample : function(message){
    var example = message.example;
    var success = message.success;
    var error = message.error;
    var description = this.getDescription(message.example);
    
    var result = this.document.createElement('div');
    var title = this.document.createElement('div');
    title.setAttribute("class", "title");
    
    var text = this.document.createElement('div');
    text.setAttribute("class", "description");
    text.innerHTML = description;
    
    var clear = this.document.createElement('br');
    clear.setAttribute("clear", "both");


    var status = this.document.createElement('div');
    status.setAttribute("class", "status");

    if(success){
      result.setAttribute("class", "example success");
      title.appendChild(status);
      title.appendChild(text);
      title.appendChild(clear);
      result.appendChild(title);
    }
    else{
      if(error instanceof Inspec.ExpectationFailure){
        result.setAttribute("class", "example failure");
        title.appendChild(status);
        title.appendChild(text);
        title.appendChild(clear);
        result.appendChild(title);
        var explanation = this.document.createElement('div');
        explanation.setAttribute("class", "explanation");
        explanation.innerHTML = error.toString();
        result.appendChild(explanation);
      } else if (error instanceof Inspec.ExamplePending){
        result.setAttribute("class", "example pending");
        title.appendChild(status);
        title.appendChild(text);
        title.appendChild(clear);
        result.appendChild(title);
      } 
      else if(error instanceof Error){
        result.setAttribute("class", "example error");
        title.appendChild(status);
        title.appendChild(text);
        title.appendChild(clear);
        result.appendChild(title);
        var explanation = this.document.createElement('div');
        explanation.setAttribute("class", "explanation");
        explanation.innerHTML = error.toString();
        result.appendChild(explanation);
      }
    }
    
    this.viewport.appendChild(result);
  },
  
  getExampleGroupDescription : function(exampleGroup){
    var parent = exampleGroup.getParent();
    var description = exampleGroup.getDescription();
    if(parent)
      description = this.getExampleGroupDescription(parent) + " " + description;
    return description;
  },
  
  getDescription : function(example){
    var desc =  this.getExampleGroupDescription(example.exampleGroup)
      + " " + example.getDescription();
    return desc;
  }
});


Inspec.Exception = Inspec.Class.extend({
  init : function(message){
    if(message)
      this.message = message.toString();
  },
  
  toString : function(){
    return this.message;
  }
});

Inspec.ExpectationFailure = Inspec.Exception.extend({});
Inspec.ExamplePending = Inspec.Exception.extend({});
Inspec.NotImplemented = Inspec.Exception.extend({});
Inspec.UnkownEnvironment = Inspec.Exception.extend({});


Inspec.Expectation = Inspec.Class.extend({
  init : function(subject){
    this.subject = subject;
    this.negative = false;
  },
  
  judge : function(matcher){
    var result = matcher.matches();
    if(!result){
		  throw new Inspec.ExpectationFailure(matcher);
    }  
  },
  
  // expect(a).not().toBe(b)
  // expect(a).not().toFail()
  // expect(a).toBeEmpty()
  not  : function(){
    this.negative = !this.negative;
    return this;
  },
  
  // apply to object  
  toEqual : function(expected){
    var matcher = new Inspec.matchers.IdentityMatcher(expected, this.subject, {negative : this.negative});
    this.judge(matcher);    
  },
  
  toBeA : function(expected){
    var matcher = new Inspec.matchers.InstanceMatcher(expected, this.subject, {negative : this.negative});
    this.judge(matcher);  
  },
  
  toBeAtLeast : function(expected){
    var matcher = new Inspec.matchers.ComparisonMatcher(expected, 
        this.subject, {negative : this.negative, operator : ">="});
    this.judge(matcher);
  },

  toBeAtMost : function(expected){
    var matcher = new Inspec.matchers.ComparisonMatcher(expected, 
        this.subject, {negative : this.negative, operator : "<="});
    this.judge(matcher);
  },
  
  // apply to object
  toBeNull : function(){
    this.toEqual(null);
  },
  
  // apply to object
  toBeUndefined : function(){
    this.toBe(anUndefinedValue);
  },
    
  // apply to string, array
  toBeEmpty : function(){
  },
  
  // apply to object
  toBeTrue : function(){
    this.toEqual(true);
  },
  
  // apply to object
  toBeFalse : function(){
    this.toEqual(false);
  },
  
  toBeType : function(expected){
    var matcher = new Inspec.matchers.TypeMatcher(expected, 
        this.subject, {negative : this.negative});
    this.judge(matcher);  
  },
  
  toBeGreaterThan : function(expected){
    var matcher = new Inspec.matchers.ComparisonMatcher(expected, 
        this.subject, {negative : this.negative, operator : ">"});
    this.judge(matcher);
  },

  toBeLessThan : function(expected){
    var matcher = new Inspec.matchers.ComparisonMatcher(expected, 
        this.subject, {negative : this.negative, operator : "<"});
    this.judge(matcher);
  },
  
  toBeWithIn : function(least, most){
    var expected = new Inspec.util.Range(least, most);
    var matcher = new Inspec.matchers.RangeMatcher(expected, 
        this.subject, {negative : this.negative});
    this.judge(matcher);
  },
  
  toHaveLength : function(expected){
    var matcher = new Inspec.matchers.IdentityMatcher(expected, 
      this.subject.length, {negative : this.negative});
    this.judge(matcher);  
  },
  
  toInclude : function(expected){
    
  },
  
  // apply to string
  toMatch : function(pattern){
    
  },  
  
  toRespondTo : function(fnName){
  },
  
  toEql : function(expected){
    var matcher = new Inspec.matchers.EqualityMatcher(expected, this.subject, {negative : this.negative});
    this.judge(matcher);
  },
  
  // apply to object
  toBe : function(expected){

  },

  // apply to function  
  toThrowError : function(){
  },
  
  // apply to string, array
  toHave : function(occurance, property){
  },
  
  // apply to string, array  
  toHaveExactly : function(occurance, property){
  },

  // apply to string, array  
  toHaveAtLeast : function(occurance, property){
  },

  // apply to string, array  
  toHaveAtMost : function(occurance, property){
  }
});

Inspec.Expectation.prototype.toBeAn = Inspec.Expectation.prototype.toBeA;
Inspec.Expectation.prototype.toBe = Inspec.Expectation.prototype.toEql;


Inspec.matchers.Matcher = Inspec.Class.extend({
  init : function(expected, actual, options){
    this.expected = expected;
    this.actual = actual;
    this.negative = options.negative;
    this.result = null;
  },

  matches : function(){
    throw new Inspec.NotImplemented();
  },  

  explain : function(){
    throw new Inspec.NotImplemented();
  },
  
  xor : function(l, r) {
    return (l || r) && !(l && r);
  },
  
  toString : function(){
    return this.explain();
  }
});


Inspec.matchers.ComparisonMatcher = Inspec.matchers.Matcher.extend({
  init : function(expected, actual, options){
    this._super.apply(this, arguments);

    this.operator = options.operator;
  },
  
  matches : function(){
    
    this.result = eval("this.actual" + this.operator + "this.expected");
    this.result = this.xor(this.result, this.negative);
    return this.result;
  },
  
  explain : function(){
    if(this.result == null)this.matches();
    var str = "Expected " + this.actual.toString();
    str += (this.negative ? " not" : "");
    str += " to be " + this.operator + " to " + this.expected;
    if(!this.result)
      return  str; 
  }
});


Inspec.matchers.EqualityMatcher = Inspec.matchers.Matcher.extend({
  matches : function(){
    this.result = (this.expected == this.actual);
    this.result = this.xor(this.result, this.negative);
    return this.result;
  },
  
  explain : function(){
    if(this.result == null)this.matches();
    var str = "Expected " + this.actual.toString();
    str += (this.negative ? " not" : "");
    str += " to be identical (===) to " + this.expected;
    if(!this.result)
      return  str; 
  }
});


Inspec.matchers.IdentityMatcher = Inspec.matchers.Matcher.extend({
  matches : function(){
    this.result = (this.expected === this.actual);
    this.result = this.xor(this.result, this.negative);
    return this.result;
  },
  
  explain : function(){
    if(this.result == null)this.matches();
    var str = "Expected " + this.actual.toString();
    str += (this.negative ? " not" : "");
    str += " to be identical (===) to " + this.expected;
    if(!this.result)
      return  str; 
  }
});





Inspec.matchers.InstanceMatcher = Inspec.matchers.Matcher.extend({
  matches : function(){
    this.result = (this.actual instanceof this.expected);
    this.result = this.xor(this.result, this.negative);
    return this.result;
  },
  
  explain : function(){
    if(this.result == null)this.matches();
    var str = "Expected " + this.actual;
    str += (this.negative ? " not" : "");
    str += " to be an instance of '" + this.expected + "'";
    if(!this.result)
      return  str;
  }
});





Inspec.matchers.RegexMatcher = Inspec.matchers.Matcher.extend({
  matches : function(){
    this.result = (this.actual.toString().match(this.expected));
    this.result = this.xor(this.result, this.negative);
    return this.result;
  },
  
  explain : function(){
    if(this.result == null)this.matches();
    var str = "Expected " + this.actual.toString();
    str += (this.negative ? " not" : "");
    str += " to be identical (===) to " + this.expected;
    if(!this.result)
      return  str; 
  }
});


Inspec.matchers.TypeMatcher = Inspec.matchers.Matcher.extend({
  matches : function(){
    this.result = (typeof this.actual === this.expected);
    this.result = this.xor(this.result, this.negative);
    return this.result;
  },
  
  explain : function(){
    if(this.result == null)this.matches();
    var str = "Expected " + this.actual;
    str += (this.negative ? " not" : "");
    str += " to be type '" + this.expected + "'";
    str += ", but was type '" + typeof this.actual + "'";
    if(!this.result)
      return  str;
  }
});


Inspec.Environment = Inspec.Class.extend({
  init : function(){
    this.initFacility();
  },
  
  initFacility : function(){
    this.messenger = new Inspec.util.Messenger();
    this.exampleGroupManager = new Inspec.ExampleGroupManager();
    var reporter = this.reporterClass();
    this.reporter = new reporter(this.messenger);
    this.runner = new Inspec.Runner(this.exampleGroupManager.root, this.messenger);
  },
  
  getExampleGroupManager : function(){
    return this.exampleGroupManager;
  },
  
  getMessenger : function(){
    return this.messenger;
  },
  
  getReporter : function(){
    return this.reporter;
  },
  
  getRunner : function(){
    return this.runner;
  },
  
  run : function(){
    this.exampleGroupManager.prepare();
    this.runner.execute();
  },
  
  
  load : function(location){
    var specScript = this.preprocess(this.loadFile(location));
    // using "new Function" approach, so the scope chain is empty
    var fn = new Function("dsl", specScript);
    // assigning default scope as the global scope
    fn.call(Inspec.root, Inspec.options.dsl);
  },
  
  preprocess : function(specScript){
    return "with (dsl) { " + specScript + " }";
  },
  
  reporterClass : function(){
    throw new Inspec.NotImplemented();
  },
	
  loadFile : function(location){
    throw new Inspec.NotImplemented();
  },
  
  log : function(msg){
    throw new Inspec.NotImplemented();
  }
});

Inspec.Environment.getInstance = function(){
  if(!Inspec.Environment._instance){
  	if(Inspec.root.navigator)
		  Inspec.Environment._instance = new Inspec.BrowserEnvironment();
	  else if(Inspec.root.load)
		  Inspec.Environment._instance = new Inspec.RhinoEnvironment();
	  else if(Inspec.root.WScript)
		  Inspec.Environment._instance = new Inspec.WScriptEnvironment();
		else
		  throw new Inspec.UnkownEnvironment();
  }
  return Inspec.Environment._instance;
};


Inspec.BrowserEnvironment = Inspec.Environment.extend({
  reporterClass : function(){
    return Inspec.HtmlReporter;
  },
	
  loadFile : function(location){
    if (window.XMLHttpRequest)
      var ajax=new XMLHttpRequest();
    else
      var ajax=new ActiveXObject("Microsoft.XMLHTTP");
    
    if(ajax){
      ajax.open("GET", location, false);
      ajax.send(null);
      return ajax.responseText;
    } else {
      return null;
    }
  },
  
  log : function(msg){
    //yeah...it's not that nice, but... it works
    if(console && console.log && typeof console.log == "function")
      console.log(msg);
  }
});


Inspec.RhinoEnvironment = Inspec.Environment.extend({
  reporterClass : function(){
    return Inspec.ConsoleReporter;
  },
	
  loadFile : function(location){
    return readFile(location);
  },

  log : function(mgs){
    print(msg);
  }
});


Inspec.WScriptEnvironment = Inspec.Environment.extend({
  reporterClass : function(){
    return Inspec.ConsoleReporter;
  },
	
  loadFile : function(location){
		var fso = new Inspec.root.ActiveXObject('Scripting.FileSystemObject');
		var file;
		try {
			file = fso.OpenTextFile(location);
			return file.ReadAll();
		} finally {
			try {if(file) file.Close();} catch(ignored) {}
		}
  },
  
  log : function(msg){
    Inspec.root.WScript.Echo(msg);
  }
  
});


Inspec.options.dsl = Inspec.dsl.BDD;