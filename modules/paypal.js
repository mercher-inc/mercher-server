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
                    oauth.consumer_key = client.options.userId;
                    oauth.consumer_secret = client.options.password;

                    var oAuthData = {
                        "oauth_consumer_key":     oauth.consumer_key,
                        "oauth_signature_method": "HMAC-SHA1",
                        "oauth_timestamp":        Math.round((new Date()).getTime() / 1000),
                        "oauth_token":            oauth.token,
                        "oauth_version":          "1.0"
                    };

                    var oAuthDataString = Object.keys(oAuthData).sort().map(function (i) {
                        return i + '=' + oAuthData[i]
                    }).join('&');

                    var dataArray = [
                        requestOptions.method,
                        requestOptions.url,
                        oAuthDataString
                    ];

                    console.log(dataArray);

                    var baseString = dataArray.map(function (i) {
                        return rfc3986(i).replace(/(%[A-Za-z0-9]{2})/g, function (s) {
                            return s.toLowerCase();
                        });
                    }).join('&');

                    console.log(baseString);

                    var keyParts = [
                        oauth.consumer_secret,
                        oauth.token_secret ? oauth.token_secret : ""
                    ];
                    console.log(keyParts);

                    var key = keyParts.map(function (i) {
                        return rfc3986(i).replace(/(%[A-Za-z0-9]{2})/g, function (s) {
                            return s.toLowerCase();
                        });
                    }).join('&');
                    console.log(key);

                    var hmac = crypto.createHmac('sha1', key);
                    hmac.update(baseString);
                    var signature = hmac.digest('base64');
                    console.log(signature);

                    console.log(oauth);
                    console.log(oAuthData);

                    requestOptions.headers["X-PAYPAL-AUTHORIZATION"] = "token=" + oauth.token + ",signature=" + signature + ",timestamp=" + oAuthData['oauth_timestamp'];
                    console.log(requestOptions.headers["X-PAYPAL-AUTHORIZATION"]);

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


/*
 POST&https%3a%2f%2fsvcs%2esandbox%2epaypal%2ecom%2fPermissions%2fGetAdvancedPersonalData&oauth_consumer_key%3ddmitriy%2es%2eles%2dfacilitator_api1%2egmail%2ecom%26oauth_signature_method%3dHMAC%2dSHA1%26oauth_timestamp%3d1412071471%26oauth_token%3dUUvJK9iUQuNUKoAwxkH29I53sZPoPtGy3JAPQ%2e71khmMlqf3ptApyw%26oauth_version%3d1%2e0
 POST&https%3a%2f%2fsvcs%2esandbox%2epaypal%2ecom%2fPermissions%2fGetAdvancedPersonalData&oauth_consumer_key%3ddmitriy%2es%2eles%2dfacilitator_api1%2egmail%2ecom%26oauth_signature_method%3dHMAC%2dSHA1%26oauth_timestamp%3d1412071471%26oauth_token%3dUUvJK9iUQuNUKoAwxkH29I53sZPoPtGy3JAPQ%2e71khmMlqf3ptApyw%26oauth_version%3d1%2e0

 1391764851&m6BC04aB8Q0aw%2dX3T%2eHsxGv%2d%2elk
 1391764851&m6BC04aB8Q0aw%2dX3T%2eHsxGv%2d%2elk

 +uAa1SLWZxkWcGNPNfVLbaWkxcw=
 +uAa1SLWZxkWcGNPNfVLbaWkxcw=
 */
