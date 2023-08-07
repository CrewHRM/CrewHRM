const path = require('path');

module.exports = (env, options) => {
	const mode = options.mode || 'development';

	const config = {
		mode,
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
				{
					test: /\.(s(a|c)ss)$/,
					use: ['style-loader','css-loader', 'sass-loader']
				},
				{
					test: /\.css$/i,
					include: path.resolve(__dirname, './'),
					use: ['style-loader', 'css-loader', 'postcss-loader'],
				}
			],
		},
		devtool: 'source-map',
	};

	if ('production' === mode) {
		config.devtool = false;
	}

	var react_blueprints = [
		{
			dest_path: './dist',
			src_files: {
				'backend-dashboard': './components/backend-dashboard/index.jsx'
			},
		}
	];

	var configEditors = [];
	for (let i = 0; i < react_blueprints.length; i++) {
		let { src_files, dest_path } = react_blueprints[i];

		configEditors.push(
			Object.assign({}, config, {
				name: 'configEditor',
				entry: src_files,
				output: {
					path: path.resolve(dest_path),
					filename: `[name].js`,
				},
			}),
		);
	}

	return [...configEditors];
};