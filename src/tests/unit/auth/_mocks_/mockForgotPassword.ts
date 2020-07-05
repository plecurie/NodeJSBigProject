export const mockForgotPassword = jest.fn(
    async (req, res) => {

    });
const mock = jest.fn().mockImplementation(() => {
    return {signin: mockForgotPassword};
});

export default mock;