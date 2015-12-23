var expect = require('chai').expect;
var sinon = require('sinon');

var request = require('request');
var messages = require('elasticio-node').messages;

var action = require('../../../lib/actions/updatePrice');

describe('Action updatePrice', function() {

    before(function() {
        this.msg = messages.newMessageWithBody({
            product: {
                PRODUCTID: 100
            },
            price: 300
        });

        this.config = {
            authToken: 'testauthtokenstring',
            priceBookID: 1000
        }
    });

    it('processes valid response', function(done) {
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
                    expect(data.body).to.deep.equal({
                        PRODUCTID: 100
                    });
                }
            }
        }
        var requestStub = sinon.stub(request, 'get')
            .callsArgWith(1, undefined, {statusCode: 200}, {});

        action.process.call(componentStub, this.msg, this.config);
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
                    expect(data.message).to.equal('Unexpected API response: "Unauthorized"');
                }
                if (event === 'data') {
                    error = new Error('Event `data` should not be called');
                }
            }
        }
        var requestStub = sinon.stub(request, 'get').callsArgWith(1, undefined, {statusCode: 401}, 'Unauthorized');

        action.process.call(componentStub, this.msg, this.config);
    });

});

