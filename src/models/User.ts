import {Product} from "./Product";

export class User {

    id: Number;
    firstname: String;
    lastname: String;
    birthday: String
    email: String;
    password: String;
    portfolio: [Product];

    constructor(firstname: String, lastname: String, birthday: String, email: String, password: String) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.birthday = birthday;
        this.email = email;
        this.password = password;
    }
}