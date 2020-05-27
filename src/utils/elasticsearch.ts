import * as elasticsearch from '@elastic/elasticsearch'
import { ES_URL} from "./constants";

export const ELASTIC_CLIENT = new elasticsearch.Client({
    node: [ES_URL],
    headers: { 'Content-Type': 'application/json'},
    maxRetries: 5,
    requestTimeout: 30000,
    sniffOnStart:true
});
