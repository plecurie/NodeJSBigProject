export class User {

    id: Number;
    firstname: String;
    lastname: String;
    birthdate: Date;
    email: String;
    password: String;
    username: String;

    constructor(firstname: String, lastname: String, birthdate: Date, email: String, password: String, username: String) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.birthdate = birthdate;
        this.email = email;
        this.password = password;
        this.username = username;
    }
}