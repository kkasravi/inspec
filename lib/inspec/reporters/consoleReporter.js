(function(){var mod=function(require, exports){
  
  var Reporter = require('../reporter').Reporter;
  var ExpectationFailure = require('../exceptions').exceptions.ExpectationFailure;
  var ExamplePending = require('../exceptions').exceptions.ExamplePending;

  var pendings = [];
  var failures = [];
  var errors = [];

  var ConsoleReporter = Reporter.extend({
    red : function(message){
      // before term module is usable...
      // this is a temp fix
      //term.stream.update("0", term.colors.red, "");
      message = '\033[31m' + message + '\033[0m';
      this.write(message);
      //term.stream.update("0", "", "");
    },

    green : function(message){
      // before term module is usable again...
      // this is a temp fix
      //term.stream.update("0", term.colors.green, "");
      message = '\033[32m' + message + '\033[0m';
      this.write(message);      
      //term.stream.update("0", "", "");
    },
    
    yellow : function(message){
      // before term module is usable again...
      // this is a temp fix
      //term.stream.update("0", term.colors.yellow, "");
      message = '\033[33m' + message + '\033[0m';
      this.write(message);      
      //term.stream.update("0", "", "");
    },
            
    onStartTest : function(message){
    },

    onEndTest : function(message){
      this.print();
      this.print();
      this.print("Pending: ");
      for(var i=0; i < pendings.length; i++) {
        pending = pendings[i];
        this.print(this.getDescription(pending.example));
      }
      this.print();
      this.print();
      
      var count = 1;
      
      for(var i=0; i < failures.length; i++, count++) {
        this.print("" + (count) + ")");
        failure = failures[i];
        this.red("'" + this.getDescription(failure.example) + "' FAILED");
        this.print();
        this.print(failure.error);
        this.print();
      }
      
      for(var i=0; i < errors.length; i++, count++) {
        this.print("" + (count) + ")");
        error = errors[i];
        this.red(error.error.name + " in '" + this.getDescription(error.example) + "'");
        this.print();
        this.print(error.error);
        this.print();
      }
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
          failures.push({example : example, error : error});
          this.red("F");
        } else if(error instanceof ExamplePending){
          pendings.push({example : example, error : error});
          this.yellow("*");
        } else if(error instanceof Error){
          errors.push({example : example, error : error});
          this.red("E");
        }
      }
      
      
    }
  });
  
  exports.ConsoleReporter = ConsoleReporter;

};require.install ? require.install('Inspec.dsl',mod) : mod(require, exports);})();
