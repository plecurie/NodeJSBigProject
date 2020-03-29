import {Product} from "./Product";

export class User {

    id: Number;
    firstname: String;
    lastname: String;
    email: String;
    password: String;
    portfolio: [Product];

    constructor(firstname: String, lastname: String, email: String, password: String) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}