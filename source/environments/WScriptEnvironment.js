Inspec.WScriptEnvironment = Inspec.Environment.extend({
  reporterClass : function(){
    return Inspec.ConsoleReporter;
  },
	
  loadFile : function(location){
		var fso = new jsspec.root.ActiveXObject('Scripting.FileSystemObject');
		var file;
		try {
			file = fso.OpenTextFile(location);
			return file.ReadAll();
		} finally {
			try {if(file) file.Close();} catch(ignored) {}
		}
  }
  
  log : function(msg){
    jsspec.root.WScript.Echo(msg);
  }
  
});
