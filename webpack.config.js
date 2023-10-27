const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
      } 
    },
    // node: {
    //   fs: 'empty',
    //   net: 'empty',
    //   tls: 'empty'
    // },
    plugins: [
      new NodePolyfillPlugin()
    ]}