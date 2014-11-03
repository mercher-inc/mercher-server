var express = require('express'),
    router = express.Router(),
    ShopReviewModel = require('../../../models/shop_review'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'POST'
    });
    next();
});

router.post('/', require('./middleware/auth_check'));

router.post('/', validator(require('./validation/shop_reviews/create.json'), {source: 'body', param: 'createForm'}));

router.post('/', function (req, res, next) {
    new ShopReviewModel()
        .save(req['createForm'])
        .then(function (shopReviewModel) {
            return shopReviewModel.load(['shop.image', 'user.image']);
        })
        .then(function (shopReviewModel) {
            res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/shop_reviews/' + shopReviewModel.id);
            res.status(201).json(shopReviewModel);
        });
});

router.use('/:shopReviewId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT,DELETE'
    });
    next();
});

router.param('shopReviewId', function (req, res, next) {
    var shopReviewModel = new ShopReviewModel({id: parseInt(req.params.shopReviewId)});
    shopReviewModel.fetch({require: true})
        .then(function (model) {
            req.shopReview = model;
            next();
        })
        .catch(ShopReviewModel.NotFoundError, function () {
            var notFoundError = new (require('./errors/not_found'))("ShopReview was not found");
            next(notFoundError);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:shopReviewId', function (req, res) {
    req.shopReview
        .load(['shop.image', 'user.image'])
        .then(function () {
            res.json(req.shopReview);
        });
});

router.put('/:shopReviewId', require('./middleware/auth_check'));

router.put('/:shopReviewId', validator(require('./validation/shop_reviews/update.json'), {source: 'body', param: 'updateForm'}));

router.put('/:shopReviewId', function (req, res, next) {
    req.shopReview
        .save(req['updateForm'])
        .then(function (shopReviewModel) {
            return shopReviewModel.load(['shop.image', 'user.image']);
        })
        .then(function (shopReviewModel) {
            res.status(200).json(shopReviewModel);
        });
});

module.exports = router;
