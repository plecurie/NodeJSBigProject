export class UserService {
    private emailRegex = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;
    private static instance: UserService;

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public userValidatorSignUp(data) {
        if (!data) return null;
        const regex = new RegExp(this.emailRegex);
        const emailValidator = regex.test(data.email);
        const passWordValidator = data.password == data.confirmPassword;
        return emailValidator && passWordValidator ? data : null;
    }

    public userValidatorForgotPassword(data) {
        if (!data) return null;
        const regex = new RegExp(this.emailRegex);
        const emailValidator = regex.test(data.email);
        return emailValidator ? data : null;
    }
}