var expect = require('chai').expect;
var sinon = require('sinon');

var request = require('request');
var messages = require('elasticio-node').messages;

var trigger = require('../../../lib/triggers/getProducts');

describe('Trigger getProducts', function() {

    before(function() {
        this.config = {
            authToken: 'testauthtokenstring',
            criteria: '(Vendor Name:Apple)'
        }
        this.testProduct = {
            PRODUCTID: 2000,
            'Product Name': 'Test Product'
        }
    });

    it('processes valid response', function(done) {
        var expectedProduct = this.testProduct;

        var error;
        var componentStub = {
            emit: function(event, data) {
                if (event === 'end') {
                    requestStub.restore();

                    return done(error);
                }
                if (event === 'error') {
                    error = data;
                }
                if (event === 'data') {
                    expect(data.body).to.deep.equal(expectedProduct);
                }
            }
        }
        var requestStub = sinon.stub(request, 'get')
            .callsArgWith(1, undefined, {statusCode: 200}, {
                Products: [ this.testProduct ]
            });

        trigger.process.call(componentStub, undefined, this.config);
    });

    it('throws error for unexpected response', function(done) {
        var error;
        var componentStub = {
            emit: function(event, data) {
                if (event === 'end') {
                    requestStub.restore();

                    return done(error);
                }
                if (event === 'error') {
                    expect(data.message).to.equal('Unexpected API response: "Bad request"');
                }
                if (event === 'data') {
                    error = new Error('Event `data` should not be called');
                }
            }
        }
        var requestStub = sinon.stub(request, 'get').callsArgWith(1, undefined, {statusCode: 400}, 'Bad request');

        trigger.process.call(componentStub, this.msg, this.config);
    });

});

