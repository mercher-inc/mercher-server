var bookshelf = require('../modules/bookshelf'),
    UserThirdPartyAccountModel = require('../models/user_third_party_account');

var UserThirdPartyAccountsCollection = bookshelf.Collection.extend(
    {
        model: UserThirdPartyAccountModel
    }
);

module.exports = UserThirdPartyAccountsCollection;
