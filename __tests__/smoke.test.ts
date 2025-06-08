describe('Smoke Test', () => {
  test('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have global mocks available', () => {
    expect(global.fetch).toBeDefined();
    expect(typeof global.fetch).toBe('function');
  });

  test('should be able to mock fetch responses', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ test: 'data' }),
      })
    ) as jest.MockedFunction<typeof fetch>;

    expect(global.fetch).toBeDefined();
    expect(typeof global.fetch).toBe('function');
  });

  test('should have console mocked', () => {
    console.log('This should be mocked');
    expect(console.log).toBeDefined();
  });
});
