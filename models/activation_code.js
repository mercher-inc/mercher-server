var bookshelf = require('../modules/bookshelf'),
    Promise = require('bluebird'),
    crypto = require('crypto');

var ActivationCodeModel = bookshelf.Model.extend(
    {
        tableName:     'activation_code',
        hasTimestamps: true
    },
    {
        generate: function (userModel, purpose) {
            var ActivationCodeModel = this;
            return new Promise(function (resolve, reject) {
                var hash = crypto.createHash('sha1');
                hash.update(Math.random().toString(), 'utf8');
                hash.update(new Date().toString(), 'utf8');
                var code = hash.digest('hex');

                var activationCodeModel = new ActivationCodeModel({
                    user_id: userModel.id,
                    purpose: purpose,
                    code:    code
                });

                activationCodeModel
                    .save().then(function (activationCodeModel) {
                        resolve(activationCodeModel);
                    });
            });
        }
    }
);

module.exports = ActivationCodeModel;