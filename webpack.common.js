const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        app: path.join(__dirname, 'front/index.js')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'front-dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        cacheDirectory: true,
                        plugins: ['transform-class-properties', "@babel/plugin-proposal-object-rest-spread"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.join(__dirname, 'front/index.html') }),
        new CleanWebpackPlugin(['front-dist'], { exclude: '.gitkeep', verbose: false }),
    ]
}
