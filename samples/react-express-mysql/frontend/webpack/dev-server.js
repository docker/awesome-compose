'use strict';

const webpack = require('webpack'),
      WebpackDevServer = require('webpack-dev-server'),
      makeConfig = require("./config-builder");

const startWebpackServer = () => {
    const config = makeConfig('development');

    const SERVER_PORT = 9000;

    new WebpackDevServer(webpack(config), {
        publicPath          : config.output.publicPath,
        hot                 : true,
        historyApiFallback  : true,
        contentBase         : "./build/",

        watchOptions: { // no file events on D4W
            aggregateTimeout: 300,
            poll: 1000
        },

        proxy : {
            "/api/*"       : "http://127.0.0.1:8080"  // proxy to backend
        },

        before : function(app) {
            // manually configure app `app.use(...)`
        }
    }).listen(SERVER_PORT, '0.0.0.0', function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log('Webpack dev server listening at localhost:' + SERVER_PORT);
    });
};

startWebpackServer();
