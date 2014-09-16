var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    Promise = require('bluebird'),
    crypto = require('crypto');

var ActivationCodeModel = BaseModel.extend(
    {
        tableName: 'activation_code',

        userEmail: function () {
            return this.belongsTo(require('./user_email'));
        }
    },
    {
        generate: function (userEmailModel, purpose) {
            var ActivationCodeModel = this;
            return new Promise(function (resolve, reject) {
                var hash = crypto.createHash('sha1');
                hash.update(Math.random().toString(), 'utf8');
                hash.update(new Date().toString(), 'utf8');
                var code = hash.digest('hex');

                var activationCodeModel = new ActivationCodeModel({
                    userEmailId: userEmailModel.id,
                    purpose:     purpose,
                    code:        code
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
