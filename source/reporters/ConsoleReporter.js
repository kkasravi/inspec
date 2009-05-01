Inspec.ConsoleReporter = Inspec.Reporter.extend({
  onStartTest : function(message){
    this.log("Start Test");
  },
  
  onEndTest : function(message){
    this.log("End Test");
  },
  
  onStartExampleGroup : function(message){
  },
  
  onEndExampleGroup : function(message){
  },
  
  onStartExample : function(message){
     this.log(this.getDescription(message.example));
  },
  
  onEndExample : function(message){
    var example = message.example;
    var success = message.success;
    var error = message.error;
    if(success)
      this.log("success");
    else{
      if(error instanceof Inspec.ExpectationFailure){
        this.log("Failure : " + error);
      } else if(error instanceof Error){
        this.log("Error : " + error);
      }
    }
  }
});
