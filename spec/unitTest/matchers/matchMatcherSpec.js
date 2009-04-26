describe("Matchers", function(){
  describe("match", function(){
    var matcher = Inspec.Matchers.match;
    var actual = "hello world";
    var expectedPass = /^hello/;
    var expectedFail = /^Hello/;
    var errMsg = 'expected "hello world" to match /^Hello/'
    var negativeErrMsg = 'expected "hello world" to not match /^hello/'
    
    itShouldBehaveLike("a standard matcher")
  })  
})
