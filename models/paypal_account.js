var app = require('../app'),
    io = app.get('io'),
    BaseModel = require('./base'),
    Promise = require('bluebird');

var PayPalAccountModel = BaseModel.extend(
    {
        tableName: 'paypal_account'
    },
    {
        register: function (credentials) {
            var PayPalAccountModel = this,
                payPalAccountModel = new PayPalAccountModel(),
                PayPal = require('../modules/paypal'),
                payPalClient = new PayPal,
                ShopPayPalAuthRequestModel = require('../models/shop_paypal_auth_request'),
                ShopPayPalAccountModel = require('../models/shop_paypal_account');

            return new Promise(function (resolve, reject) {
                new ShopPayPalAuthRequestModel({requestToken: credentials.requestToken})
                    .fetch({require: true})
                    .then(function (shopPayPalAuthRequestModel) {
//                        console.log(shopPayPalAuthRequestModel);

                        //Getting access token
                        payPalClient
                            .send('Permissions/GetAccessToken', {
                                token:    credentials.requestToken,
                                verifier: credentials.verificationCode
                            })
                            .then(function (payPalResponse) {
//                                console.log(payPalResponse);
                                //Setting access token
                                payPalAccountModel.set({
                                    token:              payPalResponse.token,
                                    secret:             payPalResponse.tokenSecret,
                                    accountPermissions: payPalResponse.scope
                                });

                                //Getting personal data
                                payPalClient
                                    .send('Permissions/GetAdvancedPersonalData', {
                                        attributeList: {
                                            attribute: [
                                                'http://axschema.org/namePerson/first',
                                                'http://axschema.org/namePerson/last',
                                                'http://axschema.org/contact/email',
                                                'http://schema.openid.net/contact/fullname',
                                                'http://axschema.org/company/name',
                                                'http://axschema.org/contact/country/home',
                                                'http://axschema.org/contact/postalCode/home',
                                                'http://schema.openid.net/contact/street1',
                                                'http://schema.openid.net/contact/street2',
                                                'http://axschema.org/contact/city/home',
                                                'http://axschema.org/contact/state/home',
                                                'http://axschema.org/contact/phone/default',
                                                'https://www.paypal.com/webapps/auth/schema/payerID'
                                            ]
                                        }
                                    }, {
                                        token:        payPalResponse.token,
                                        token_secret: payPalResponse.tokenSecret
                                    })
                                    .then(function (payPalResponse) {
//                                        console.log(payPalResponse.response.personalData);
                                        Object.keys(payPalResponse.response.personalData).map(function (i) {
                                            switch (payPalResponse.response.personalData[i].personalDataKey) {
                                                case 'http://axschema.org/company/name':
                                                    payPalAccountModel.set('businessName', payPalResponse.response.personalData[i].personalDataValue);
                                                    break;
                                                case 'http://axschema.org/contact/email':
                                                    payPalAccountModel.set('accountEmail', payPalResponse.response.personalData[i].personalDataValue);
                                                    break;
                                                case 'http://axschema.org/namePerson/first':
                                                    payPalAccountModel.set('firstName', payPalResponse.response.personalData[i].personalDataValue);
                                                    break;
                                                case 'http://axschema.org/namePerson/last':
                                                    payPalAccountModel.set('lastName', payPalResponse.response.personalData[i].personalDataValue);
                                                    break;
                                                case 'https://www.paypal.com/webapps/auth/schema/payerID':
                                                    payPalAccountModel.set('accountId', payPalResponse.response.personalData[i].personalDataValue);
                                                    break;
                                            }
                                        });
                                        payPalAccountModel
                                            .save()
                                            .then(function (payPalAccountModel) {
                                                resolve(payPalAccountModel);
                                            });
                                    })
                                    .catch(function (e) {
                                        reject(e);
                                    });
                            })
                            .catch(function (e) {
                                reject(e);
                            });
                    })
                    .catch(ShopPayPalAuthRequestModel.NotFoundError, function (e) {
                        reject(e);
                    });
            });
        }
    }
);

module.exports = PayPalAccountModel;
