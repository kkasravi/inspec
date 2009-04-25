describe("Matchers", function(){
  describe("equal", function(){
    describe("when comparing two strings", function(){
      var matcher = Inspec.Matchers.equal;
      var actual = "pizza";
      var expectedPass = "pizza";
      var expectedFail = "pie";
      var errMsg = 'expected "pizza" to equal "pie"'
      var negativeErrMsg = 'expected "pizza" to not equal "pizza"'

      itShouldBehaveLike("a standard matcher")
    })
  })  
})
