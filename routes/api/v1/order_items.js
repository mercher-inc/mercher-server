var express = require('express'),
    router = express.Router(),
    OrderItemModel = require('../../../models/order_item');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/', require('./middleware/auth_check'));

router.post('/', function (req, res, next) {
    new OrderItemModel()
        .save(req.body, {req: req})
        .then(function (orderItemModel) {
            new OrderItemModel({id: orderItemModel.id})
                .fetch({
                    withRelated: ['order.total', 'product']
                })
                .then(function (orderItemModel) {
                    res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/order_items/' + orderItemModel.id);
                    res.status(201).json(orderItemModel);
                });
        })
        .catch(OrderItemModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(OrderItemModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(OrderItemModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            console.log(error);
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

router.use('/:orderItemId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT,DELETE'
    });
    next();
});

router.param('orderItemId', function (req, res, next) {
    req
        .model({
            "orderItemId": {
                "rules":      {
                    "required":  {
                        "message": "Order item ID is required"
                    },
                    "isNumeric": {
                        "message": "Order item ID should be numeric"
                    },
                    "toInt":     {}
                },
                "source":     ["params"],
                "allowEmpty": false
            }
        })
        .validate()
        .then(function () {
            var orderItemModel = new OrderItemModel({id: req.params.orderItemId});
            orderItemModel.fetch({require: true})
                .then(function (model) {
                    req.orderItem = model;
                    next();
                })
                .catch(OrderItemModel.NotFoundError, function () {
                    var notFoundError = new (require('./errors/not_found'))("Order item was not found");
                    next(notFoundError);
                })
                .catch(function (err) {
                    next(err);
                });
        })
        .catch(function (error) {
            var badRequestError = new (require('./errors/bad_request'))("Bad request", error);
            next(badRequestError);
        });
});

router.get('/:orderItemId', function (req, res) {
    req.orderItem
        .load(['order.total', 'product'])
        .then(function () {
            res.json(req.orderItem);
        });
});

router.put('/:orderItemId', require('./middleware/auth_check'));

router.put('/:orderItemId', function (req, res, next) {
    req.orderItem
        .save(req.body, {req: req})
        .then(function (orderItemModel) {
            new OrderItemModel({id: orderItemModel.id})
                .fetch({
                    withRelated: ['order.total', 'product']
                })
                .then(function (orderItemModel) {
                    res.status(200).json(orderItemModel);
                });
        })
        .catch(OrderItemModel.PermissionError, function (error) {
            var forbiddenError = new (require('./errors/forbidden'))(error.message);
            next(forbiddenError);
        })
        .catch(OrderItemModel.ValidationError, function (error) {
            var validationError = new (require('./errors/validation'))("Validation failed", error);
            next(validationError);
        })
        .catch(OrderItemModel.InternalServerError, function (error) {
            var internalServerError = new (require('./errors/internal'))(error.message);
            next(internalServerError);
        })
        .catch(function (error) {
            var internalServerError = new (require('./errors/internal'))();
            next(internalServerError);
        });
});

module.exports = router;
