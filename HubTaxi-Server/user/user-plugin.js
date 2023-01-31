// Generated by CoffeeScript 1.7.1

/* Updated 25/12/2013 */


/*
 This docstring documents User-Plugin.  It can include *Markdown* syntax,
 which will be converted to html.
 */

(function () {
    var Utils, async, hash, userPlugin, _;

    _ = require('underscore');

    async = require('async');

    hash = require('../utils/pass').hash;

    Utils = require('../utils/utils').Utils;

    userPlugin = function ( appApi, User ) {
        appApi.on('before_create', function ( before_create_notification ) {
            var data, password;
            switch (before_create_notification.table) {
                case 'Users':
                    console.log('before_create', before_create_notification);
                    data = before_create_notification.data;
                    password = data.password;
                    if ((password == null) || password === '') {
                        password = '123456';
                    }
                    console.log('before_create - password: ', password);
                    console.log('Create hash and salt...');
                    hash(password, function ( err, salt, hash ) {
                        var before_create_notification_feedback;
                        if (err) {
                            console.log('Generate hash and salt - error:', err);
                        } else {
                            console.log('Generate hash and salt - successed');
                            data.hash = hash;
                            data.salt = salt;
                            before_create_notification_feedback = {};
                            before_create_notification_feedback.data = data;
                            appApi.emit('before_create_feedback', before_create_notification_feedback);
                        }
                    });
                    console.log('before_create_feedback');
                    break;
                default:
                    console.log('come here 3');
                    process.nextTick(function () {
                        var before_create_notification_feedback;
                        before_create_notification_feedback = {};
                        before_create_notification_feedback.data = before_create_notification.data;
                        console.log('come here 4');
                        return appApi.emit('before_create_feedback', before_create_notification_feedback);
                    });
            }
        });
        appApi.on("crud", function ( crud_notification ) {
            var password, userData;
            switch (crud_notification.table) {
                case 'Users':
                    switch (crud_notification.action) {
                        case 'update':
                            console.log('crud_notification', crud_notification);
                            password = crud_notification.data.password;
                            if ((password == null) || password === '') {
                                password = '123456';
                            }
                            console.log('password: ', password);
                            userData = {};
                            userData._id = crud_notification.data._id;
                            console.log('Update hash and salt...');
                            async.waterfall([
                                (function ( _this ) {
                                    return function ( cb ) {
                                        return hash(password, function ( err, salt, hash ) {
                                            return cb(err, salt, hash);
                                        });
                                    };
                                })(this), (function ( _this ) {
                                    return function ( salt, hash, cb ) {
                                        userData.hash = hash;
                                        userData.salt = salt;
                                        return User.updateUser(userData, function ( error, result ) {
                                            return cb(error, result);
                                        });
                                    };
                                })(this)
                            ], function ( error, result ) {
                                if (error) {
                                    console.log('Update hash and salt - error:', error);
                                } else {
                                    console.log('Update hash and salt - successed result: ', result);
                                }
                            });
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        });
    };

    exports.userPlugin = userPlugin;

}).call(this);

//# sourceMappingURL=user-plugin.map