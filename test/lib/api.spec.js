var expect = require('chai').expect;

var api = require('../../lib/api');

describe('Component API', function() {

    context('updatePrice', function() {

        it('creates valid XML data to send', function() {
            var requestOptions = api.updatePrice('securetocken', 1000, 2000, 200);

            expect(requestOptions.qs.xmlData).to.equal('<Products><row no="1"><FL val="PRODUCTID">2000</FL><FL val="list_price">200</FL></row></Products>');
        });

    });

});
