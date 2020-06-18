import {Product} from "./Product";

export interface Portfolio {
    id_user: String;
    name: String;
    products: Product[];
}