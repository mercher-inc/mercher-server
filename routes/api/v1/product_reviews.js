var express = require('express'),
    router = express.Router(),
    ProductReviewModel = require('../../../models/product_review'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/', require('./middleware/auth_check'));

router.post('/', validator(require('./validation/product_reviews/create.json'), {source: 'body', param: 'createForm'}));

router.post('/', function (req, res, next) {
    new ProductReviewModel()
        .save(req['createForm'])
        .then(function (productReviewModel) {
            return productReviewModel.load(['product', 'user']);
        })
        .then(function (productReviewModel) {
            res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/product_reviews/' + productReviewModel.id);
            res.status(201).json(productReviewModel);
        });
});

router.use('/:productReviewId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT,DELETE'
    });
    next();
});

router.param('productReviewId', function (req, res, next) {
    var productReviewModel = new ProductReviewModel({id: parseInt(req.params.productReviewId)});
    productReviewModel.fetch({require: true})
        .then(function (model) {
            req.productReview = model;
            next();
        })
        .catch(ProductReviewModel.NotFoundError, function () {
            var notFoundError = new (require('./errors/not_found'))("ProductReview was not found");
            next(notFoundError);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:productReviewId', function (req, res) {
    req.productReview
        .load(['user.image', 'product.productImages.image'])
        .then(function () {
            res.json(req.productReview);
        });
});

router.put('/:productReviewId', require('./middleware/auth_check'));

router.put('/:productReviewId', validator(require('./validation/product_reviews/update.json'), {source: 'body', param: 'updateForm'}));

router.put('/:productReviewId', function (req, res, next) {
    req.productReview
        .save(req['updateForm'])
        .then(function (productReviewModel) {
            return productReviewModel.load(['user.image', 'product.productImages.image']);
        })
        .then(function (productReviewModel) {
            res.status(200).json(productReviewModel);
        });
});

module.exports = router;
