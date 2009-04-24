// classify TreeNode
Inspec.TreeNode = (function(){
  var TreeNode = Inspec.Class.extend(Inspec.util.TreeNode.prototype);
  TreeNode.prototype.init = Inspec.util.TreeNode;
  return TreeNode;
})();