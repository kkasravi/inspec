describe("Inspec", function(){
  it("should work", function(){
    expect(true).to(beTrue);
  })
    
  it("should fail", function(){
    expect(true).toNot(beTrue);
  })

  it("should error", function(){
    it.should.error.out;
  })
  
  it("should be pending")
    
  describe("with a nested example group", function(){
    it("should work as a nested example group", function(){
      expect(true).to(beTrue);
    })
  })

  
  itShouldBehaveLike("a shared example group")
})

sharedExamplesFor("a shared example group", function(){
  it("should work as shared example", function(){
    expect(true).to(beTrue);
  })
  
  describe("with nested example groups in shared", function(){
    it("should work as a nested example group in shared", function(){
      expect(true).to(beTrue);
    })
  })
  
})
