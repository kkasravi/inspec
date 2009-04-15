Inspec.BrowserEnvironment = Inspec.Environment.extend({
  reporterClass : function(){
    return Inspec.HtmlReporter;
  },
	
  loadFile : function(location){
    if (window.XMLHttpRequest)
      var ajax=new XMLHttpRequest();
    else
      var ajax=new ActiveXObject("Microsoft.XMLHTTP");
    
    if(ajax){
      ajax.open("GET", location, false);
      ajax.send(null);
      return ajax.responseText;
    } else {
      return null;
    }
  },
  
  log : function(msg){
    //yeah...it's not that nice, but... it works
    if(console && console.log && typeof console.log == "function")
      console.log(msg);
  }
});
