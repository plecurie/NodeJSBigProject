import * as elasticsearch from '@elastic/elasticsearch'
import { ES_URL } from "./constants";

export const index = 'scala';
export const type = 'database';

export const client = new elasticsearch.Client({
    node: [ES_URL],
    headers: { 'Content-Type': 'application/json'},
    maxRetries: 5,
    requestTimeout: 30000,
    sniffOnStart:true
});

async function checkConnection() {
    let connected = false;
    while(!connected) {
        console.log(">>>> Waiting for Elasticsearch to Start...");
        try {
            await client.cluster.health( {});
            connected = true;
            console.log(">>>> Elasticsearch started on ", ES_URL);
        } catch(err) {
            console.log(">>>> Connection failed, Retrying... ", err);
        }
    }
}
checkConnection();

async function resetIndex () {
    if (await client.indices.exists({ index }))
        await client.indices.delete({ index });
    await client.indices.create({ index });
    await putBookMapping()
}

async function putBookMapping () {
    const schema = { discover : '.*' };
    return client.indices.putMapping({ index, type, body: { properties: schema } })
}

module.exports = {
    client, index, type, checkConnection, resetIndex
};