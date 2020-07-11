import {client, index, type} from "../utils/elasticsearch";

export class Product {

    static async findProducts(isinCodes: Array<string>) {
        const codesToMatches = isinCodes.map(isincode => ({ match: { isincode }}));
        const productsCodesToMatches = isinCodes.map(isincode => ({ match: { "products.isincode": isincode }}));
        const {body : { hits : { hits} }} = await client.search({
            index: index,
            type: type,
            body: {
                query: {
                    bool: {
                        should: [
                            ...codesToMatches,
                            {
                                nested: {
                                    path: "products",
                                    query: {
                                        bool: {
                                            should: productsCodesToMatches
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        });
        if(hits.length === 0) throw  "No products found";
        const [contracts, product] = hits.reduce(([contracts, product], hit) => {
            const { contract_name: name, euro_fees, uc_fees, type, products } = hit._source;
            if(type == 'contract') contracts.push({ name, euro_fees, uc_fees, products });
            else if (type == 'product') product.push(hit);
            return [contracts, product];
        }, [[],[]]);
        if (product.length === 0) throw "No products returned";
        product.forEach(produit => {
            const isinCode = produit._source.isincode;
            produit._source.contracts = contracts.filter(({products}) =>
                products.some(({isincode}) => isincode == isinCode)
            );
        });
        return product;
    }
}

export interface Product {
    isincode: string;
}
