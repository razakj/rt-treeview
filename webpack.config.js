const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let plugins = [
    new ExtractTextPlugin({filename: "treeview.css", allChunks: true}),
    new webpack.LoaderOptionsPlugin({
        options: {
            context: __dirname
        }
    })
];

module.exports = {
    entry: {
        examples: [
            './examples/index.js', 'react', 'react-dom', 'react-toolbox'
        ],
    },
    output: {
        filename: "examples.js"
    },
    resolve: {
        modules: [
            'node_modules',
        ]
    },
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {loader: 'css-loader', options: {
                            localIdentName: '[name]__[local]___[hash:base64:4]',
                            modules: true,
                            importLoaders: 1
                        }},
                        {loader: 'postcss-loader'}
                    ]
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "examples"),
        compress: true,
        port: 9876,
    }
};