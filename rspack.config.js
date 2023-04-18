/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
	context: __dirname,
	entry: {
		main: "./src/index.tsx"
	},
	builtins: {
		noEmitAssets:true,
		devFriendlySplitChunks:true,
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
		poll:0,
		aggregateTimeout:0
	},
	stats: {
		timings:true,
		all:false
	}
};
