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
        this.parent = new klass("parent", 1)
        this.child = new klass("child", 2)
        this.added = this.parent.add(this.child)
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
        expect(this.added).to(be, this.child)
      })
    })

    describe("#breadth", function(){
      it("should return 1 if node is root", function(){
        var root = new klass("root", [1,2,3])
        expect(root.breadth()).to(be,1)
      })
      
      it("should return sibling size if node is not root", function(){
        var root = new klass('root', 1)
        for(var i=0; i<10; i++){
          var last = new klass('child'+i, i)
          root.add(last)
        }
        expect(last.breadth()).to(be, 10)
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
      beforeEach(function(){
        this.children=[]
        this.root = new klass("root", "root")
        for(var i=0; i< 10; i++)
          this.children.push(this.root.add(new klass("n" + i, i)))
      })
      
      it("should get child by name", function(){
        expect(this.root.get("n5")).to(be, this.children[5])
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
      beforeEach(function(){
        this.children=[]
        this.root = new klass("root", "root")
        for(var i=0; i< 10; i++)
          this.children.push(this.root.add(new klass("n" + i, i)))
      })
    
      it("should get child by position", function(){
        expect(this.root.getAt(2)).to(be, this.children[2])
      })
      
      it("should throw error if no content provided", function(){
        expect(function(){this.root.getAt()}).to(throwError)
      })
      
      it("should return null if child not found", function(){
        expect(this.root.getAt(-1)).to(beNull)
      })
      
      it("should get child at position 0", function(){
        expect(this.root.getAt(2)).to(be, this.children[2])
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
        var node = new klass("root", 88)
        expect(node.getName()).to(be, "root")
      })
    })

    describe("#getParent", function(){
      beforeEach(function(){
        this.children=[]
        this.root = new klass("root", "root")
        for(var i=0; i< 10; i++)
          this.children.push(this.root.add(new klass("n" + i, i)))
      })
      
      it("should return parent", function(){
        expect(this.children[0].getParent()).to(be, this.root)
      })
      
      it("should return null if root", function(){
        expect(this.root.getParent()).to(beNull)
      })
    })


    describe("#getRoot", function(){
      beforeEach(function(){
        this.children=[]
        this.root = new klass("root", "root")
        this.currentNode = this.root
        for(var i=0; i< 10; i++){
          this.currentNode = this.currentNode.add(new klass("n" + i, i))
          this.children.push(this.currentNode)
        }
      })
      
      it("should return root from children", function(){
        expect(this.children[8].getRoot()).to(be, this.root)
        expect(this.children[9].getRoot()).to(be, this.root)
      })
      
      it("should return itself if root", function(){
        expect(this.root.getRoot()).to(be, this.root)
      })      
    })

    describe("#hasChildren", function(){
      it("should work")      
    })

    describe("#hasContent", function(){
      it("should work")
    })

    describe("#isFirstSibling", function(){
      it("should work")
    })

    describe("#isLastSibling", function(){
      it("should work")
    })

    describe("#isLeaf", function(){
      it("should work")
    })

    describe("#isOnlyChild", function(){
      it("should work")
    })

    describe("#isRoot", function(){
      it("should work")
    })

    describe("#length", function(){
      it("should work")
    })

    describe("#position", function(){
      it("should work")
    })

    describe("#preorderedEach", function(){
      it("should work")
    })

    describe("#remove", function(){
      it("should work")
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
