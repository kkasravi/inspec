Inspec.Matchers = {
  expect : function(actual){
    return {
      to: function(matcher, expected, not) {
        var matched = matcher.match(expected, actual);
        if (not ? matched : !matched) {
          throw( new Inspec.ExpectationFailure(matcher.failureMessage(expected, actual, not)));
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
      if (actual.length == undefined) throw(actual.toString() + " does not respond to length");
      
      return actual.length == 0;
    },
    
    failureMessage: function(expected, actual, not) {
      return 'expected ' + Inspec.util.print(actual) + (not ? ' to not be empty' : ' to be empty');
    }
  },

  haveLength: {
    match: function(expected, actual) {
      if (actual.length == undefined) throw(actual.toString() + " does not respond to length");

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
  }
};
