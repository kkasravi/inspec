(function(){
  var unitTestSpecs = [
    "unitTest/classSpec.js",
    "unitTest/exampleGroupManagerSpec.js",
    "unitTest/exampleGroupSpec.js",
    "unitTest/exampleSpec.js",
    "unitTest/exceptionsSepc.js",
    "unitTest/expectationSpec.js",
    "unitTest/inspecSepc.js",    
    "unitTest/matchers/sharedMatcherSpec.js",
    "unitTest/matchers/beASpec.js",
    "unitTest/matchers/beEmptySpec.js",
    "unitTest/matchers/beFalseSpec.js",
    "unitTest/matchers/beNullSpec.js",
    "unitTest/matchers/beSpec.js",
    "unitTest/matchers/beTrueSpec.js",
    "unitTest/matchers/beUndefinedSpec.js",
    "unitTest/matchers/eqlSpec.js",
    "unitTest/matchers/equalSpec.js",
    "unitTest/matchers/haveLengthSpec.js",
    "unitTest/matchers/haveSpec.js",
    "unitTest/matchers/matchSpec.js",
    "unitTest/matchers/respondToSpec.js",
    "unitTest/matchers/throwErrorSpec.js",




    "unitTest/runerSpec.js",
    "unitTest/dsl/bddSpec.js",
    "unitTest/util/treeNodeSpec.js",
    "unitTest/util/messengerSpec.js",
    "unitTest/util/printSpec.js",
    "unitTest/reporters/consoleReporterSpec.js",
    "unitTest/reporters/sharedReporterSpec.js",
    "unitTest/reporters/htmlReporterSpec.js",
    "unitTest/environments/browserEnvironmentSpec.js",
    "unitTest/environments/sharedEnvironmentSpec.js",
    "unitTest/environments/rhinoEnvironmentSpec.js",
    "unitTest/environments/wscriptEnvironmentSpec.js"
  ];

  var integrationSpecs = [
    "integration/behaviorSepc.js"
  ];

  Inspec
    .load(unitTestSpecs, integrationSpecs)
    .run();  
  
})();
