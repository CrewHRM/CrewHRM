const { readdirSync, lstatSync, unlinkSync, existsSync } = require('fs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { getAddonsBuildStructure } = require('./components/builders/addons');

module.exports = (env, options) => {
    const mode = options.mode || 'development';

    const config = {
        mode,
        snapshot: {
            managedPaths: [path.resolve(__dirname, '../node_modules')],
            immutablePaths: [],
            buildDependencies: {
                hash: true,
                timestamp: true,
            },
            module: {
                timestamp: true,
            },
            resolve: {
                timestamp: true,
            },
            resolveBuildDependencies: {
                hash: true,
                timestamp: true,
            },
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
                    options: { presets: ['@babel/env', '@babel/preset-react'] }
                },
                {
                    test: /\.(s(a|c)ss)$/,
                    use: ['style-loader', 'css-loader', {
                        loader: "sass-loader",
                        options: {
                            api: "modern",
                        },
                    },]
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
                'addons-page': './components/views/addons/addons-page.jsx',
                hrm: './components/views/hrm/index.jsx',
                careers: './components/views/careers/index.jsx',
                settings: './components/views/settings/index.jsx',
                'blocks-editor': './components/blocks/editor.jsx',
                'blocks-viewer': './components/blocks/viewer.jsx'
            }
        },
        ...getAddonsBuildStructure(path.resolve(__dirname, './addons'))
    ];

    var configEditors = [];
    for (let i = 0; i < react_blueprints.length; i++) {
        let { src_files, dest_path } = react_blueprints[i];

        // Delete older build files first
        if (existsSync(dest_path)) {
            readdirSync(dest_path).forEach(f => {
                const file_path = `${dest_path}/${f}`;
                if (lstatSync(file_path).isFile()) {
                    unlinkSync(file_path);
                }
            });
        }

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
