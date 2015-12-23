var serialize = require('xml');

var API_ENDPOINT = 'https://crm.zoho.com/crm/private/json/:module/:method'

module.exports = {

    getProducts: function(authToken, criteria) {
        return {
            url: API_ENDPOINT
                .replace(':module', 'Products')
                .replace(':method', 'searchRecords'),
            qs: {
                authtoken: authToken,
                scope: 'crmapi',
                criteria: criteria
            },
            json: true
        }
    },

    updatePrice: function(authToken, priceBookID, productID, price) {
        var data = { Products: [
            { row: [
                {
                    _attr: { no: 1 }
                },
                { FL: [
                    {
                        _attr: { val: 'PRODUCTID' }
                    },
                    productID
                ] },
                { FL: [
                    {
                        _attr: { val: 'list_price' }
                    },
                    price
                ] }
            ] }
        ] };

        return {
            url: API_ENDPOINT
                .replace(':module', 'PriceBooks')
                .replace(':method', 'updateRelatedRecords'),
            qs: {
                authtoken: authToken,
                scope: 'crmapi',
                relatedModule: 'Products',
                id: priceBookID,
                xmlData: serialize(data)
            },
            json: true
        }
    }

}
