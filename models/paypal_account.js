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
                PayPal = require('../modules/paypal'),
                payPalClient = new PayPal,
                ShopPayPalAuthRequestModel = require('../models/shop_paypal_auth_request');

            return new Promise(function (resolve, reject) {
                // Getting Shop's PayPal Auth request
                new ShopPayPalAuthRequestModel({requestToken: credentials.requestToken})
                    .fetch({require: true, withRelated: ['shop']})
                    .then(function (shopPayPalAuthRequestModel) {

                        // Getting the shop of PayPal Auth request
                        var shopModel = shopPayPalAuthRequestModel.related('shop');

                        // Getting access token
                        return payPalClient
                            .send('Permissions/GetAccessToken', {
                                token:    credentials.requestToken,
                                verifier: credentials.verificationCode
                            })
                            // We don't need PayPal Auth request anymore, delete it
                            .then(function (accessTokenResponse) {
                                return shopPayPalAuthRequestModel
                                    .destroy()
                                    .then(function () {
                                        return accessTokenResponse;
                                    });
                            })
                            // We've got access token response
                            .then(function (accessTokenResponse) {
                                // Getting personal data with access token
                                return payPalClient
                                    .send('Permissions/GetAdvancedPersonalData', {
                                        attributeList: {
                                            attribute: [
                                                'http://axschema.org/namePerson/first',
                                                'http://axschema.org/namePerson/last',
                                                'http://axschema.org/contact/email',
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
                                        token:        accessTokenResponse.token,
                                        token_secret: accessTokenResponse.tokenSecret
                                    })
                                    // We've got personal info
                                    .then(function (advancedPersonalDataResponse) {
                                        // Let's parse it into normalized array
                                        var personalData = {};
                                        Object.keys(advancedPersonalDataResponse.response.personalData).map(function (i) {
                                            switch (advancedPersonalDataResponse.response.personalData[i].personalDataKey) {
                                                case 'http://axschema.org/namePerson/first':
                                                    personalData['firstName'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                                case 'http://axschema.org/namePerson/last':
                                                    personalData['lastName'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                                case 'http://axschema.org/contact/email':
                                                    personalData['accountEmail'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                                case 'http://axschema.org/company/name':
                                                    personalData['businessName'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                                case 'http://axschema.org/contact/country/home':
                                                    personalData['country'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                                case 'http://axschema.org/contact/postalCode/home':
                                                    personalData['postalCode'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                                case 'http://schema.openid.net/contact/street1':
                                                    personalData['street1'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                                case 'http://schema.openid.net/contact/street2':
                                                    personalData['street2'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                                case 'http://axschema.org/contact/city/home':
                                                    personalData['city'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                                case 'http://axschema.org/contact/state/home':
                                                    personalData['state'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                                case 'http://axschema.org/contact/phone/default':
                                                    personalData['phone'] = advancedPersonalDataResponse.response.personalData[i].personalDataValue;
                                                    break;
                                            }
                                        });

                                        // Looking for existing PayPal Account record with this email
                                        return new PayPalAccountModel({accountEmail: personalData['accountEmail']})
                                            .fetch()
                                            .then(function (payPalAccountModel) {
                                                // If it's a new account - let's create it!
                                                if (!payPalAccountModel) {
                                                    payPalAccountModel = new PayPalAccountModel();
                                                }
                                                // Setting personal data
                                                payPalAccountModel.set(personalData);
                                                // Setting access token
                                                payPalAccountModel.set({
                                                    token:              accessTokenResponse.token,
                                                    secret:             accessTokenResponse.tokenSecret,
                                                    accountPermissions: accessTokenResponse.scope
                                                });
                                                return payPalAccountModel;
                                            })
                                    })
                            })
                            // Checking account verification status and account type
                            .then(function (payPalAccountModel) {
                                return payPalClient
                                    .send('AdaptiveAccounts/GetVerifiedStatus', {
                                        emailAddress:  payPalAccountModel.get('accountEmail'),
                                        firstName:     payPalAccountModel.get('firstName'),
                                        lastName:      payPalAccountModel.get('lastName'),
                                        matchCriteria: 'NAME'
                                    })
                                    // Setting verification status and account type
                                    .then(function (verifiedStatusResponse) {
                                        payPalAccountModel.set({
                                            isVerified:  verifiedStatusResponse.accountStatus === 'VERIFIED',
                                            accountType: verifiedStatusResponse.userInfo.accountType,
                                            accountId:   verifiedStatusResponse.userInfo.accountId
                                        });
                                        return payPalAccountModel;
                                    })
                            })
                            // Saving PayPal Account
                            .then(function (payPalAccountModel) {
                                return payPalAccountModel.save();
                            })
                            // Attaching PayPal account to the shop
                            .then(function (payPalAccountModel) {
                                return shopModel
                                    .related('payPalAccounts')
                                    .attach(payPalAccountModel)
                                    .then(function () {
                                        return payPalAccountModel;
                                    });
                            })
                            // We've done all we needed! Return PayPal account model
                            .then(function (payPalAccountModel) {
                                resolve(payPalAccountModel);
                            })
                            .catch(function (e) {
                                reject(e);
                            });
                    })
                    // We don't know this request token!
                    .catch(ShopPayPalAuthRequestModel.NotFoundError, function (e) {
                        reject(e);
                    });
            });
        }
    }
);

module.exports = PayPalAccountModel;
