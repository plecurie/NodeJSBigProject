export const mockCheckToken = jest.fn(
    async (req, res) => {

    });
const mock = jest.fn().mockImplementation(() => {
    return {signin: mockCheckToken};
});

export default mock;