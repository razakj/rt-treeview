const path = require("path");
const webpack = require("webpack");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const _isProduction = process.env.NODE_ENV === "production";

let plugins = [
    new ExtractTextPlugin({filename: "treeview.css", allChunks: true}),
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
    }))
}

module.exports = {
    entry: {
        treeview: ['./src/index.js']
    },
    externals: {
        'react': 'react',
        'react-dom': 'react-dom',
        'classnames' : 'classnames',
        'prop-types' : 'prop-types',
        'react-toolbox/lib/dialog' : 'react-toolbox/lib/dialog',
        'react-toolbox/lib/input' : 'react-toolbox/lib/input',
        'react-toolbox/lib/font_icon' : 'react-toolbox/lib/font_icon',
        'react-toolbox/lib/ripple' : 'react-toolbox/lib/ripple',
        'react-toolbox/lib/ripple/theme.css' : 'react-toolbox/lib/ripple/theme.css'
    },
    output: {
        path: path.join(__dirname, 'lib'),
        filename: "[name].js"
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
                            modules: true
                        }},
                        {loader: 'postcss-loader', options: {
                            plugins: function() {
                                return [
                                    require('postcss-cssnext')()
                                ]
                            }
                        }}
                    ]
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "lib"),
        compress: true,
        port: 9876,
        historyApiFallback: {
            index: path.join(__dirname, "examples/index.html"),
        }
    }
};