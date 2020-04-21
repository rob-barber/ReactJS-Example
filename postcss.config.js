/**
 * This file is used to add the autoprefixer functionality to the postcss-loader within the webpack configuration
 * file.s
 */

module.exports = {
    plugins: [
        require('autoprefixer')
    ]
};