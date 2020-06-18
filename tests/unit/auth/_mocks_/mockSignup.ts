import { authController } from "../../../../src/controllers";
import { USER_EMAIL } from "../../../e2e/auth/auth.spec";

export const mockSignup = jest.fn(
    async (req): Promise<any> => {
        if (req.body.email === USER_EMAIL) {
            return {
                status: 409,
                connect: false,
            };
        }
        else
            return {
                status: 201
            };
    });


authController.signup = mockSignup;
/*
const mock = jest.fn().mockImplementation(() => {
    return { signup: mockSignup };
});


export default mock;
*/
