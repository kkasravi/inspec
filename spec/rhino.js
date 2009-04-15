load("../dist/inspec.js");

Inspec
  .load('example.js', 'matchersSpec.js')
  .run();
