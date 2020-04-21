
export class Profile {

    username: String;
    criteria: Map<String, String>;

    constructor(username: String, criteria: Map<String, String>) {
        this.username = username;
        this.criteria = criteria
    }
}