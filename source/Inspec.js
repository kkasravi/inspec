var Inspec={};
Inspec.util = {};
Inspec.reporters = {};
Inspec.matchers = {};
Inspec.reporters = {};
Inspec.dsl = {};
Inspec.options = {};

Inspec.root = this;

Inspec.load = function(){
  var files = [];
  while(arguments.length){
    var temp = Array.prototype.shift.call(arguments);
    if(temp.length && temp.length > 0){
      files = files.concat(temp);
    } else if(typeof temp == "string"){
      files.push(temp);
    }
  }
  var env = Inspec.Environment.getInstance();
  for(var i=0; i< files.length; i++){
    env.load(files[i]);
  }
  return this;
};

Inspec.run = function(){
  var env = Inspec.Environment.getInstance();
  env.run();
}

Inspec.merge = function(a, b){
  var rv = this.clone(a);
  for(var i in b) rv[i] = b[i];
  return rv;
}

Inspec.clone = function(a) {
  var rv = {};
  for(var i in a) rv[i] = a[i];
  return rv;
}
