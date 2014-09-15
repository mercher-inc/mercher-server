var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    UserModel = require('./user'),
    ShopModel = require('./shop');

var ManagerModel = BaseModel.extend(
    {
        tableName: 'manager',
        defaults:  {
            role:     null,
            isPublic: true,
            isBanned: false
        },

        user: function () {
            return this.belongsTo(UserModel);
        },
        shop: function () {
            return this.belongsTo(ShopModel);
        }
    }
);

module.exports = ManagerModel;
