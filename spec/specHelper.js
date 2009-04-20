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
    "unitTest/matchers/equalMatcherSpec.js",
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
