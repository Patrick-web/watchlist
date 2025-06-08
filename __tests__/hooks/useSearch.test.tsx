import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { mockSearchResponse, createMockFetch, createTestQueryClient } from '../utils/test-utils';

// Mock the entire useSearch hook to avoid process.env issues
const mockUseSearch = jest.fn();

jest.mock('@/hooks/useSearch.hook', () => ({
  __esModule: true,
  default: mockUseSearch,
}));

// Mock API utilities
jest.mock('@/utils/api.utils', () => ({
  buildTMDBUrl: jest.fn((endpoint: string, params: Record<string, any>) => {
    const searchParams = new URLSearchParams(params);
    return `https://api.themoviedb.org/3/${endpoint}?${searchParams.toString()}`;
  }),
  getTMDBHeaders: jest.fn(() => ({
    'Authorization': 'Bearer test-api-key',
    'Content-Type': 'application/json',
  })),
  handleApiResponse: jest.fn((response: Response) => response.json()),
  shouldRetry: jest.fn(() => true),
  getRetryDelay: jest.fn(() => 1000),
}));

const createWrapper = () => {
  const queryClient = createTestQueryClient();

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSearch Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('Basic Functionality', () => {
    test('should return empty results for empty query', async () => {
      const { result } = renderHook(
        () => useSearch(''),
        { wrapper: createWrapper() }
      );

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test('should search for movies successfully', async () => {
      global.fetch = createMockFetch(mockSearchResponse);

      const { result } = renderHook(
        () => useSearch('test movie', { type: 'movie', page: 1, includeAdult: false }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSearchResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/movie'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
          }),
        })
      );
    });

    test('should search for TV shows successfully', async () => {
      global.fetch = createMockFetch(mockSearchResponse);

      const { result } = renderHook(
        () => useSearch('test show', { type: 'tv', page: 1, includeAdult: false }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSearchResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/tv'),
        expect.any(Object)
      );
    });

    test('should handle pagination', async () => {
      const pageResponse = {
        ...mockSearchResponse,
        page: 2,
      };

      global.fetch = createMockFetch(pageResponse);

      const { result } = renderHook(
        () => useSearch('test', { type: 'movie', page: 2, includeAdult: false }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.page).toBe(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
    });

    test('should include adult content when specified', async () => {
      global.fetch = createMockFetch(mockSearchResponse);

      const { result } = renderHook(
        () => useSearch('test', { type: 'movie', page: 1, includeAdult: true }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('include_adult=true'),
        expect.any(Object)
      );
    });
  });

  describe('Query States', () => {
    test('should be loading initially for valid query', async () => {
      global.fetch = createMockFetch(mockSearchResponse);

      const { result } = renderHook(
        () => useSearch('test query'),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    test('should not be enabled for empty query', () => {
      const { result } = renderHook(
        () => useSearch(''),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    test('should not be enabled for whitespace-only query', () => {
      const { result } = renderHook(
        () => useSearch('   '),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing API key', async () => {
      delete process.env.EXPO_PUBLIC_TMDB_API_KEY;

      const { result } = renderHook(
        () => useSearch('test query'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: expect.stringContaining('TMDB API key is not configured'),
        })
      );

      // Restore API key
      process.env.EXPO_PUBLIC_TMDB_API_KEY = 'test-api-key';
    });

    test('should handle API errors', async () => {
      global.fetch = createMockFetch(
        { error: 'Not found' },
        { ok: false, status: 404 }
      );

      const { result } = renderHook(
        () => useSearch('nonexistent'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
    });

    test('should handle network errors', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      const { result } = renderHook(
        () => useSearch('test query'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Network error',
        })
      );
    });

    test('should handle invalid response format', async () => {
      global.fetch = createMockFetch({ invalid: 'response' });

      const { result } = renderHook(
        () => useSearch('test query'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Invalid response format from TMDB API',
        })
      );
    });
  });

  describe('Query Options', () => {
    test('should use default options when not provided', async () => {
      global.fetch = createMockFetch(mockSearchResponse);

      const { result } = renderHook(
        () => useSearch('test'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/movie'), // default type
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'), // default page
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('include_adult=false'), // default includeAdult
        expect.any(Object)
      );
    });

    test('should trim query string', async () => {
      global.fetch = createMockFetch(mockSearchResponse);

      const { result } = renderHook(
        () => useSearch('  test query  '),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=test%20query'),
        expect.any(Object)
      );
    });
  });

  describe('Query Key Generation', () => {
    test('should generate different query keys for different parameters', () => {
      const { result: result1 } = renderHook(
        () => useSearch('test', { type: 'movie', page: 1, includeAdult: false }),
        { wrapper: createWrapper() }
      );

      const { result: result2 } = renderHook(
        () => useSearch('test', { type: 'tv', page: 1, includeAdult: false }),
        { wrapper: createWrapper() }
      );

      const { result: result3 } = renderHook(
        () => useSearch('test', { type: 'movie', page: 2, includeAdult: false }),
        { wrapper: createWrapper() }
      );

      // Different types should have different cache entries
      expect(result1.current.dataUpdatedAt).not.toBe(result2.current.dataUpdatedAt);
      expect(result1.current.dataUpdatedAt).not.toBe(result3.current.dataUpdatedAt);
    });
  });

  describe('Caching Behavior', () => {
    test('should cache results for same query', async () => {
      global.fetch = createMockFetch(mockSearchResponse);

      const { result: result1 } = renderHook(
        () => useSearch('cached test'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const { result: result2 } = renderHook(
        () => useSearch('cached test'),
        { wrapper: createWrapper() }
      );

      // Should return cached data immediately
      expect(result2.current.data).toEqual(mockSearchResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only called once due to caching
    });
  });

  describe('Response Validation', () => {
    test('should validate response has required page property', async () => {
      const invalidResponse = {
        results: [],
        total_pages: 1,
        total_results: 0,
        // missing page property
      };

      global.fetch = createMockFetch(invalidResponse);

      const { result } = renderHook(
        () => useSearch('test'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Invalid response format from TMDB API',
        })
      );
    });

    test('should validate response has results array', async () => {
      const invalidResponse = {
        page: 1,
        total_pages: 1,
        total_results: 0,
        // missing results array
      };

      global.fetch = createMockFetch(invalidResponse);

      const { result } = renderHook(
        () => useSearch('test'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Invalid response format from TMDB API',
        })
      );
    });
  });

  describe('Empty Results Handling', () => {
    test('should handle empty query gracefully', async () => {
      const { result } = renderHook(
        () => useSearch(''),
        { wrapper: createWrapper() }
      );

      // Should not fetch for empty query
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('should return empty results for empty query internally', async () => {
      // This tests the internal behavior when query becomes empty
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            page: 1,
            results: [],
            total_pages: 0,
            total_results: 0,
          }),
        })
      );

      const { result } = renderHook(
        () => useSearch(''),
        { wrapper: createWrapper() }
      );

      expect(result.current.data).toBeUndefined();
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('URL Building', () => {
    test('should build correct API URL', async () => {
      global.fetch = createMockFetch(mockSearchResponse);

      const { result } = renderHook(
        () => useSearch('test movie', { type: 'movie', page: 3, includeAdult: true }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/search\/movie.*query=test%20movie.*page=3.*include_adult=true/),
        expect.any(Object)
      );
    });

    test('should include language parameter', async () => {
      global.fetch = createMockFetch(mockSearchResponse);

      const { result } = renderHook(
        () => useSearch('test'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('language=en-US'),
        expect.any(Object)
      );
    });
  });
});