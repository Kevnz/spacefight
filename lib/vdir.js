module.exports = function(factory){
    return function(hostname){
        var rhost = hostname;

        var middleware = function(req, res, next){
            console.log(rhost);
            if(middleware.on === false){
                console.log('off');
                return next();
            }

            

            var host = req.headers.host.split(':')[0];
            console.log(req.path.indexOf(rhost) === -1);
            console.log('the check');
            if( req.path.indexOf(rhost) === -1 ){
                return next();
            }
            console.log('passed the check');
            if (typeof middleware.server === 'function'){
                console.log('server is a function');
                return middleware.server(req, res, next);
            }
            console.log('made it to the emit');
            middleware.server.emit('request', req, res);
        };

        middleware.server = factory();

        middleware.off = function(){
            middleware.on = false;
        };

        middleware.on = function(){
            middleware.on = true;
        };

        return middleware;
    };
};