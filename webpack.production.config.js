var path = require('path');

module.exports = {

    // Entry file that webpack starts compiling at
    entry: './src/index.js',

    // Output parameters.
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: 'build/', // Used for webpack-dev-server --hot reloading
        sourceMapFilename: '[file].map' // [file] just takes the name of the file and adds .map at the end
    },

    devtool: 'cheap-module-source-map',

    devServer: {
        historyApiFallback: true
    },

    // To make life easier we give certain directories aliases so we don't need full absolute paths when
    // we import into our Javascript files
    resolve: {
        alias: {
            Constants$: path.resolve(__dirname, 'src/globals/constants.js'),
            Auth$: path.resolve(__dirname, 'src/auth/authManager.js'),
            Actions: path.resolve(__dirname, 'src/actions'),
            Components: path.resolve(__dirname, 'src/components'),
            Containers: path.resolve(__dirname, 'src/containers'),
            Helpers: path.resolve(__dirname, 'src/helpers'),
            Images: path.resolve(__dirname, 'src/images'),
            Reducers: path.resolve(__dirname, 'src/reducers'),
            Styles: path.resolve(__dirname, 'src/styles')
        }
    },
    module: {
        rules: [
            // Babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },

            // Styling Loaders
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" }, // creates style nodes from JS strings
                    { loader: "css-loader" },
                    { loader: "postcss-loader" },
                    { loader: "sass-loader" } // compiles Sass to CSS
                ]
            },
            // Styling for just css files
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" }, // creates style nodes from JS strings
                    { loader: "css-loader" }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader:'file-loader?name=images/[name].[ext]'
                    }
                ]
            }
        ]
    }

};