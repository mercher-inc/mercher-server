var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base');

var UserEmailModel = BaseModel.extend(
    {
        tableName: 'user_email',
        defaults:  {
            userId:    null,
            email:     null,
            password:  null,
            isActive:  false,
            isBanned:  false,
            createdAt: null,
            updatedAt: null
        },

        user: function () {
            return this.belongsTo(require('./user'));
        }
    }
);

module.exports = UserEmailModel;
