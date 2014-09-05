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

module.exports = router;
