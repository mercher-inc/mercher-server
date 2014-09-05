var Bookshelf = require('../modules/bookshelf'),
    UserModel = require('./user');

var UserThirdPartyAccountModel = Bookshelf.Model.extend(
    {
        tableName:     'user_third_party_account',
        hasTimestamps: true,

        user: function () {
            return this.belongsTo(UserModel);
        }
    }
);

module.exports = UserThirdPartyAccountModel;
