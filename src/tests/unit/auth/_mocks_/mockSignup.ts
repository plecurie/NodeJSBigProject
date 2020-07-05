import { authController } from "../../../../controllers";
import { USER_EMAIL } from "../../../integration/auth/auth.spec";

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
