
var express = require('express'), 
    proto = require('./application'),
    fs = require('fs'),
    ejs = require('ejs'),
    path = require('path'),
    merge = require('util')._extend,
    assert = require('assert');


// var vframe = exports = module.exports = createApp;
var vframe = module.exports = createApp;


function createApp() {
    var app = express();
    
    merge(app, proto);
    
    app.vframe = vframe;
    
    
    
    // Create a new instance of models registry per each app instance
    app.models = function() {
        return proto.models.apply(this, arguments);
    };
    
    // Create a new instance of datasources registry per each app instance
    app.datasources = app.dataSources = {};
    
    // Create a new instance of connector registry per each app instance
    app.connectors = {};
    
    
    // Register built-in connectors. It's important to keep this code
    // hand-written, so that all require() calls are static
    // and thus browserify can process them (include connectors in the bundle)
    app.connector('memory', vframe.Memory);
    app.connector('remote', vframe.Remote);
    
    
    return app;
};


/**
 * Framework version.
 */
vframe.version = require('../package.json').version;


vframe.mime = express.mime;


/*!
 * mixin 
 */
function mixin(source) {
    for (var key in source) {
        var desc = Object.getOwnPropertyDescriptor(source, key);
        // Fix for legacy (pre-ES5) browsers like PhantomJS
        if (!desc) continue;
        Object.defineProperty(vframe, key, desc);
    }
}


mixin(require('./runtime'));
mixin(require('./registry'));


mixin(express);


/*!
 * Expose additional middleware like session as vframe.*
 * This will keep the vframe API compatible with express 3.x
 *
 * ***only in node***
 */
if (vframe.isServer) {
    var middlewares = require('./express-middleware');
    mixin(middlewares);
}


/*!
 * Expose additional vframe middleware
 * for example `vframe.configure` etc.
 *
 * ***only in node***
 */
if (vframe.isServer) {
    fs
        .readdirSync(path.join(__dirname, '..', 'server', 'middleware'))
        .filter(function (file) {
            return file.match(/\.js$/);
        })
        .forEach(function (m) {
            vframe[m.replace(/\.js$/, '')] = require('../server/middleware/' + m);
        });
    
    vframe.urlNotFound = vframe['url-not-found'];
    delete vframe['url-not-found'];
}


/*
 * Expose path to the default favicon file
 *
 * ***only in node***
 */
if (vframe.isServer) {
    /*!
     * Path to a default favicon shipped with LoopBack.
     *
     * **Example**
     *
     * ```js
     * app.use(require('serve-favicon')(loopback.faviconFile));
     * ```
     */
    vframe.faviconFile = path.resolve(__dirname, '../favicon.ico');
}



/*!
 * Error handler title
 */
vframe.errorHandler.title = 'vFrame handler Error';



/**
 * Add a remote method to a model.
 * @param {Function} fn
 * @param {Object} options (optional)
 */
vframe.remoteMethod = function (fn, options) {
    fn.shared = true;
    if(typeof options === 'object') {
        Object.keys(options).forEach(function (key) {
            fn[key] = options[key];
        });
    }
    
    fn.http = fn.http || {verb: 'get'};
};

/**
 * Create a template helper.
 *
 * var render = vframe.template('foo.ejs');
 * var html = render({foo: 'bar'});
 *
 * @param {String} path Path to the template file.
 * @returns {Function}
 */
vframe.template = function (file) {
    var templates = this._templates || (this._templates = {});
    var str = templates[file] || (templates[file] = fs.readFileSync(file, 'utf8'));
    return ejs.compile(str);
};


vframe.getCurrentContext = function() {
    // A placeholder method, see lib/middleware/context.js for the real version
    return null;
};


/*!
 * Built in models / services
 */
require('./builtin-models')(vframe);
