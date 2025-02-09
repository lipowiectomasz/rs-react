export const mockFetch = (response: any, isError: boolean = false) => {
  global.fetch = jest.fn(() =>
    isError
      ? Promise.reject(new Error('Network error'))
      : Promise.resolve({
          ok: true,
          json: async () => response,
        })
  ) as jest.Mock;
};
