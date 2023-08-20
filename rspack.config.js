const path = require('path');

module.exports = function (env, argv) {
	const isBuild = argv['_'][0] === 'build'
	/**
	 * @type {import('@rspack/cli').Configuration}
	 */
	return {
		context: __dirname,
		entry: {
			main: "./src/index.tsx"
		},
		output: {
			path: path.resolve(__dirname, './dist-rspack')
		},
		target: 'browserslist',
		builtins: {
			noEmitAssets: !isBuild,
			devFriendlySplitChunks: !isBuild,
			html: [
				{
					template: "./index.webpack.html"
				}
			]
		},
		module: {
			rules: [
				{
					test: /\.svg$/,
					type: "asset"
				}
			]
		},
		watchOptions: {
			poll: 0,
			aggregateTimeout: 0
		},
		devtool: isBuild ? false : 'nosources-cheap-source-map',
		stats: {
			timings: true,
			all: false
		}
	};
};
