var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    UserModel = require('./user');

var UserThirdPartyAccountModel = BaseModel.extend(
    {
        tableName: 'user_third_party_account',

        user: function () {
            return this.belongsTo(UserModel);
        }
    }
);

module.exports = UserThirdPartyAccountModel;
