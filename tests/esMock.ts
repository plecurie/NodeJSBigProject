const { Client } = require('@elastic/elasticsearch');
const Mock = require('@elastic/elasticsearch-mock');
const mock = new Mock();

export const client = new Client({
    node: 'http://localhost:9200',
    Connection: mock.getConnection()
});

client.info(console.log);

mock.add({
    method: 'GET',
    path: ['/']
}, () => {
    return { status: 200 }
});

/* INDEX */
mock.add({
    method: 'POST',
    path: ['/scala/database/']
}, () => {
    return { status: 201 }
});

/* GET */
mock.add({
    method: 'GET',
    path: ['/scala/database/:id']
}, () => {
    return { status: 200 }
});

/* UPDATE */
mock.add({
    method: 'POST',
    path: ['/scala/database/:id']
}, () => {
    return { status: 204 }
});

/* DELETE */
mock.add({
    method: 'DELETE',
    path: ['/scala/database/:id']
}, () => {
    return { status: 200 }
});

/* BULK */
mock.add({
    method: 'POST',
    path: ['/scala/_bulk']
}, () => {
    return { status: 201 }
});

/* DELETE BY QUERY */
mock.add({
    method: 'POST',
    path: ['/scala/_delete_by_query']
}, () => {
    return { status: 200 }
});

/* UPDATE BY QUERY */
mock.add({
    method: 'POST',
    path: ['/scala/_update_by_query']
}, () => {
    return { status: 204 }
});

