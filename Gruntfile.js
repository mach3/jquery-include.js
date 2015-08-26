module.exports = function(grunt){

	require("load-grunt-tasks")(grunt);

	var banner = grunt.template.process(
		grunt.file.read("src/banner.js"),
		{data: grunt.file.readJSON("package.json")}
	);

	grunt.initConfig({
		uglify: {
			options: {
				banner: banner
			},
			build: {
				files: {
					"dist/jquery-include.min.js": ["src/jquery-include.js"]
				}
			}
		},
		concat: {
			options: {
				banner: banner
			},
			build: {
				files: {
					"dist/jquery-include.js": ["src/jquery-include.js"]
				}
			}
		},
		connect: {
			dev: {
				options: {
					port: 8080,
					keepalive: true
				}
			}
		}
	});

	grunt.registerTask("default", []);
	grunt.registerTask("build", ["uglify", "concat"]);

};