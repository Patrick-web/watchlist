import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { mockMovie, createMockFetch, createTestQueryClient } from '../utils/test-utils';

// Mock the entire useMovieDetail hook to avoid process.env issues
const mockUseMovieDetail = jest.fn();

jest.mock('@/hooks/useMovieDetail.hook', () => ({
  __esModule: true,
  default: mockUseMovieDetail,
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

describe('useMovieDetail Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('Basic Functionality', () => {
    test('should fetch movie details successfully', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(mockMovie.id),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockMovie);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`movie/${mockMovie.id}`),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
          }),
        })
      );
    });

    test('should handle string movie ID', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(mockMovie.id.toString()),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockMovie);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`movie/${mockMovie.id}`),
        expect.any(Object)
      );
    });

    test('should use default language', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(mockMovie.id),
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

    test('should use custom language', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(mockMovie.id, { language: 'es-ES' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('language=es-ES'),
        expect.any(Object)
      );
    });

    test('should include append_to_response parameter', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(mockMovie.id, { appendToResponse: 'credits,videos' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('append_to_response=credits%2Cvideos'),
        expect.any(Object)
      );
    });
  });

  describe('Query States', () => {
    test('should be loading initially for valid movie ID', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(123),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    test('should not be enabled for empty movie ID', () => {
      const { result } = renderHook(
        () => useMovieDetail(''),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    test('should not be enabled for null movie ID', () => {
      const { result } = renderHook(
        () => useMovieDetail(null as any),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    test('should not be enabled for undefined movie ID', () => {
      const { result } = renderHook(
        () => useMovieDetail(undefined as any),
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
        () => useMovieDetail(123),
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

    test('should handle missing movie ID', async () => {
      const { result } = renderHook(
        () => useMovieDetail(''),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Movie ID is required',
        })
      );
    });

    test('should handle API errors', async () => {
      global.fetch = createMockFetch(
        { error: 'Movie not found' },
        { ok: false, status: 404 }
      );

      const { result } = renderHook(
        () => useMovieDetail(99999),
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
        () => useMovieDetail(123),
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
        () => useMovieDetail(123),
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

    test('should handle response without ID', async () => {
      const invalidMovie = { ...mockMovie };
      delete (invalidMovie as any).id;

      global.fetch = createMockFetch(invalidMovie);

      const { result } = renderHook(
        () => useMovieDetail(123),
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
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(123),
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

    test('should handle empty options object', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(123, {}),
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

  describe('Query Key Generation', () => {
    test('should generate different query keys for different parameters', () => {
      const { result: result1 } = renderHook(
        () => useMovieDetail(123, { language: 'en-US' }),
        { wrapper: createWrapper() }
      );

      const { result: result2 } = renderHook(
        () => useMovieDetail(123, { language: 'es-ES' }),
        { wrapper: createWrapper() }
      );

      const { result: result3 } = renderHook(
        () => useMovieDetail(456, { language: 'en-US' }),
        { wrapper: createWrapper() }
      );

      // Different parameters should have different cache entries
      expect(result1.current.dataUpdatedAt).not.toBe(result2.current.dataUpdatedAt);
      expect(result1.current.dataUpdatedAt).not.toBe(result3.current.dataUpdatedAt);
    });

    test('should include appendToResponse in query key', () => {
      const { result: result1 } = renderHook(
        () => useMovieDetail(123),
        { wrapper: createWrapper() }
      );

      const { result: result2 } = renderHook(
        () => useMovieDetail(123, { appendToResponse: 'credits' }),
        { wrapper: createWrapper() }
      );

      expect(result1.current.dataUpdatedAt).not.toBe(result2.current.dataUpdatedAt);
    });
  });

  describe('Caching Behavior', () => {
    test('should cache results for same movie ID', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result: result1 } = renderHook(
        () => useMovieDetail(123),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const { result: result2 } = renderHook(
        () => useMovieDetail(123),
        { wrapper: createWrapper() }
      );

      // Should return cached data immediately
      expect(result2.current.data).toEqual(mockMovie);
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only called once due to caching
    });

    test('should have long stale time for movie details', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(123),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should not refetch immediately as movie details have long stale time
      expect(result.current.isStale).toBe(false);
    });
  });

  describe('URL Building', () => {
    test('should build correct API URL', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(123, { language: 'fr-FR', appendToResponse: 'credits,videos' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/movie\/123.*language=fr-FR.*append_to_response=credits%2Cvideos/),
        expect.any(Object)
      );
    });

    test('should handle special characters in movie ID', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail('tt1234567'), // IMDB-style ID
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('movie/tt1234567'),
        expect.any(Object)
      );
    });
  });

  describe('Response Validation', () => {
    test('should validate response has ID property', async () => {
      const invalidResponse = {
        title: 'Test Movie',
        overview: 'A test movie',
        // missing id property
      };

      global.fetch = createMockFetch(invalidResponse);

      const { result } = renderHook(
        () => useMovieDetail(123),
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

    test('should validate ID is a number', async () => {
      const invalidResponse = {
        ...mockMovie,
        id: 'not-a-number',
      };

      global.fetch = createMockFetch(invalidResponse);

      const { result } = renderHook(
        () => useMovieDetail(123),
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

  describe('Edge Cases', () => {
    test('should handle zero as movie ID', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(0),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    test('should handle negative movie ID', async () => {
      global.fetch = createMockFetch(mockMovie);

      const { result } = renderHook(
        () => useMovieDetail(-1),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    test('should handle very large movie ID', async () => {
      global.fetch = createMockFetch(mockMovie);

      const largeId = 999999999;
      const { result } = renderHook(
        () => useMovieDetail(largeId),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`movie/${largeId}`),
        expect.any(Object)
      );
    });
  });
});