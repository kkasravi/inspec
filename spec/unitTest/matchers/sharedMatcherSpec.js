sharedExamplesFor("as a standard matcher",function(){
  beforeAll(function(){
    if(!this.matcher || !this.passArgs || !this.failArgs || !this.errMsg || !this.negativeErrMsg){
      throw Error("this.matcher, this.passArgs, this.failArgs, this.errMsg, and this.negativeErrMsg must be supplied")
    }
  })
  
  describe("#match", function(){
    it("should respond to #match", function(){
      expect(this.matcher).to(respondTo, 'match')
    })
    
    it("should return true if pass", function(){
      expect(this.matcher.match.apply(this.matcher, this.passArgs)).to(beTrue)
    })
    
    it("should return false if fail", function(){
      expect(this.matcher.match.apply(this.matcher, this.failArgs)).to(beFalse)
    })
  })
  
  describe("#failureMessage", function(){
    it("should respond to #failureMessage", function(){
      expect(this.matcher).to(respondTo, 'failureMessage')
    })

    it("should return correct message", function(){
      var msg = this.matcher.failureMessage.apply(this.matcher, this.failArgs)
      expect(msg).to(eql, this.errMsg)
    })
    
    it("should return correct message with negation", function(){
      var msg = this.matcher.failureMessage.apply(this.matcher, this.passArgs.concat([true]));
      expect(msg).to(eql, this.negativeErrMsg)
    })
  })
})
