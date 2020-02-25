import * as elasticsearch from '@elastic/elasticsearch'
import {ES_PORT, HOST} from "./utils/constants";

export const ELASTIC_CLIENT = new elasticsearch.Client({
    node: [HOST + ":" + ES_PORT],
    maxRetries: 5,
    requestTimeout: 30000,
    sniffOnStart:true
});