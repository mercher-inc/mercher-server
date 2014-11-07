(function (module, require) {

    var request = require('request'),
        Promise = require('bluebird'),
        _ = require('underscore'),
        UserModel = require('../models/user'),
        UserEmailModel = require('../models/user_email'),
        UserThirdPartyAccountModel = require('../models/user_third_party_account'),
        ShopModel = require('../models/shop'),
        ShopThirdPartyAccountModel = require('../models/shop_third_party_account');

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
            })
            .then(function (userModel) {
                return updateUserThirdPartyAccount(userData)
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
                        isBanned:  userData['is_banned']
                    }
                );
            });
    };

    var updateUserThirdPartyAccount = function (userData) {
        var userThirdPartyAccountModel = new UserThirdPartyAccountModel({provider: 'facebook', providerId: userData['fb_id'], userId: parseInt(userData['id'])});
        return userThirdPartyAccountModel
            .fetch({require: true})
            .catch(UserThirdPartyAccountModel.NotFoundError, function () {
                return userThirdPartyAccountModel.save();
            });
    };

    var updateShop = function (shopData) {
        console.log(shopData);
        var shopModel = new ShopModel({id: parseInt(shopData['id'])});
        return shopModel
            .fetch({require: true})
            .catch(ShopModel.NotFoundError, function () {
                return shopModel.save(
                    {
                        title:       shopData['title'],
                        description: shopData['description'],
                        tax:         shopData['tax'],
                        isPublic:    shopData['is_active'],
                        isBanned:    shopData['is_banned'],
                        createdAt:   shopData['created']
                    },
                    {
                        method: "insert"
                    }
                );
            })
            .then(function (shopModel) {
                return updateShopThirdPartyAccount(shopData)
                    .then(function () {
                        return shopModel;
                    });
            })
    };

    var updateShopThirdPartyAccount = function (shopData) {
        var shopThirdPartyAccountModel = new ShopThirdPartyAccountModel({provider: 'facebook', providerId: shopData['fb_id'], shopId: parseInt(shopData['id'])});
        return shopThirdPartyAccountModel
            .fetch({require: true})
            .catch(ShopThirdPartyAccountModel.NotFoundError, function () {
                return shopThirdPartyAccountModel.save();
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
                .then(function () {
                    return getData('shops');
                })
                .then(function (shops) {
                    var shopPromises = [];
                    _.each(shops, function (shopData) {
                        shopPromises.push(updateShop(shopData));
                    });
                    return Promise.all(shopPromises);
                });
        });
    };

})(module, require);
