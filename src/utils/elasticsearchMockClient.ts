import {checkConnection, index, resetIndex, type} from "./elasticsearch";

const { Client } = require('@elastic/elasticsearch');
const Mock = require('@elastic/elasticsearch-mock');
const { errors } = require('@elastic/elasticsearch');

const mock = new Mock();
const client = new Client({
    node: 'http://localhost:9200',
    Connection: mock.getConnection()
});

client.info(console.log);

client.ping(console.log);

client.search({
    index: 'scala',
    body: {
        query: { match_all: {} }
    }
}, console.log);

client.search({
    index: 'scala',
    body: {
        query: {
            match: { foo: 'bar' }
        }
    }
}, console.log);

mock.add({
    method: 'POST',
    path: '/indexName/_search'
}, () => {
    return {
        hits: {
            total: { value: 1, relation: 'eq' },
            hits: [{ _source: { baz: 'faz' } }]
        }
    }
});

mock.add({
    method: 'POST',
    path: '/indexName/_search',
    body: { query: { match: { foo: 'bar' } } }
}, () => {
    return {
        hits: {
            total: { value: 0, relation: 'eq' },
            hits: []
        }
    }
});

mock.add({
    method: 'GET',
    path: '/'
}, () => {
    return new errors.ResponseError({
        body: { errors: {}, status: 500 },
        statusCode: 500
    })
});

mock.add({
    method: 'GET',
    path: '/'
}, () => {
    return { status: 'ok' }
});

module.exports = {
    client
};