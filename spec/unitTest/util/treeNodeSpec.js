describe("Inspec.util.TreeNode", function(){
  var klass = Inspec.util.TreeNode

  it("should be accessible", function(){
    expect(klass).to(beA, Function)
  })
  
  describe("class methods", function(){
    var ary = [3, 4, 5, 12, 2, 4, 11]

    it("#max should return the largest element in an array", function(){
      expect(klass.max(ary)).to(be, 12)
    })
    
    it("#min should return the smallest element in an array", function(){
      expect(klass.min(ary)).to(be, 2)
    })
  })

  describe("instance methods", function(){
    beforeEach(function(){
      this.root = new klass("root", 0);
      this.firstLevel = [];
      this.secondLevel = [];
      var current = this.root;
      for(var i=0; i< 5; i++){
        var node = new klass("level1 #" + i, i);
        current.add(node);
        this.firstLevel.push(node);
        
        var temp = current;
        current = node;
        this.secondLevel.push([]);
        for(var j=0; j<5; j++){
          var node = new klass("level2 #" + i + ":" + j, j);
          current.add(node);
          this.secondLevel[i].push(node);
        }
        current = temp;
      }
    })
    
    describe("#constructor", function(){
      it("should create a node", function(){
        var node = new klass("root", [1,2,3])
        expect(node).to(beA, klass)
      })

      it("should not create a node with name ", function(){
        expect(function(){new klass(null, [1,2,3])}).to(throwError)
      })
      
      it("should initialize all variables", function(){
        var name = "root"
        var content = [1,2,3]
        var node = new klass(name, content)

        expect(node._parent).to(beNull)
        expect(node._name).to(be, name)
        expect(node._content).to(be, content)
        expect(node._children).to(beEmpty)
        expect(node._childrenHash).to(be, {})
      })
    })

    describe("#add", function(){
      beforeEach(function(){
        this.parent = this.root;
        this.child = this.firstLevel[0];
      })
      
      it("should add child to parent", function(){
        expect(this.parent._children).to(have, this.child)
        expect(this.parent._childrenHash).to(have, 0)
      })
      
      it("should throw error when adding same child twice", function(){
        expect(function(){
          this.parent.add(this.child)  
        }).to(throwError)
      })
      
      it("should set parent attribute in child", function(){
        expect(this.child._parent).to(be, this.parent)
      })
      
      it("should return added child", function(){
        var node = new klass("new node", 123);
        var added = this.root.add(node)
        expect(added).to(be, node)
      })
    })

    describe("#breadth", function(){
      it("should return 1 if node is root", function(){
        expect(this.root.breadth()).to(be,1)
      })
      
      it("should return sibling size if node is not root", function(){
        expect(this.firstLevel[0].breadth()).to(be, this.firstLevel.length)
      })
    })

    describe("#breathEach", function(){
      it("should work")

    })

    describe("#depth", function(){
      it("should work")

    })

    describe("#each", function(){
      it("should work")
    })

    describe("#eachChild", function(){
      it("should work")
    })

    describe("#eachLeaf", function(){
      it("should work")
    })

    describe("#eachSibling", function(){
      it("should work")
    })

    describe("#get", function(){
      it("should get child by name", function(){
        expect(this.root.get("level1 #2")).to(be, this.firstLevel[2])
      })
      
      it("should throw error if no content provided", function(){
        expect(function(){this.root.get()}).to(throwError)
      })
      
      it("should return null if child not found", function(){
        expect(this.root.get("I dont Exist")).to(beNull)
      })
    })

    describe("#getAllParents", function(){
      it("should work")
    })

    describe("#getAt", function(){
      it("should get child by position", function(){
        expect(this.root.getAt(2)).to(be, this.firstLevel[2])
      })
      
      it("should throw error if no content provided", function(){
        expect(function(){this.root.getAt()}).to(throwError)
      })
      
      it("should return null if child not found", function(){
        expect(this.root.getAt(-1)).to(beNull)
        expect(this.root.getAt(this.firstLevel.length+100)).to(beNull)
      })
      
      it("should get child at position 0", function(){
        expect(this.root.getAt(0)).to(be, this.firstLevel[0])
      })
    })

    describe("#getContent", function(){
      it("should return content", function(){
        var node = new klass("root", "pizza")
        expect(node.getContent()).to(be, "pizza")
      })
      
      it("should return undefined if no content provided", function(){
        var node = new klass("a node with no content")
        expect(node.getContent()).to(beUndefined)
      })
    })

    describe("#getFirstChild", function(){
      it("should work")
    })

    describe("#getFirstSibling", function(){
      it("should work")
    })

    describe("#getLastChild", function(){
      it("should work")
    })

    describe("#getLastSibling", function(){
      it("should work")
    })
    
    describe("#getNextSibling", function(){
      it("should work")
    })

    describe("#getPreviousSibling", function(){
      it("should work")
    })
    
    describe("#getName", function(){
      it("should return name", function(){
        expect(this.root.getName()).to(be, "root")
      })
    })

    describe("#getParent", function(){
      it("should return parent", function(){
        var child = this.firstLevel[1]
        var parent = this.root
        var grandChild = this.secondLevel[1][2]
        
        expect(child.getParent()).to(be, parent)
        expect(grandChild.getParent()).to(be, child)        
      })
      
      it("should return null if root", function(){
        expect(this.root.getParent()).to(beNull)
      })
    })


    describe("#getRoot", function(){
      it("should return root from children", function(){
        for(var i=0; i< this.firstLevel.length; i++)
          expect(this.firstLevel[i].getRoot()).to(be, this.root)
      })
      
      it("should return root from grand children", function(){
        for(var i=0; i< this.firstLevel.length; i++)
          for(var j=0; j < this.firstLevel[i].length; j++)
            expect(this.firstLevel[i][j].getRoot()).to(be, this.root)
      })
      
      it("should return itself if root", function(){
        expect(this.root.getRoot()).to(be, this.root)
      })
    })

    describe("#hasChildren", function(){
      it("should return true if node has children", function(){
        var node = this.root
        expect(node.hasChildren()).to(be, true)
      })

      it("should return false if node has children", function(){
        var node = this.secondLevel[0][0]
        expect(node.hasChildren()).to(be, false)
      })
      
    })

    describe("#hasContent", function(){
      it("should return true if node has content", function(){
        var node = new klass("node", 123)
        expect(node.hasContent()).to(be, true)
      })
      
      it("should return true if node has no content", function(){
        var node = new klass("node")
        expect(node.hasContent()).to(be, false)        
      })

      it("should return false if content is null", function(){
        var node = new klass("node", null)
        expect(node.hasContent()).to(be, false)        
      })
      
      it("should return true if content is 0", function(){
        var node = new klass("node", 0)
        expect(node.hasContent()).to(be, true)        
      })      
    })

    describe("#isFirstSibling", function(){
      it("should return true if node is first sibling", function(){
        var node = this.firstLevel[0]
        expect(node.isFirstSibling()).to(be, true)
      })

      it("should return false if node is not first sibling", function(){
        var node = this.firstLevel[1]
        expect(node.isFirstSibling()).to(be, false)
      })
      
      it("should return true if root", function(){
        expect(this.root.isFirstSibling()).to(be, true)
      })
    })

    describe("#isLastSibling", function(){
      it("should return true if node is first sibling", function(){
        var node = this.firstLevel[this.firstLevel.length -1]
        expect(node.isLastSibling()).to(be, true)
      })

      it("should return false if node is not first sibling", function(){
        var node = this.firstLevel[1]
        expect(node.isLastSibling()).to(be, false)
      })
      
      it("should return true if root", function(){
        expect(this.root.isLastSibling()).to(be, true)
      })
    })

    describe("#isLeaf", function(){
      it("should return true if node is leaf", function(){
        var node = this.secondLevel[0][0]
        expect(node.isLeaf()).to(be, true)
      })

      it("should return false if node is not leaf", function(){
        var node = this.firstLevel[0]
        expect(node.isLeaf()).to(be, false)
      })
      
      it("should return true if root is leaf", function(){
        var node = new klass("another root", 0)
        expect(node.isLeaf()).to(be, true)
      })

      it("should return false if root is not leaf", function(){
        expect(this.root.isLeaf()).to(be, false)
      })
    })

    describe("#isOnlyChild", function(){
      it("should return true if node is only child", function(){
        var node = this.secondLevel[0][0].add(new klass("only child", 1122))
        expect(node.isOnlyChild()).to(be, true)
      })

      it("should return false if node is not only child", function(){
        var node = this.secondLevel[0][0]
        expect(node.isOnlyChild()).to(be, false)
      })
      
      it("should return true if node is root", function(){
        expect(this.root.isOnlyChild()).to(be, true)
      })
    })

    describe("#isRoot", function(){
      it("should return true if node is root", function(){
        expect(this.root.isRoot()).to(be, true)
      })
      
      it("should return false if node is not root", function(){
        expect(this.firstLevel[0].isRoot()).to(be, false)
      })
    })

    describe("#length", function(){
      it("should return the length of child nodes", function(){
        expect(this.root.length()).to(be, this.firstLevel.length)
      })
      
      it("should return 0 if node has no children", function(){
        expect(this.secondLevel[0][0].length()).to(be, 0)
      })
    })

    describe("#position", function(){
      it("should return position of node in parent", function(){
        expect(this.firstLevel[3].position()).to(be, 3)
      })

      it("should return -1 of node is root", function(){
        expect(this.root.position()).to(be, -1)
      })
    })

    describe("#preorderedEach", function(){
      it("should work")
    })

    describe("#remove", function(){
      var doRemove = function(parent, child){
        rv = {}
        rv.parent = parent
        rv.child = child
        rv.oldLength = parent._children.length
        rv.deleted = parent.remove(child)
        rv.newLength = parent._children.length
        return rv;
      }
      
      it("should remove child", function(){
        var child = this.secondLevel[0][0]
        var parent = this.firstLevel[0]
        var result = doRemove(parent, child)
        expect(result.oldLength - result.newLength).to(be, 1)
      })

      it("should set the parent of the removed node to null", function(){
        var child = this.secondLevel[0][0]
        var parent = this.firstLevel[0]
        var result = doRemove(parent, child)
        expect(result.child._parent).to(be, null)
      })
      
      it("should return the deleted node", function(){
        var child = this.secondLevel[0][0]
        var parent = this.firstLevel[0]
        var result = doRemove(parent, child)
        expect(result.deleted).to(be, child)
      })

      it("should do nothing if the node is not a child of parent", function(){
        var child = this.secondLevel[1][0]
        var parent = this.firstLevel[0]
        var result = doRemove(parent, child)
        
        expect(result.oldLength).to(be, result.newLength)
      })

      it("should do nothing if the node is undefined", function(){
        var child = null
        var parent = this.firstLevel[0]
        var result = doRemove(parent, child)
        
        expect(result.oldLength).to(be, result.newLength)
      })


    })

    describe("#removeAll", function(){
      it("should work")
    })

    describe("#removeFromParent", function(){
      it("should work")
    })

    describe("#setAsRoot", function(){
      it("should work")
    })

    describe("#setContent", function(){
      it("should work")
    })

    describe("#setParent", function(){
      it("should work")
    })

    describe("#size", function(){
      it("should work")
    })
  })
})
