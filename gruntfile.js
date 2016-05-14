module.exports = function(grunt) {

  function validate () {
    var content = '';
    try {
      content = grunt.file.readJSON("data.json");
    } catch (e) {
      grunt.fail.fatal("data.json is not valid JSON. Error: " + e);
    }

    console.log("PASS!");
  }

  grunt.registerTask("validate", validate);
};
