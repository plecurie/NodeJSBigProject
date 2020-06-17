export class Product {

    isin_code: String;
    name: String;
    category: String;
    firmname: String;
    criteria: {};

    constructor(isin_code: String, name: String, category: String, firmname: String, criteria: Map<String, String>) {
        this.isin_code = isin_code;
        this.name = name;
        this.category = category;
        this.firmname = firmname;
        this.criteria = this.mapToObj(criteria)
    }

    mapToObj = m => {
        return Array.from(m).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    };
}