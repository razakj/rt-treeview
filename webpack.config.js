const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const _isProduction = process.env.NODE_ENV === "production";

let plugins = [
    new ExtractTextPlugin({filename: "app.css", allChunks: true}),
    new webpack.LoaderOptionsPlugin({
        options: {
            context: __dirname
        }
    })
];

if(_isProduction) {
    plugins.push(new webpack.DefinePlugin({
        "process.env": {
            "NODE_ENV": JSON.stringify('production')
        }
    }));
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}


module.exports = {
    entry: {
        app: [
            './examples/index.js', 'react', 'react-dom', 'react-toolbox'
        ],
    },
    output: {
        path: path.join(__dirname, 'docs', 'assets'),
        filename: "app.js"
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