var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    ImageModel = require('./image');

var CategoryModel = BaseModel.extend(
    {
        tableName: 'category',

        image: function () {
            return this.belongsTo(ImageModel);
        }
    }
);

module.exports = CategoryModel;
