const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')

module.exports = merge.smart(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        https: true,
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"',
        }),
    ]
})
