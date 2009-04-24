Inspec.Behavior = Inspec.TreeNode.extend({
  init : function(description){
    this._super(description, []);
  },

  getExampleGroup : function(index){
    return this.getExampleGroups()[index];
  },
  
  addExampleGroup : function(exampleGroup){
    exampleGroup.setBehavior(this);
    return this.getExampleGroups().push(exampleGroup);
  }
});

Inspec.Behavior.prototype.getExampleGroups = Inspec.Behavior.prototype.getContent;
Inspec.Behavior.prototype.getDescription = Inspec.Behavior.prototype.getName;


Inspec.Behavior.current = function(){
  return Inspec.Environment.getInstance().getExampleGroupManager().currentBehavior;
};

