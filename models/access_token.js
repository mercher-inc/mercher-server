var bookshelf = require('../modules/bookshelf'),
    Promise = require('bluebird'),
    crypto = require('crypto');

var AccessTokenModel = bookshelf.Model.extend(
    {
        tableName:     'access_token',
        hasTimestamps: true
    },
    {
        grant: function (userModel) {
            var AccessTokenModel = this;
            return new Promise(function (resolve, reject) {
                var hash = crypto.createHash('sha1');
                hash.update(Math.random().toString(), 'utf8');
                hash.update(new Date().toString(), 'utf8');
                var token = hash.digest('hex');

                var expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000); // + 1 day
                var expires = expirationDate.toISOString();

                var accessTokenModel = new AccessTokenModel({
                    user_id: userModel.id,
                    token:   token,
                    expires: expires
                });

                accessTokenModel
                    .save().then(function (accessTokenModel) {
                        resolve(accessTokenModel);
                    });
            });
        }
    }
);

module.exports = AccessTokenModel;
