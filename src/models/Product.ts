import { Categorie } from "./Categorie";

export class Product {

    isin_code: String;
    name: String;
    category: String;
    criteria: {};

    constructor(isin_code: String, name: String, category: String, criteria: Map<String, String>) {
        this.isin_code = isin_code;
        this.name = name;
        this.category = category;
        this.criteria = this.mapToObj(criteria)
    }

    mapToObj = m => {
        return Array.from(m).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    };
}

export class ProductView {

    id_product: number;
    name: string;
    isin_code: string;
    ongoing_charge: string;
    categories: Array<Categorie>
}