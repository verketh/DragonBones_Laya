const rollup = require("rollup");
const typescript = require('rollup-plugin-typescript2');//typescript2 plugin
const glsl = require('rollup-plugin-glsl');
const gulp = require("gulp");
const typedoc = require("gulp-typedoc");

function compile(cb) {
	return rollup.rollup({
		input: './src/Main.ts',
		treeshake: true,//建议忽略
		plugins: [
			typescript({
				check: false, //Set to false to avoid doing any diagnostic checks on the code
				tsconfigOverride: { compilerOptions: { removeComments: true } }
			}),
			glsl({
				// By default, everything gets included
				include: /.*(.glsl|.vs|.fs)$/,
				sourceMap: false,
				compress: false
			}),
			/*terser({
				output: {
				},
				numWorkers:1,//Amount of workers to spawn. Defaults to the number of CPUs minus 1
				sourcemap: false
			})*/
		]
	}).then(bundle => {
		bundle.write({
			file: './bin/js/bundle.js',
			format: 'iife',
			name: 'laya',
			sourcemap: true
		}).then(() => {
			return cb();
		});
	});
}

function typeapi(cb) {
	return gulp
		.src(["src/test/ChessReportQueue.ts", "src/component/CList.ts"])
		.pipe(typedoc({
			out: "docs",
			excludePrivate: true,
			excludeProtected: true,
			excludeExternals: true,
		}));
}

gulp.task("watch", function () {
	/**
	 * @ 监听src目录下的所有子目录的所有文件，
	 * @ 延迟1000毫秒，才执行下次监听，避免手欠的同学，因连续保存触发多次连续编译
	 * @ 监听生效后执行的函数
	 */
	gulp.watch('src/**/*.*', { delay: 1000 }, compile);
	// gulp.watch('src/**/*.*', { delay: 1000 }, typeapi);
});

module.exports.compile = compile;