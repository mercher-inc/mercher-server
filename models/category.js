var bookshelf = require('../modules/bookshelf'),
    BaseModel = require('./base'),
    ImageModel = require('./image');

var CategoryModel = BaseModel.extend(
    {
        tableName:     'category',
        hasTimestamps: true,

        image: function () {
            return this.belongsTo(ImageModel);
        }
    }
);

module.exports = CategoryModel;
