var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    UserModel = require('./user'),
    ShopModel = require('./shop'),
    OrderItemModel = require('./order_item'),
    OrderTotalModel = require('./order_total'),
    OrderTransactionModel = require('./order_transaction');

var OrderModel = BaseModel.extend(
    {
        tableName: 'order',
        defaults:  {
            userId:            null,
            managerId:         null,
            shopId:            null,
            status:            'draft',
            tax:               0,
            platform:          'marketplace',
            payKey:            null,
            paymentExecStatus: null,
            expires:           null,
            reason:            null,
            memo:              null,
            shippingAddress:   null,
            createdAt:         null,
            updatedAt:         null
        },

        user:         function () {
            return this.belongsTo(UserModel);
        },
        shop:         function () {
            return this.belongsTo(ShopModel);
        },
        orderItems:   function () {
            return this.hasMany(OrderItemModel);
        },
        transactions: function () {
            return this.hasMany(OrderTransactionModel);
        },
        total:        function () {
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
                            ipnNotificationUrl:                credentials.ipnNotificationUrl,
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
                            var expirationDate = new Date();
                            expirationDate.setTime(expirationDate.getTime() + 15 * 60 * 1000); // + 15 minutes

                            if (payResponse['payErrorList']) {
                                console.error(payResponse);
                            }

                            return orderModel.save({
                                payKey:            payResponse.payKey,
                                paymentExecStatus: payResponse.paymentExecStatus,
                                expires:           expirationDate.toISOString()
                            });
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
