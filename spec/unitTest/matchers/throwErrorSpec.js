describe("Matchers", function(){
  describe("throwError", function(){
    var matcher = Inspec.Matchers.throwError;
    var expected;
    var actualPass = function(){it.should.not.work._for_.sure};
    var actualFail = function(){};

    var errMsg = 'expected \nfunction () to throw error'
    var negativeErrMsg = 'expected \nfunction () to not throw error'

    itShouldBehaveLike("a standard matcher")      
  })
})