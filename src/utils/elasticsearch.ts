import * as elasticsearch from '@elastic/elasticsearch'

export const ELASTIC_CLIENT = new elasticsearch.Client({
    node: [process.env.ELASTICSEARCH_HOST],
    headers: { 'Content-Type': 'application/json'},
    maxRetries: 5,
    requestTimeout: 120000,
    sniffOnStart:true
});