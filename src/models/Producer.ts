import {Product} from "./Product";

export class Producer {

    id: Number;
    name: String;
    products: [Product];

    constructor(name: String, products: [Product]) {
        this.name = name;
        this.products = products
    }
}