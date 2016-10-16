const app           = require( 'koa' )();
const router        = require( 'koa-router' )();
const koaStatic     = require( 'koa-static' );
const path          = require( 'path' );
const fs            = require( 'fs' );

var readFileThunk = function(src) {
    return new Promise(function (resolve, reject) {
        fs.readFile(src, {'encoding': 'utf8'}, function (err, data) {
            if(err) return reject(err);
            resolve(data);
        });
    });
}

function* indexView( next ){
    var html = yield readFileThunk( path.join( __dirname, 'dist/index.html' ) );
    this.body = html;
}
// 后端路由
router.get( '/', indexView );
router.get( '/application', indexView );
router.get( '/application/loan', indexView );
router.get( '/application/basic', indexView );
router.get( '/application/job', indexView );
router.get( '/application/student', indexView );
router.get( '/application/family', indexView );
router.get( '/application/upload', indexView );
router.get( '/agreement', indexView );
router.get( '/vertify', indexView );
router.get( '/success', indexView );
router.get( '/detail', indexView );

app
    .use( koaStatic( './dist', {} ) )
    .use( router.routes() )
    .use( router.allowedMethods() );

app.listen( 8801 );
console.log('server start at http://localhost:8801');
