export class Product {

    id: Number;
    code: String;
    name: String;
    fees: Number;

    constructor(code: String, name: String, fees: Number) {
        this.code = code;
        this.name = name;
        this.fees = fees
    }
}