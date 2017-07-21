var express = require('express');
var path = require('path');
var ejs = require('ejs');
var ip = require('ip');
var http = require('http');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);
var app = express();

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

if (require.main === module) {
    var server = http.createServer(app);
    server.listen(process.env.PORT || 3000, function () {
        console.log("Listening on %j", server.address());
        var c = require('child_process');
        var url = 'http://' + ip.address() + ':3000/';
        c.exec('open ' + url);
    });
}