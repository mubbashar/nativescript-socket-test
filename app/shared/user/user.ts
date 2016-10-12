var validator = require("email-validator");

export class User {
    email:string;
    password:string;
    name: string;
    pictureUrl: string;
    coverUrl: string;
    isValidEmail() {
        return validator.validate(this.email);
    }
}