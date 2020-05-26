import * as elasticsearch from '@elastic/elasticsearch'
import {ES_PORT, HOST} from "./constants";

export const ELASTIC_CLIENT = new elasticsearch.Client({
    node: [HOST + ":" + ES_PORT],
    headers: { 'Content-Type': 'application/json'},
    maxRetries: 5,
    requestTimeout: 30000,
    sniffOnStart:true
});