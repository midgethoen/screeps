module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-screeps')

  grunt.initConfig({
    screeps: {
      options: {
        email: process.env.SCREEPS_EMAIL,
        password: process.env.SCREEPS_PASSWORD,
        branch: 'World',
        ptr: false,
      },
      dist: {
        src: ['src/*.js'],
      },
    },
  })
}
