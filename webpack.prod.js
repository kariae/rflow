const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyjsPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        }),
    ],
    optimization: {
        minimizer: [
            new UglifyjsPlugin({
                cache: true,
                parallel: true
            })
        ]
    }
})
