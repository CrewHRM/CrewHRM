const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, options) => {
    const mode = options.mode || 'development';

    const config = {
        mode,
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
                    options: { presets: ['@babel/env', '@babel/preset-react'] }
                },
                {
                    test: /\.(s(a|c)ss)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.css$/i,
                    include: path.resolve(__dirname, './'),
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jp(e*)g|svg|gif|pdf)$/,
                    type: 'asset/resource'
                }
            ]
        },
        devtool: 'source-map'
    };

    if ('production' === mode) {
        config.devtool = false;
        config.optimization = {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: false
                        }
                    },
                    extractComments: false
                })
            ]
        };
    }

    var react_blueprints = [
        {
            dest_path: './dist',
            src_files: {
                hrm: './components/views/hrm/index.jsx',
                careers: './components/views/careers/index.jsx',
                settings: './components/views/settings/index.jsx'
            }
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
                    filename: `[name].js`
                }
            })
        );
    }

    return [...configEditors];
};
