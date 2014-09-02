(function (module, require) {

    var expressAsyncValidator = require('../../../../modules/express-async-validator/module');

    module.exports = function (req, res, next) {
        new (expressAsyncValidator.model)({
            "limit":  {
                "rules":        {
                    "isInt": {
                        "message": "Limit should be integer"
                    },
                    "toInt": {}
                },
                "allowEmpty":   true,
                "defaultValue": 10
            },
            "offset": {
                "rules":        {
                    "isInt": {
                        "message": "Offset should be integer"
                    },
                    "toInt": {}
                },
                "allowEmpty":   true,
                "defaultValue": 0
            }
        })
            .validate(req.query)
            .then(function (params) {
                req.query.limit = params.limit;
                req.query.offset = params.offset;
                next();
            })
            .catch(function (error) {
                var badRequestError = new (require('../errors/bad_request'))("Bad request", error);
                next(badRequestError);
            });
    };

})(module, require);
