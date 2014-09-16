var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base');

var UserEmailModel = BaseModel.extend(
    {
        tableName: 'user_email',
        defaults:  {
            password: null,
            isActive: false,
            isBanned: false
        },

        user: function () {
            return this.belongsTo(require('./user'));
        }
    }
);

module.exports = UserEmailModel;
