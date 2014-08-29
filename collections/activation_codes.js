var bookshelf = require('../modules/bookshelf'),
    ActivationCodeModel = require('../models/activation_code');

var ActivationCodesCollection = bookshelf.Collection.extend(
    {
        model: ActivationCodeModel
    }
);

module.exports = ActivationCodesCollection;
