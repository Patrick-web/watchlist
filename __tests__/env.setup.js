// Set up basic test environment without process.env complexity

// Ensure fetch is available in the global scope
if (!global.fetch) {
  global.fetch = jest.fn();
}

