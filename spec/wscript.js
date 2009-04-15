(function(){
  var loadFile = function(location){
		var fso = new ActiveXObject('Scripting.FileSystemObject');
		var file;
		try {
			file = fso.OpenTextFile(location);
			WScript.Echo(location);
			eval(file.ReadAll());
		} finally {
			try {if(file) file.Close();} catch(ignored) {}
		}
  };

loadFile("../dest/inspec.js");

Inspec
  .load('example.js', 'matchersSpec.js')
  .run();

})();
