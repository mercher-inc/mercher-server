var bookshelf = require('../modules/bookshelf');

var UserThirdPartyAccountModel = bookshelf.Model.extend(
    {
        tableName:     'user_third_party_account',
        hasTimestamps: true
    }
);

module.exports = UserThirdPartyAccountModel;
