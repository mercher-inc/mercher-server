(function (module, require) {

    var _ = require('underscore'),
        Promise = require('bluebird'),
        validator = require('validator');

    var errors = {
        "fieldValidationError": require('./field_validation_error'),
        "modelValidationError": require('./model_validation_error')
    };

    var validators = {
        "required": require('./required_validator')
    };

    //Retrieves filters from validator
    var validatorFilters = _.union(
        _.filter(_.functions(validator), function (methodName) {
            return methodName.match(/^to/);
        }),
        [
            'ltrim',
            'rtrim',
            'trim',
            'escape',
            'stripLow',
            'whitelist',
            'blacklist',
            'normalizeEmail'
        ]
    );

    //Retrieves tests from validator
    var validatorTests = _.union(
        _.filter(_.functions(validator), function (methodName) {
            return methodName.match(/^is/);
        }),
        [
            'equals',
            'contains',
            'matches'
        ]
    );

    //Creates filters
    _.each(validatorFilters, function (fn) {
        validators[fn] = function (param, value, options) {
            var filterOptions = _.values(options);
            filterOptions.unshift(value);
            return new Promise(function (resolve) {
                resolve(validator[fn].apply(validator, filterOptions));
            });
        };
    });

    //Creates tests
    _.each(validatorTests, function (fn) {
        validators[fn] = function (param, value, options) {
            _.defaults(options, {
                "message": "Field is invalid"
            });
            var testOptions = _.values(_.omit(options, "message"));
            testOptions.unshift(value);
            return new Promise(function (resolve, reject) {
                if (!validator[fn].apply(validator, testOptions)) {
                    reject(new errors.fieldValidationError(param, value, options.message));
                    return;
                }
                resolve(value);
            });
        };
    });

    function Model(defs) {
        this.defs = defs;
        this.params = {};
        this.errors = {};

        //Checks if param is empty
        this.paramIsEmpty = function (param) {
            return (this.getParam(param) === undefined || this.getParam(param) === null || this.getParam(param) === '');
        };

        //Gets param
        this.getParam = function (param) {
            return this.params[param];
        };

        //Sets param
        this.setParam = function (param, value) {
            if (_.contains(_.keys(this.defs), param)) {
                this.params[param] = value;
            }
        };

        //Adds error to param
        this.addError = function (param, error) {
            this.errors[param] = this.errors[param] || [];
            this.errors[param].push(error);
        };

        //Gets all params
        this.getParams = function () {
            var params = {};
            _.each(Object.keys(defs), function (param) {
                params[param] = this.getParam(param);
            }, this);
            return params;
        };

        //Sets all params
        this.setParams = function (params) {
            _.each(params, function (value, param) {
                this.setParam(param, value);
            }, this);
        };

        //Validates the model
        this.validate = function (params) {

            this.setParams(params);
            var model = this;
            var paramsPromises = [];

            _.each(this.defs, function (def, param) {

                var promise;

                if (this.paramIsEmpty(param) && def.allowEmpty) {
                    promise = new Promise(function (resolve) {
                        resolve(def.defaultValue);
                    });
                } else {
                    promise = new Promise(function (resolve) {
                        resolve(model.getParam(param));
                    });

                    _.each(def.rules, function (ruleOptions, validator) {
                        promise = promise
                            .then(function (value) {
                                return (validators[validator])(param, value, ruleOptions);
                            });
                    });
                }

                promise
                    .then(function (value) {
                        model.setParam(param, value);
                    })
                    .catch(errors.fieldValidationError, function (error) {
                        model.addError(error.param, error.message);
                    })
                    .catch(function (error) {
                        throw error;
                    });

                paramsPromises.push(promise);

            }, this);

            return new Promise(function (resolve, reject) {
                Promise
                    .all(paramsPromises)
                    .then(function () {
                        resolve(model.getParams());
                    })
                    .catch(errors.fieldValidationError, function () {
                        reject(new errors.modelValidationError(model.errors));
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        };
    }

    module.exports = function (defs, options) {
        defs = defs || {};
        options = options || {};

        _.defaults(options, {
            source: 'body',
            param:  'model'
        });

        return function (req, res, next) {
            var model = new Model(defs);
            var data;
            switch (options.source) {
                case 'body':
                    data = req.body;
                    break;
                case 'query':
                    data = req.query;
                    break;
                case 'params':
                    data = req.params;
                    break;
                default:
                    next(new Error('Unknown source'));
                    return;
            }
            model
                .validate(data)
                .then(function (params) {
                    req[options.param] = params;
                    next();
                })
                .catch(function (error) {
                    next(error);
                });
        };
    };

    module.exports.errors = errors;
    module.exports.validators = validators;
    module.exports.validator = validator;
    module.exports.model = Model;

})(module, require);
