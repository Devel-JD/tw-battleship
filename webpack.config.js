const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')

module.exports = {
    entry: {
        server: [ 'webpack/hot/poll?1000', './bin/www' ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'development',
    watch: true,
    target: 'node',
    externals: [nodeExternals({
        whitelist: [ 'webpack/hot/poll?1000' ]
    })],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [{loader: "html-loader"}]
            }
        ]
    },
    plugins: [
        new StartServerPlugin('server.js'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}