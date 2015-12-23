var Q = require('q');
var elasticio = require('elasticio-node');
var messages = elasticio.messages;
var api = require('../api');

exports.process = processTrigger;

function processTrigger(msg, cfg) {
    new elasticio.HttpComponent(this)
        .success(processResponse.bind(this))
        .get(api.getProducts(cfg.authToken, cfg.criteria));
}

function processResponse(response, body) {
    if (response.statusCode !== 200 || !Array.isArray(body.Products)) {
        throw new Error('Unexpected API response: ' + JSON.stringify(body));
    }

    for (var i in body.Products) {
        var product = body.Products[i];
        var msg = messages.newMessageWithBody(product);

        this.emit('data', msg);
    }
}
