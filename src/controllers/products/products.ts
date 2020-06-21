import { client, index, type } from "../../utils/elasticsearch";
import { bulkindexService } from "../../services/request/bulkindex.service";

export class ProductsController {

    async update_db(req, res): Promise<boolean> {

        try {
            return await client.deleteByQuery({
                index: index,
                body: {
                    query: { match: { type: "product"} }
                }
            }).then(async () => {
                if (await bulkindexService.getInstance().importExcel()) {
                    res.status(200).json({ updated: true });
                    return true;
                } else {
                    res.status(500).json({ updated: false });
                    return false
                }
            })
        } catch (err) {
            res.status(500).json({ updated: false });
            return false;
        }
    }

    async findOne(req, res): Promise<boolean> {

        try {
            return await client.search({
                index: index,
                type: type,
                body : {
                    query: {
                        bool: {
                            must: [
                                { match: { type: "product" } },
                                { match: { isincode: req.params.isincode } }
                            ]
                        }
                    }
                }
            }).then(data => {
                if (data.body.hits.hits.length != 0) {
                    res.status(200).json({ found: true, products: data.body.hits.hits[0]._source });
                    return data.body.hits.hits[0]._source;
                }
                else {
                    res.status(404).json({ found: false, reason: "not found" });
                    return
                }
            });
        } catch (err) {
              res.status(500).json(err);
              return
        }

    }

    async findAll(req, res): Promise<boolean> {

        try {
            return await client.search({
                index: index,
                type: type,
                body: {
                    query: {
                        match: { type: "product" }
                    }
                }
            }).then(data => {
                if (data.body.hits.hits.length != 0) {
                    res.status(200).json({ found: true, products: data.body.hits.hits[0]._source });
                    return data.body.hits.hits[0]._source;
                }
                else {
                    res.status(404).json({ found: false, reason: "not found" });
                    return ;
                }
            });
        } catch (err) {
            res.status(500).json(err);
            return ;
        }

    }

    async search(req, res): Promise<boolean> {

        try {
            return await client.search({
                index: index,
                type: type,
                body : {
                    query: {
                        bool: {
                            must: [
                                { match: { type: "product" } },
                                req.body.matches
                            ]
                        }
                    }
                }
            }).then(data => {
                if (data.body.hits.hits.length != 0) {
                    res.status(200).json({ found: true, products: data.body.hits.hits[0]._source });
                    return data.body.hits.hits[0]._source;
                }
                else {
                    res.status(404).json({ found: false, reason: "not found" });
                    return ;
                }
            });
        } catch (err) {
            res.status(500).json(err);
            return ;
        }

    }

}