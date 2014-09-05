var bookshelf = require('../modules/bookshelf'),
    BaseModel = require('./base'),
    UserModel = require('./user'),
    ShopModel = require('./shop');

var ManagerModel = BaseModel.extend(
    {
        tableName:     'manager',
        hasTimestamps: true,
        user:          function () {
            return this.belongsTo(UserModel);
        },
        shop:          function () {
            return this.belongsTo(ShopModel);
        }
    }
);

module.exports = ManagerModel;
