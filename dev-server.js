var path = require('path')
var express = require('express')

var server = express()

// handle fallback for HTML5 history API
server.use(require('connect-history-api-fallback')())

// serve pure static assets
// var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
server.use('/', express.static('./router/'))

module.exports = server.listen(5000, function(err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + 5000
    console.log('Listening at ' + uri + '\n')
})