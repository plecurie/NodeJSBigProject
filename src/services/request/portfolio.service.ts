import {client, index, type} from "../../utils/elasticsearch";

export class PortfolioService {
    private static instance: PortfolioService;

    constructor() {
    }

    public static getInstance(): PortfolioService {
        if (!PortfolioService.instance) {
            PortfolioService.instance = new PortfolioService();
        }
        return PortfolioService.instance;
    }

    public async create(id) {
        return client.index({
            index: index,
            type: type,
            body: {
                id_user: id,
                type: "portfolio",
                products: []
            }
        })
    }

    public async delete(id) {
        return client.deleteByQuery({
            index: index,
            type: type,
            body: {
                query: {
                    bool: {
                        must: [
                            {match: {type: "portfolio"}},
                            {match: {id_user: id}},
                        ]
                    }
                }
            }
        })
    }

    public async update(id_portfolio, products) {
        return client.update({
            index: index,
            type: type,
            id: id_portfolio,
            body: {
                doc: {
                    products: products
                }
            }
        })
    }

    public async handleProducts(products) {
        if (!products) return [];
        if(Array.isArray(products)) return products.map(({isincode}) => isincode);
        if (products.isincode) return [products.isincode];
        return [];
    };

    public async getProducts(userId) {
        return client.search({
            index: index,
            body: {
                query: {
                    bool: {
                        must: [
                            {match: {id_user: userId}},
                            {match: {type: "portfolio"}}
                        ]
                    }
                }
            }
        }).then(({body}) => this.handleProducts(body.hits.hits[0]._source.products));
    }

}
