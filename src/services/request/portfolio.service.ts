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


}