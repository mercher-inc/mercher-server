var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    UserModel = require('./user'),
    ShopModel = require('./shop'),
    OrderItemModel = require('./order_item'),
    OrderTotalModel = require('./order_total');

var OrderModel = BaseModel.extend(
    {
        tableName: 'order',
        defaults:  {
            userId:           null,
            managerId:        null,
            shopId:           null,
            status:           'draft',
            tax:              0,
            platform:         'marketplace',
            pay_key:          null,
            expires:          null,
            shipping_memo:    null,
            shipping_email:   null,
            shipping_name:    null,
            shipping_country: 'US',
            shipping_state:   null,
            shipping_city:    null,
            shipping_street1: null,
            shipping_street2: null,
            shipping_zip:     null
        },

        user:       function () {
            return this.belongsTo(UserModel);
        },
        shop:       function () {
            return this.belongsTo(ShopModel);
        },
        orderItems: function () {
            return this.hasMany(OrderItemModel);
        },
        total:      function () {
            return this.hasOne(OrderTotalModel, 'id');
        },

        initialize: function () {
            this.on('saving', this.copyFields);
        },

        copyFields: function () {
            var orderModel = this;
            return orderModel
                .load('shop')
                .then(function (orderModel) {
                    orderModel.set('tax', orderModel.related('shop').get('tax'));
                    return orderModel;
                });
        },

        pay: function (credentials) {
            var orderModel = this,
                PayPal = require('../modules/paypal'),
                payPalClient = new PayPal,
                _ = require('underscore');

            return orderModel.load(['shop', 'orderItems.product'])
                .then(function (orderModel) {
                    return orderModel.save({tax: orderModel.related('shop').get('tax')});
                })
                .then(function (orderModel) {
                    orderModel.related('orderItems').each(function (orderItemModel) {
                        orderItemModel.set({
                            price:        orderItemModel.related('product').get('price'),
                            shippingCost: orderItemModel.related('product').get('shippingCost')
                        });
                    });
                    return orderModel.related('orderItems')
                        .invokeThen('save')
                        .then(function () {
                            return orderModel;
                        });
                })
                .then(function (orderModel) {
                    return orderModel.load('total');
                })
                .then(function (orderModel) {
                    var totalPrice = parseFloat(orderModel.related('total').get('price')),
                        totalShippingCost = parseFloat(orderModel.related('total').get('shippingCost')),
                        totalTax = parseFloat(orderModel.related('total').get('tax')),
                        totalShop = totalPrice + totalShippingCost + totalTax,
                        totalMarketplace = (Math.ceil(totalPrice * 2)) / 100;

                    return payPalClient
                        .send('AdaptivePayments/Pay', {
                            actionType:                        'PAY',
                            currencyCode:                      'USD',
                            feesPayer:                         'PRIMARYRECEIVER',
                            payKeyDuration:                    'PT15M',
                            reverseAllParallelPaymentsOnError: true,
                            clientDetails:                     {
                                applicationId: 'Mercher API',
                                partnerName:   'Mercher Inc.'
                            },
                            receiverList:                      {
                                receiver: [
                                    {
                                        amount:      totalShop,
                                        email:       'seller1.test@mercher.net',
                                        paymentType: 'GOODS',
                                        primary:     true
                                    },
                                    {
                                        amount:      totalMarketplace,
                                        email:       payPalClient.options.email,
                                        paymentType: 'SERVICE',
                                        primary:     false
                                    }
                                ]
                            },
                            trackingId:                        orderModel.id,
                            cancelUrl:                         credentials.cancelUrl,
                            returnUrl:                         credentials.returnUrl
                        })
                        .then(function (payResponse) {
                            return orderModel.save({payKey: payResponse.payKey});
                        });
                })
                .then(function (orderModel) {
                    var totalShippingCost = parseFloat(orderModel.related('total').get('shippingCost')),
                        totalTax = parseFloat(orderModel.related('total').get('tax')),
                        items = [];

                    orderModel.related('orderItems').each(function (orderItemModel) {
                        items.push({
                            name:       orderItemModel.related('product').get('title'),
                            identifier: orderItemModel.related('product').id,
                            price:      parseFloat(orderItemModel.get('price')) * parseInt(orderItemModel.get('amount')),
                            itemPrice:  parseFloat(orderItemModel.get('price')),
                            itemCount:  parseInt(orderItemModel.get('amount'))
                        });
                    });
                    console.log(items);

                    return payPalClient
                        .send('AdaptivePayments/SetPaymentOptions', {
                            payKey:          orderModel.get('payKey'),
                            displayOptions:  {
                                businessName: orderModel.related('shop').get('title')
                            },
                            senderOptions:   {
                                requireShippingAddressSelection: true
                            },
                            receiverOptions: {
                                receiver:    {
                                    email: 'seller1.test@mercher.net'
                                },
                                invoiceData: {
                                    totalTax:      totalTax,
                                    totalShipping: totalShippingCost,
                                    item:          items
                                }
                            }
                        })
                        .then(function () {
                            return orderModel;
                        });
                })
                .then(function (orderModel) {
                    return orderModel;
                });
        }
    }
);

module.exports = OrderModel;
