describe("Inspec", function(){
  it("should pass example when it supposed to pass", function(){
    expect(true).to(be, true)
  })
  
  it("should fail example when it supposed to fail", function(){
    expect(true).to(be, false)
  })

  it("should error example when it supposed to error", function(){
    i.dont.exist()
  })

  it("example should be pending when it supposed to be pending")
  
})