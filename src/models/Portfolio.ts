import {Product} from "./Product";

export class Portfolio {

    username: String;
    products: Product[];

    constructor(username: String, products: Product[]) {
        this.username = username;
        this.products = products
    }
}