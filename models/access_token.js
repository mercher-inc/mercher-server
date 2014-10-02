var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    Promise = require('bluebird'),
    crypto = require('crypto');

var AccessTokenModel = BaseModel.extend(
    {
        tableName: 'access_token',

        user: function () {
            return this.belongsTo(require('./user'));
        }
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
                    userId:  userModel.id,
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
