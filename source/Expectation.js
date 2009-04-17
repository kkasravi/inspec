Inspec.Expectation = Inspec.Class.extend({
  init : function(subject){
    this.subject = subject;
    this.negative = false;
  },
  
  to: function(matcher, expected, not) {
    var matched = matcher.match(expected, actual);
    if (not ? matched : !matched) {
      throw(matcher.failure_message(expected, actual, not));
    }
  },
        
  toNot: function(matcher, expected) {
    this.to(matcher, expected, true);
  }
});
