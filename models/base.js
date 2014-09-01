var bookshelf = require('../modules/bookshelf'),
    Promise = require("bluebird");

var BaseModel = bookshelf.Model.extend(
    {

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
