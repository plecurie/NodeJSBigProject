import * as elasticsearch from '@elastic/elasticsearch'
import {ES_URL} from "./constants";

export const index = 'scala';
export const type = 'database';

export const client = new elasticsearch.Client({
    node: [ES_URL],
    headers: {'Content-Type': 'application/json'},
    maxRetries: 5,
    requestTimeout: 30000,
    sniffOnStart: true
});

export async function checkConnection() {
    let es_started = false;

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    while (!es_started) {
        try {
            await client.cluster.health({});
            es_started = true;
            console.log(">>>> Elasticsearch started on ", ES_URL);
            await resetIndex()
        } catch (err) {
            console.log(">>>> Connection to Elasticsearch failed, retrying... ");
            await delay(10000);
        }
    }

}

export async function resetIndex() {
    try {
        client.indices.exists({index}, async (err, response) => {
            if (err)
                console.log("ERROR", err);
            if (response.body) {
                await client.indices.delete({index});
            }
            await client.indices.create({index});

            await putMapping();
        });
    } catch (err) {
        throw err
    }

}

async function putMapping() {

    const schema = {
        birthdate: {
            type: "date",
            format: "yyyy-MM-dd",
            cql_collection: "singleton"
        },
        category: {
            type: "keyword",
            cql_collection: "singleton"
        },
        contract_name: {
            type: "keyword",
            cql_collection: "singleton"
        },
        criteria: {
            type: "nested",
            cql_collection: "list",
            cql_udt_name: "database_criteria",
            properties: {
                name: {
                    type: "keyword",
                    cql_collection: "singleton"
                },
                value: {
                    type: "long",
                    cql_collection: "singleton"
                },
                familyName: {
                    type: "keyword",
                    cql_collection: "singleton"
                }
            }
        },
        criteriaCategorieAverage: {
            type: "long",
            cql_collection: "singleton"
        },
        email: {
            type: "keyword",
            cql_collection: "singleton"
        },
        /*employsExclusion: {
            type: "nested",
            cql_collection: "list",
            cql_udt_name: "database_exclusions",
            properties: {
                exclusion: {
                    type: "keyword",
                    cql_collection: "singleton"
                }
            }
        },*/
        euro_fees: {
            type: "float",
            cql_collection: "singleton"
        },
        firm_name: {
            type: "keyword",
            cql_collection: "singleton"
        },
        firstname: {
            type: "keyword",
            cql_collection: "singleton"
        },
        id_user: {
            type: "keyword",
            cql_collection: "singleton"
        },
        isincode: {
            type: "keyword",
            cql_collection: "singleton"
        },
        lastname: {
            type: "keyword",
            cql_collection: "singleton"
        },
        ongoingcharge: {
            type: "float",
            cql_collection: "singleton"
        },
        password: {
            type: "keyword",
            cql_collection: "singleton"
        },
        products: {
            type: "nested",
            cql_collection: "list",
            cql_udt_name: "database_products",
            properties: {
                isincode: {
                    type: "keyword",
                    cql_collection: "singleton"
                }
            }
        },
        product_name: {
            type: "keyword",
            cql_collection: "singleton"
        },
        /*thematics: {
            type: "nested",
            cql_collection: "list",
            cql_udt_name: "database_thematics",
            properties: {
                thematic: {
                    type: "keyword",
                    cql_collection: "singleton"
                }
            }
        },*/
        type: {
            type: "keyword",
            cql_collection: "singleton"
        },
        suggest: {
            type: "completion"
        },
        uc_fees: {
            type: "float",
            cql_collection: "singleton"
        },
        username: {
            type: "keyword",
            cql_collection: "singleton"
        }
    };

    try {
        await client.indices.putMapping({index, type, body: {properties: schema}});
    } catch (err) {
        console.log(err.meta.body.error)
    }

}

module.exports = {
    client, index, type, checkConnection, resetIndex
};
