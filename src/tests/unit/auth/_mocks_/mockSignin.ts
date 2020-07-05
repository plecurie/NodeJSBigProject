import {authController} from "../../../../controllers";
// @ts-ignore
import {ACCESS_TOKEN, USER_EMAIL, USER_PASSWORD} from '../../../integration/auth/auth.spec'

export const mockSignin = jest.fn(
    async (req): Promise<any> => {
        if (req.body.email === USER_EMAIL && req.body.password === USER_PASSWORD)
            return {
                status: 200,
                connect: true,
                token: ACCESS_TOKEN
            };
        else
            return {status: 403}
    }
);


authController.signin = mockSignin;

/*
const mock = jest.fn().mockImplementation(() => {
    return { signin: mockSignin };
});

export default mock;
*/
