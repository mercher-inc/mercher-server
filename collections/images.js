var bookshelf = require('../modules/bookshelf'),
    ImageModel = require('../models/image');

var ImagesCollection = bookshelf.Collection.extend(
    {
        model: ImageModel
    }
);

module.exports = ImagesCollection;
