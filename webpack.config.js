var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: ["./index.js"],
    output: {
        filename: "compiled.js",
        publicPath: "/dist",
    },
    resolve: {
        extensions: [".js"],
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["@babel/preset-react", "@babel/preset-env"],
                    plugins: [
                        ["@babel/transform-runtime"]
                    ]
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // automatically compile when files change
        new webpack.ProvidePlugin({
            // automatically import package
            React: "react",
            ReactDOM: "react-dom",
        }),
    ],
    mode: "development",
    devServer: {
        historyApiFallback: true,
        static: "./",
        hot: true,
        compress: true,
        host: "localhost",
        port: 8080,
    },
};
