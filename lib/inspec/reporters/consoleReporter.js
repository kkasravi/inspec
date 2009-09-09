(function(){var mod=function(require, exports){
  
  var Reporter = require('../reporter').Reporter;
  var ExpectationFailure = require('../exceptions').exceptions.ExpectationFailure;

  var ConsoleReporter = Reporter.extend({
    red : function(message){
      // before term module is usable...
      // this is a temp fix
      //term.stream.update("0", term.colors.red, "");
      message = '\033[31m' + message + '\033[0m'
      this.write(message);
      //term.stream.update("0", "", "");
    },

    green : function(message){
      // before term module is usable again...
      // this is a temp fix
      //term.stream.update("0", term.colors.green, "");
      message = '\033[32m' + message + '\033[0m'
      this.write(message);      
      //term.stream.update("0", "", "");
    },
            
    onStartTest : function(message){
      this.print("\nStart Test");
    },

    onEndTest : function(message){
      this.print("\nEnd Test");
    },

    onStartExampleGroup : function(message){
    },

    onEndExampleGroup : function(message){
      var exampleGroup = message.exampleGroup;
      var error = message.error;
      if(error){
        this.print(this.getExampleGroupDescription(exampleGroup));
        if(error instanceof ExpectationFailure){
          this.red("[Failure] ");
          this.print(error);
        } else if(error instanceof Error){
          this.red("[Error] ");
          this.print(error);
        }
      }
    },

    onStartExample : function(message){
    },

    onEndExample : function(message){
      var example = message.example;
      var success = message.success;
      var error = message.error;
      if(success)
        this.green(".");
      else{
        if(error instanceof ExpectationFailure){
          this.red("F");
        } else if(error instanceof Error){
          this.red("E");
        }
      }
    }
  });
  
  exports.ConsoleReporter = ConsoleReporter;

};require.install ? require.install('Inspec.dsl',mod) : mod(require, exports);})();
