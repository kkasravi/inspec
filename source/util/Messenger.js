Inspec.util.Messenger = function(){
  this.events = {};
};

Inspec.util.Messenger.prototype = {
  send : function(subject, message){
    var handlers = this.events[subject];
    if(!handlers) return;
    for(var i=0; i<handlers.length; i++)
      handlers[i].fn.call(handlers[i].scope, message);
  },
  
  on : function(subject, fn, scope){
    this.events[subject] = this.events[subject] || [];
    var handler = {};
    handler.fn = fn;
    handler.scope = scope || this;
    this.events[subject].push(handler);
  },
  
  un : function(subject, fn, scope){
    var handlers = this.events[subject];
    if(!handlers) return;
    scope = scope || this;
    for(var i=0; i<handlers.length; i++)
      if(handlers[i].fn === fn && handlers[i].scope === scope)
        handlers.splice(i--, 1);
  }
};

Inspec.messenger = new Inspec.util.Messenger();
