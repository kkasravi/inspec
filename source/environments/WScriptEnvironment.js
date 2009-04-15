Inspec.WScriptEnvironment = Inspec.Environment.extend({
  reporterClass : function(){
    return Inspec.ConsoleReporter;
  },
	
  loadFile : function(location){
		var fso = new Inspec.root.ActiveXObject('Scripting.FileSystemObject');
		var file;
		try {
			file = fso.OpenTextFile(location);
			return file.ReadAll();
		} finally {
			try {if(file) file.Close();} catch(ignored) {}
		}
  },
  
  log : function(msg){
    Inspec.root.WScript.Echo(msg);
  }
  
});
