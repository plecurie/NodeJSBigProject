import {Product} from "./Product";

export interface Portfolio {
    id_user: string;
    name: string;
    products: Product[];
}