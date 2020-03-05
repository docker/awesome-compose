'use strict';

const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PROJECT_ROOT = path.resolve(__dirname, "..");

module.exports = (env) => {
    const isDev = env === 'development';
    const isTest = env === 'test';
    const isProd = !isDev && !isTest;

    const getAppEntry = () => {
        const appEntry = path.resolve(PROJECT_ROOT, "src/app/entry.jsx");
        if(isDev) {
            return [
                'react-hot-loader/patch',
                'webpack-dev-server/client?http://localhost:9000',
                'webpack/hot/only-dev-server',
                appEntry
            ]
        } else {
            return [appEntry]
        }
    };

    const getPlugins = () => {

        // common plugins
        let plugins = [
            // Global variables
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env),
                '__DEV__': isDev,
                '__PROD__': isProd,
                '__TEST__': isTest,
            }),
            // ignore moment locale files
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            // extract styles to css file
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash].css",
                chunkFilename: "[id].css",
                disable: isDev,
            }),
            // makes index.html
            new HtmlWebpackPlugin({
                template: path.resolve(PROJECT_ROOT, 'src/index.ejs'),
            })
        ];

        // development plugins
        if(isDev) {
            plugins.push(
                // Hot Reload (HMR)
                new webpack.HotModuleReplacementPlugin(),
                // Named Modules
                new webpack.NamedModulesPlugin()
            );
        }

        // production plugins
        if(isProd) {
            plugins.push(
                new webpack.optimize.ModuleConcatenationPlugin()
            );
        }

        return plugins;
    };

    return {
        target: 'web',
        mode: isProd ? "production" : "development",
        context: PROJECT_ROOT,

        entry: {
            app: getAppEntry()
        },

        output: {
            path: path.resolve(PROJECT_ROOT, isProd ? 'dist' : 'build'),
            filename: isProd ? '[name].[chunkhash:8].js' : '[name].js',
            publicPath: '/',
            sourceMapFilename: '[file].map',
            chunkFilename: isProd ? '[name].[chunkhash:8].js' : '[name].js',
            pathinfo: isDev

        },

        devtool: isProd ? "hidden-sourcemap" : 'eval',

        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            modules: ["node_modules", "src"],
            alias: {}
        },

        module: {
            rules: [
                // JS / JSX files
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        }
                    ]
                },
                // SASS files
                {
                    test: /\.scss$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 2,
                                url: true,
                                import: false,
                                sourceMap: isDev
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: isDev,
                                plugins: isDev ? [] : [
                                    require("autoprefixer"),
                                    require("cssnano")({
                                        safe: true,
                                        zindex: false,
                                        discardComments: {
                                            removeAll: true
                                        }
                                    })
                                ]
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: isDev,
                                includePaths: [".", path.join(process.cwd(), "src/app/core/styles")]
                            }
                        }
                    ]
                },
                // Plain CSS files
                {
                    test: /\.css$/,
                    use: [
                        isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1,
                                url: true,
                                import: false,
                                sourceMap: isDev
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: isDev,
                                plugins: isDev ? [] : [
                                    require("autoprefixer"),
                                    require("cssnano")({
                                        safe: true,
                                        zindex: false,
                                        discardComments: {
                                            removeAll: true
                                        }
                                    })
                                ]
                            }
                        }
                    ]
                },
                // images loader
                {
                    test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: "[name].[ext]",
                                outputPath: isProd ? "../images/" : "images/"
                            }
                        }
                    ]
                },
                // font loader
                {
                    test: /\.(woff|woff2|ttf|eot)(\?.*)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: "[name].[ext]",
                                publicPath: isProd ? "" : "/webpack/",
                                useRelativePath: isProd,
                                outputPath: isProd ? "../fonts/" : "fonts/"
                            }
                        }
                    ]
                }
            ]
        },

        plugins: getPlugins(),

        node: {
            __filename: true,
            __dirname: true,
            fs: 'empty',
            vm: 'empty',
            net: 'empty',
            tls: 'empty',
        }

    };
};
