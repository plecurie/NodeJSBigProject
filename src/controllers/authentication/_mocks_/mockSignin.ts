import { User } from "../../../models/User";
import { GeneratorService } from "../../../services";
const generatorService = GeneratorService.getInstance();

export const USER_EMAIL = 'random@test.com';
export const USER_PASSWORD = 'abc123';
export const USER_PASSWORD_HASH = String(generatorService.hashPassword(USER_PASSWORD));
export const USER_FIRSTNAME = 'random';
export const USER_LASTNAME = 'random';
export const USER_USERNAME = 'random';
export const USER_BIRTHDATE = new Date('01/01/1970');
export const ACCESS_TOKEN = 'xyz';

export const mockSignin = jest.fn(
    async (email: string, password: string): Promise<User> => {
        if (email === USER_EMAIL && password === USER_PASSWORD)
            return {
                firstname: USER_FIRSTNAME,
                lastname: USER_LASTNAME,
                birthdate: USER_BIRTHDATE,
                email: USER_EMAIL,
                password: USER_PASSWORD_HASH,
                username: USER_USERNAME
            } as User;
        return null;
    }
);
const mock = jest.fn().mockImplementation(() => {
    return { signin: mockSignin };
});

export default mock;