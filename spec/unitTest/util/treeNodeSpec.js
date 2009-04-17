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
        this.parent.add(this.child)
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
    })

    describe("#breath", function(){
    })

    describe("#breathEach", function(){
    })

    describe("#depth", function(){
    })

    describe("#each", function(){
    })

    describe("#eachChild", function(){
    })

    describe("#eachLeaf", function(){
    })

    describe("#eachSibling", function(){
    })

    describe("#get", function(){
    })

    describe("#getAllParents", function(){
    })

    describe("#getAt", function(){
    })

    describe("#getContent", function(){
    })

    describe("#getFirstChild", function(){
    })

    describe("#getFirstSibling", function(){
    })

    describe("#getLastChild", function(){
    })

    describe("#getLastSibling", function(){
    })

    describe("#getName", function(){
    })

    describe("#getNextSibling", function(){
    })

    describe("#getParent", function(){
    })

    describe("#getPreviousSibling", function(){
    })

    describe("#getRoot", function(){
    })

    describe("#hasChildren", function(){
    })

    describe("#hasContent", function(){
    })

    describe("#isFirstSibling", function(){
    })

    describe("#isLastSibling", function(){
    })

    describe("#isLeaf", function(){
    })

    describe("#isOnlyChild", function(){
    })

    describe("#isRoot", function(){
    })

    describe("#length", function(){
    })

    describe("#position", function(){
    })

    describe("#preorderedEach", function(){
    })

    describe("#remove", function(){
    })

    describe("#removeAll", function(){
    })

    describe("#removeFromParent", function(){
    })

    describe("#setAsRoot", function(){
    })

    describe("#setContent", function(){
    })

    describe("#setParent", function(){
    })

    describe("#size", function(){
    })
  })
})
