import {Product} from "./Product";

export class User {

    id: Number;
    firstname: String;
    lastname: String;
    email: String;
    portfolio: [Product];

    constructor(firstname: String, lastname: String, email: String) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email
    }
}