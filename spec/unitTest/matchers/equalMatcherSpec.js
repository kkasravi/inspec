describe("Equal Matcher", function(){
  describe("comparing two strings", function(){
    beforeAll(function(){
      this.matcher = Inspec.Matchers.equal;
      var actual = "pizza";
      var expectedPass = "pizza";
      var expectedFail = "pie";
      this.passArgs = [actual, expectedPass]
      this.failArgs = [actual, expectedFail]
      this.errMsg = 'expected "pie" to equal "pizza"'
      this.negativeErrMsg = 'expected "pizza" to not equal "pizza"'
    })
    
    itShouldBehaveLike("as a standard matcher")
  })
})
