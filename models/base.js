var app = require('../app'),
    Bookshelf = app.get('bookshelf'),
    _ = require('underscore'),
    Promise = require("bluebird");

_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

var BaseModel = Bookshelf.Model.extend(
    {
        hasTimestamps: ['createdAt', 'updatedAt'],
        format:        function (attrs) {
            return _.reduce(attrs, function (memo, val, key) {
                memo[_.str.underscored(key)] = val;
                return memo;
            }, {});
        },
        parse:         function (attrs) {
            return _.reduce(attrs, function (memo, val, key) {
                memo[_.str.camelize(key)] = val;
                return memo;
            }, {});
        }
    },
    {
        ValidationError:     require('./errors/validation_error'),
        PermissionError:     require('./errors/permission_error'),
        InternalServerError: require('./errors/internal_server_error'),
        checkPermission:     function (shopId, userId, role) {
            return new Promise(function (resolve, reject) {
                if (role === 'admin') {
                    var UserModel = require('./user');
                    new UserModel()
                        .query(function (qb) {
                            qb
                                .where('id', '=', userId)
                                .where('is_admin', '=', true);
                        })
                        .fetch({require: true})
                        .then(function () {
                            resolve(true);
                        })
                        .catch(UserModel.NotFoundError, function () {
                            reject(false);
                        })
                } else {
                    var ManagerModel = require('./manager');
                    new ManagerModel()
                        .query(function (qb) {
                            qb
                                .where('user_id', '=', userId)
                                .where('shop_id', '=', shopId)
                                .where('role', '>=', role);
                        })
                        .fetch({require: true})
                        .then(function () {
                            resolve(true);
                        })
                        .catch(ManagerModel.NotFoundError, function () {
                            reject(false);
                        })
                }
            });
        }
    }
);

module.exports = BaseModel;
