var express = require('express'),
    router = express.Router(),
    Promise = require('bluebird'),
    Bookshelf = require('../../../modules/bookshelf'),
    ShopsCollection = require('../../../collections/shops'),
    ShopModel = require('../../../models/shop'),
    ManagerModel = require('../../../models/manager'),
    validator = require('../../../modules/express-async-validator/module');

router.use('/', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,POST'
    });
    next();
});

router.get('/', validator(require('./validation/collection.json'), {source: 'query', param: 'collectionForm'}));

router.get('/', function (req, res, next) {
    var shopsCollection = new ShopsCollection();
    var shopModel = new ShopModel();

    var collectionRequest = shopsCollection
        .query(function (qb) {
            qb
                .limit(req['collectionForm'].limit)
                .offset(req['collectionForm'].offset);
        })
        .fetch({
            withRelated: ['image', 'coverImage']
        });

    var totalRequest = Bookshelf
        .knex(shopModel.tableName)
        .count(shopModel.idAttribute)
        .then(function (result) {
            return parseInt(result[0].count);
        });

    Promise
        .props({
            shops: collectionRequest,
            total: totalRequest
        })
        .then(function (results) {
            res.json(results);
        })
        .catch(function (err) {
            next(err);
        });
});

router.post('/', require('./middleware/auth_check'));

router.post('/', validator(require('./validation/shops/create.json'), {source: 'body', param: 'createForm'}));

router.post('/', function (req, res, next) {
    Bookshelf
        .transaction(function (t) {
            return new ShopModel()
                .save(req['createForm'], {transacting: t})
                .then(function (shopModel) {
                    return new ManagerModel()
                        .save({
                            userId: req.currentUser.id,
                            shopId: shopModel.id,
                            role:   'owner'
                        }, {
                            transacting: t
                        })
                        .then(function () {
                            return shopModel;
                        });
                });
        })
        .then(function (shopModel) {
            return shopModel.load(['image', 'coverImage']);
        })
        .then(function (shopModel) {
            res.set('Location', (req.secure ? 'https' : 'http') + '://' + req.get('host') + '/api/v1/shops/' + shopModel.id);
            res.status(201).json(shopModel);
        });
});

router.use('/:shopId', function (req, res, next) {
    res.set({
        'Access-Control-Allow-Methods': 'GET,PUT'
    });
    next();
});

router.param('shopId', function (req, res, next) {
    var shopModel = new ShopModel({id: parseInt(req.params.shopId)});
    shopModel.fetch({require: true})
        .then(function (model) {
            req.shop = model;
            next();
        })
        .catch(ShopModel.NotFoundError, function () {
            var notFoundError = new (require('./errors/not_found'))("Shop was not found");
            next(notFoundError);
        })
        .catch(function (err) {
            next(err);
        });
});

router.get('/:shopId', function (req, res) {
    req.shop
        .load(['image', 'coverImage'])
        .then(function () {
            res.json(req.shop);
        });
});

router.put(
    '/:shopId',
    require('./middleware/auth_check'),
    require('./middleware/role_check')(
        function (req) {
            return req.shop.id;
        },
        'owner',
        'You are not allowed to update this shop\'s details'
    )
);

router.put('/:shopId', validator(require('./validation/shops/update.json'), {source: 'body', param: 'updateForm'}));

router.put('/:shopId', function (req, res, next) {
    req.shop
        .save(req['updateForm'])
        .then(function (shopModel) {
            return shopModel.load(['image', 'coverImage']);
        })
        .then(function (shopModel) {
            res.status(200).json(shopModel);
        });
});

router.use('/:shopId/products', require('./shops/products'));
router.use('/:shopId/managers', require('./shops/managers'));
router.use('/:shopId/orders', require('./shops/orders'));

module.exports = router;
