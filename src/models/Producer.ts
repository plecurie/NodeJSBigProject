import {Product} from "./Product";

export class Producer {

    name: String;
    products: Product[];

    constructor(name: String, products: Product[]) {
        this.name = name;
        this.products = products
    }
}