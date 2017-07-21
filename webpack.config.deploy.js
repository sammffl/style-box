var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var projectPath = path.resolve(__dirname, "static");
var nodeModulesPath = path.resolve(__dirname, "node_modules");
var lib = path.resolve(__dirname, "lib");
var ip = require('ip');


var src = {
    mock: './',
    test: './',
    production: './',
};

var outputPath = src[process.env.NODE_ENV];


module.exports = {
    entry: {
        app: "./src/main.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js?v=[hash]",
        publicPath: outputPath,
        // libraryTarget: "var",
        // library: "lib"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css!postcss') //"style-loader!css-loader?sourceMap&-minimize"
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('css?-minimize!autoprefixer-loader!sass') //"style-loader!css-loader!sass-loader?sourceMap"
        }, {
            test: /\.(png|jpg)$/,
            loader: "url-loader?limit=8192"
        }, {
            test: /\.html$/,
            loader: "html-loader"
        }, {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "no frame project",
            filename: "index.html",
            inject: "true",
            minify: {
                collapseWhitespace: true
            },
            template: "./index.html",
        }),
        new ExtractTextPlugin('app.css?v=[hash]'),
        new webpack.ProvidePlugin({
            $: "jquery",
        }),
    ],
    resolve: {
        extensions: ["", ".js", ".jsx", ".es6", "css", "scss", "png", "jpg", "jpeg"],
        alias: {
            "jquery": path.join(nodeModulesPath, "/jquery/dist/jquery.min"),
            // "zepto": path.join(lib, "/zepto.min")
        },
    },
    // externals: {
    //     // require("jquery") 是引用自外部模块的
    //     // 对应全局变量 jQuery
    //     "jquery": "jQuery"
    // }
};
