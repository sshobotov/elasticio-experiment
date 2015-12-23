var Q = require('q');
var elasticio = require('elasticio-node');
var messages = elasticio.messages;
var api = require('../api');

exports.process = processAction;

function processAction(msg, cfg) {
    new elasticio.HttpComponent(this)
        .success(processResponse.bind(this, msg))
        .get(api.updatePrice(cfg.authToken, cfg.priceBookID, msg.body.product.PRODUCTID, msg.body.price));
}

function processResponse(msg, response, body) {
    if (response.statusCode !== 200) {
        throw new Error('Unexpected API response: ' + JSON.stringify(body));
    }

    var product = msg.body.product;
    var msg = messages.newMessageWithBody(product);

    this.emit('data', msg);
}
