# Test Suite Documentation

This directory contains comprehensive tests for the core functionality of the Watchlist application.

## Overview

The test suite covers:
- **Store Management** (Valtio store operations)
- **API Hooks** (TMDB API integration)
- **Utility Hooks** (Debouncing, keyboard handling, etc.)
- **Business Logic** (New episode detection, refresh functionality)

## Test Structure

```
__tests__/
├── setup.ts                 # Jest configuration and mocks
├── utils/
│   └── test-utils.tsx       # Shared test utilities and mock data
├── store/
│   └── valitio.store.test.ts # Store functionality tests
├── hooks/
│   ├── useSearch.test.ts     # Search hook tests
│   ├── useMovieDetail.test.ts # Movie details hook tests
│   └── useDebounce.test.ts   # Debounce utility tests
├── lib/
│   └── refresh.test.ts       # New episode detection tests
└── components/
    └── (component tests can be added here)
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Specific Test File
```bash
npm test -- useSearch.test.ts
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="should handle API errors"
```

## Test Categories

### 1. Store Tests (`store/valitio.store.test.ts`)

Tests the core state management functionality:

- **Subscribed Shows Management**
  - Adding/removing shows from subscriptions
  - Preventing duplicate subscriptions
  - Subscription status checking

- **Watch List Operations**
  - Adding movies/shows to watch list
  - Removing items from watch list
  - Checking watch list status

- **Watched Episodes Tracking**
  - Marking episodes as watched
  - Retrieving watch history
  - Episode progress tracking

- **New Episodes Handling**
  - Adding new episode notifications
  - Preventing duplicate notifications
  - Episode watched workflow

- **Settings Management**
  - Updating user preferences
  - Notification settings

### 2. API Hook Tests

#### Search Hook (`hooks/useSearch.test.ts`)
- Query execution and caching
- Error handling (network, API, validation)
- Parameter handling (type, pagination, adult content)
- Empty query handling
- Response validation

#### Movie Detail Hook (`hooks/useMovieDetail.test.ts`)
- Movie detail fetching
- Parameter validation (ID, language, append_to_response)
- Error scenarios
- Caching behavior
- URL building

### 3. Utility Hook Tests

#### Debounce Hook (`hooks/useDebounce.test.ts`)
- Value debouncing with various delays
- Timer management and cleanup
- Rapid value changes handling
- Different data types support
- Performance optimization

### 4. Business Logic Tests

#### Refresh Functionality (`lib/refresh.test.ts`)
- New episode detection algorithm
- TMDB API integration
- Baseline establishment for new subscriptions
- Concurrent processing of multiple shows
- Error handling and recovery
- Edge cases (missing data, network failures)

## Mock Data

The test suite includes comprehensive mock data in `utils/test-utils.tsx`:

- `mockTVShow` - Complete TV show details response
- `mockMovie` - Complete movie details response
- `mockNewEpisode` - New episode notification structure
- `mockWatchedEpisode` - Watched episode record
- `mockSearchResponse` - Search API response

## Test Utilities

### Custom Render Function
```typescript
import { render } from '../utils/test-utils';

// Automatically wraps components with QueryClientProvider
render(<YourComponent />);
```

### Mock Fetch Helper
```typescript
import { createMockFetch } from '../utils/test-utils';

global.fetch = createMockFetch(responseData, { ok: true, status: 200 });
```

### Date Mocking
```typescript
import { createMockDate, restoreDate } from '../utils/test-utils';

createMockDate('2024-01-15T12:00:00.000Z');
// ... test code ...
restoreDate();
```

## Mocked Dependencies

The test environment includes mocks for:

- **Expo Modules**: `expo-notifications`, `expo-haptics`, `expo-constants`
- **React Native**: `BackHandler`, `Keyboard`, `AppState`, `Dimensions`
- **React Navigation**: Navigation hooks and router
- **AsyncStorage**: Local storage operations
- **Reanimated**: Animation library
- **External Libraries**: `sonner-native` for notifications

## Coverage Goals

The test suite aims for:
- **Functions**: 90%+ coverage
- **Statements**: 85%+ coverage
- **Branches**: 80%+ coverage
- **Lines**: 85%+ coverage

### Coverage Reports

Coverage reports focus on:
- Core business logic (`lib/**`)
- Custom hooks (`hooks/**`)
- Store operations (`valitio.store.ts`)

## Best Practices

### Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the scenario
- Follow the pattern: "should [expected behavior] when [condition]"

### Mock Management
- Reset mocks between tests using `beforeEach`
- Use specific mocks for each test case
- Clean up global mocks in `afterEach`

### Async Testing
- Use `waitFor` for async operations
- Avoid fixed timeouts, prefer `waitFor` with conditions
- Test loading states and error states

### Error Testing
- Test both network errors and API errors
- Verify error messages and error states
- Test error recovery scenarios

## Continuous Integration

Tests are designed to run in CI environments:
- No external dependencies required
- Deterministic timing using fake timers
- Comprehensive error handling
- Fast execution (< 30 seconds for full suite)

## Adding New Tests

When adding new functionality:

1. **Create test file** following naming convention: `*.test.ts`
2. **Add to appropriate directory** (`hooks/`, `lib/`, `store/`, etc.)
3. **Include edge cases** and error scenarios
4. **Update mock data** if needed
5. **Verify coverage** doesn't decrease

### Test Template
```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
// ... other imports

describe('YourFeature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset any global state
  });

  describe('Basic Functionality', () => {
    test('should work correctly in normal case', async () => {
      // Arrange
      // Act
      // Assert
    });
  });

  describe('Error Handling', () => {
    test('should handle errors gracefully', async () => {
      // Test error scenarios
    });
  });

  describe('Edge Cases', () => {
    test('should handle edge cases', async () => {
      // Test boundary conditions
    });
  });
});
```

## Debugging Tests

### Running Single Test
```bash
npm test -- --testNamePattern="specific test name"
```

### Verbose Output
```bash
npm test -- --verbose
```

### Debug Mode
```bash
npm test -- --runInBand --no-cache
```

### Console Logging
Tests suppress console output by default. To see logs:
```typescript
// Temporarily restore console in specific tests
const originalConsole = global.console;
global.console = console;
// ... test code ...
global.console = originalConsole;
```

## Performance Considerations

- Tests use fake timers to avoid real delays
- Fetch mocks prevent actual network requests
- Query client has reduced garbage collection time
- Parallel test execution is supported

## Future Improvements

Potential areas for expansion:
- Component integration tests
- E2E testing scenarios
- Performance benchmarking
- Visual regression testing
- Accessibility testing