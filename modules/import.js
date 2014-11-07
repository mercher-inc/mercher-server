(function (module, require) {

    var request = require('request'),
        Promise = require('bluebird'),
        _ = require('underscore'),
        UserModel = require('../models/user'),
        UserEmailModel = require('../models/user_email');

    var getData = function (type) {
        return new Promise(function (resolve, reject) {
            request(
                {
                    url:    'https://mercher.net/api/export/' + type,
                    qs:     {password: '4f3969cdb80a752c372e2dbcd30f163431b6f587'},
                    method: 'GET'
                },
                function (error, response, body) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    try {
                        resolve(JSON.parse(body));
                    }
                    catch (e) {
                        reject(e);
                    }
                }
            )
        });
    };

    var updateUser = function (userData) {
        var userModel = new UserModel({id: parseInt(userData['id'])});
        return userModel
            .fetch({require: true})
            .catch(UserModel.NotFoundError, function () {
                return userModel.save(
                    {
                        firstName: userData['first_name'],
                        lastName:  userData['last_name'],
                        isBanned:  userData['is_banned'],
                        lastLogin: userData['last_login'],
                        createdAt: userData['created']
                    },
                    {
                        method: "insert"
                    }
                );
            })
            .then(function (userModel) {
                if (new Date(userData['updated']) > new Date(userModel.get('updatedAt'))) {
                    return userModel.save(
                        {
                            firstName: userData['first_name'],
                            lastName:  userData['last_name'],
                            isBanned:  userData['is_banned'],
                            lastLogin: userData['last_login']
                        }
                    );
                }
                return userModel;
            })
            .then(function (userModel) {
                return updateUserEmail(userData)
                    .then(function () {
                        return userModel;
                    });
            });
    };

    var updateUserEmail = function (userData) {
        var userEmailModel = new UserEmailModel({email: userData.email, userId: parseInt(userData['id'])});
        return userEmailModel
            .fetch({require: true})
            .catch(UserEmailModel.NotFoundError, function () {
                return userEmailModel.save(
                    {
                        isActive:  false,
                        isBanned:  userData['is_banned'],
                        createdAt: userData['created']
                    }
                );
            });
    };

    module.exports = function () {
        return new Promise(function (resolve, reject) {

            getData('users')
                .then(function (users) {
                    var userPromises = [];
                    _.each(users, function (userData) {
                        userPromises.push(updateUser(userData));
                    });
                    return Promise.all(userPromises);
                })
                .then(function (users) {
                    console.log(users);
                });

        });
    };

})(module, require);
