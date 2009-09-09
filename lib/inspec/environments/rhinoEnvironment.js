(function(){var mod=function(require, exports){
  
  var Environment = require('../environment').Environment;
  var ConsoleReporter = require('../reporters/consoleReporter').ConsoleReporter;
  
  var RhinoEnvironment = Environment.extend({
    reporterClass : function(){
      return ConsoleReporter;
    },

    loadFile : function(location){
      return readFile(location);
    },

    print : function(msg){
      print(msg);
    },
    
    write : function(msg){
      Packages.java.lang.System.out.print(String(msg));
    }
    

  });
  
  exports.RhinoEnvironment = RhinoEnvironment;

};require.install ? require.install('Inspec',mod) : mod(require, exports);})();
