export function mockFetch(data: object) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data,
      text: () => Promise.resolve(JSON.stringify(data)),
    })
  );
}
