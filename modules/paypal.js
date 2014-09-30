(function (module, require) {
    var request = require('request'),
        Promise = require('bluebird'),
        _ = require('underscore'),
        crypto = require('crypto'),
        oAuthSign = require('oauth-sign');

    function rfc3986(str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/\*/g, '%2A')
            .replace(/\./g, "%2E")
            .replace(/\+/g, ' ')
            .replace(/-/g, '%2D')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/'/g, '%27')
            .replace(/%7E/g, '~')
            ;
    }

    module.exports = function () {
        this.options = {
            applicationId: 'APP-80W284485P519543T',
            userId:        'dmitriy.s.les-facilitator_api1.gmail.com',
            password:      '1391764851',
            signature:     'AIkghGmb0DgD6MEPZCmNq.bKujMAA8NEIHryH-LQIfmx7UZ5q1LXAa7T',
            sandbox:       true
        };

        this.genSign = function (consumerKey, consumerSecret, token, tokenSecret, httpMethod, endpoint) {
            var data = {
                "oauth_consumer_key":     consumerKey,
                "oauth_signature_method": "HMAC-SHA1",
                "oauth_timestamp":        Math.round((new Date()).getTime() / 1000),
                "oauth_token":            token,
                "oauth_version":          "1.0"
            };

            var dataString = Object.keys(data).sort().map(function (i) {
                return i + '=' + data[i]
            }).join('&');

            var dataArray = [
                httpMethod.toUpperCase(),
                endpoint,
                dataString
            ];

            var baseString = dataArray.map(function (i) {
                return rfc3986(i).replace(/(%[A-Za-z0-9]{2})/g, function (s) {
                    return s.toLowerCase();
                });
            }).join('&');

            var keyParts = [
                consumerSecret,
                tokenSecret ? tokenSecret : ""
            ];

            var key = keyParts.map(function (i) {
                return rfc3986(i).replace(/(%[A-Za-z0-9]{2})/g, function (s) {
                    return s.toLowerCase();
                });
            }).join('&');

            var hmac = crypto.createHmac('sha1', key);
            hmac.update(baseString);
            data["oauth_signature"] = hmac.digest('base64');
            return data;
        };

        this.generateFullAuthString = function (consumerKey, consumerSecret, token, tokenSecret, httpMethod, endpoint) {
            var response = this.genSign(consumerKey, consumerSecret, token, tokenSecret, httpMethod, endpoint);
            return "token=" + response['oauth_token'] +
                ",signature=" + response['oauth_signature'] +
                ",timestamp=" + response['oauth_timestamp'];
        };

        this.send = function (endpoint, data, oauth) {
            var client = this;
            return new Promise(function (resolve, reject) {
                if (!data.requestEnvelope) {
                    data.requestEnvelope = {
                        detailLevel:   'ReturnAll',
                        errorLanguage: 'en_US'
                    };
                }
                var baseUrl = client.options.sandbox ? 'https://svcs.sandbox.paypal.com/' : 'https://svcs.paypal.com/';
                var requestOptions = {
                    url:     baseUrl + endpoint,
                    method:  'POST',
                    json:    data,
                    headers: {
                        "X-PAYPAL-REQUEST-DATA-FORMAT":  "JSON",
                        "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
                        "X-PAYPAL-APPLICATION-ID":       client.options.applicationId
                    }
                };
                if (oauth) {
                    requestOptions.headers["X-PAYPAL-AUTHORIZATION"] = client.generateFullAuthString(
                        client.options.userId,
                        client.options.password,
                        oauth.token,
                        oauth.token_secret,
                        requestOptions.method,
                        requestOptions.url
                    );
                } else {
                    requestOptions.headers["X-PAYPAL-SECURITY-USERID"] = client.options.userId;
                    requestOptions.headers["X-PAYPAL-SECURITY-PASSWORD"] = client.options.password;
                    requestOptions.headers["X-PAYPAL-SECURITY-SIGNATURE"] = client.options.signature;
                }
                request(requestOptions, function (error, response, body) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (body.responseEnvelope.ack == 'Success') {
                        resolve(body);
                    } else {
                        console.log("response: ", body);
                        reject(body);
                    }
                });
            });

        };
    };

})(module, require);
