Inspec.Matchers = {
  expect : function(actual){
    return {
      to: function(matcher, expected, not) {
        var matched = matcher.match(expected, actual);
        if (not ? matched : !matched) {
          throw(new Inspec.ExpectationFailure(matcher.failureMessage(expected, actual, not)));
        }
      },
      
      toNot: function(matcher, expected) {
        this.to(matcher, expected, true);
      }
    }
  },
  
  equal: {
    match: function(expected, actual) {
      if (expected instanceof Array) {
        for (var i = 0; i < actual.length; i++)
          if (!Inspec.Matchers.equal.match(expected[i], actual[i])) return false;
        return actual.length == expected.length;
      } else if (expected instanceof Object) {
        for (var key in expected)
          if (expected[key] != actual[key]) return false;
        for (var key in actual)
          if (actual[key] != expected[key]) return false;
        return true;
      } else {
        return expected == actual;
      }
    },
    
    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not equal ' : ' to equal ') + Inspec.util.print(expected);
    }
  },
  
  match: {
    match: function(expected, actual) {
      if (expected.constructor == RegExp)
        return expected.exec(actual.toString());
      else
        return actual.indexOf(expected) > -1;
    },
    
    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not match ' : ' to match ') + Inspec.util.print(expected);
    }
  },
  
  beEmpty: {
    match: function(expected, actual) {
      // if loop is started, then actual is not empty
      for(var index in actual){
        if(!Array.prototype[index]) return false;
      }
      // if actuall is empty, it should go directly here
      return true;
    },
    
    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not be empty' : ' to be empty');
    }
  },

  haveLength: {
    match: function(expected, actual) {
      if (actual.length == undefined) throw(new Inspec.ExpectationFailure(actual.toString() + " does not respond to length"));

      return actual.length == expected;
    },

    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not' : ' to') + ' have length ' + expected;
    }
  },

  beNull: {
    match: function(expected, actual) {
      return actual == null;
    },

    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not be null' : ' to be null');
    }
  },

  beUndefined: {
    match: function(expected, actual) {
      return actual == undefined;
    },

    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not be undefined' : ' to be undefined');
    }
  },

  beTrue: {
    match: function(expected, actual) {
      return actual;
    },

    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not be true' : ' to be true');
    }
  },

  beFalse: {
    match: function(expected, actual) {
      return !actual;
    },

    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not be false' : ' to be false');
    }
  },
  
  beA: {
    match: function(expected, actual) {
      return (actual instanceof expected);
    },

    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not be' : ' to be')  +  ' an instance of ' + Inspec.util.print(expected);
    }
  },

  throwError: {
    match: function(expected, actual) {
      try{actual()}catch(e){return true;}
      return false;
    },

    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not' : ' to')  +  ' throw error';
    }
  },
  
  respondTo: {
    match: function(expected, actual) {
      return actual[expected] && typeof actual[expected] == "function";
    },

    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not' : ' to')  +  ' respond to ' + Inspec.util.print(expected);
    }    
  },
  
  have: {
    match: function(expected, actual) {
      for(var i in actual)
        if(actual[i] == expected)
          return true;
      return false;
    },

    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not' : ' to')  +  ' have ' + Inspec.util.print(expected);
    }
  }
};

Inspec.Matchers.be = Inspec.Matchers.eql = Inspec.Matchers.equal;
