export class Product {

    isin_code: String;
    name: String;
    category: String;
    criteria: Map<String, String>;

    constructor(isin_code: String, name: String, category: String, criteria: Map<String, String>) {
        this.isin_code = isin_code;
        this.name = name;
        this.category = category;
        this.criteria = criteria;
    }
}