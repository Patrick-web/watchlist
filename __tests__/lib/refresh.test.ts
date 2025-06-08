import { mockTVShow, createMockFetch, createMockDate, restoreDate } from '../utils/test-utils';

// Mock the lib/refresh module to avoid process.env issues
const mockFindNewEpisodes = jest.fn();
jest.mock('@/lib/refresh', () => ({
  findNewEpisodes: mockFindNewEpisodes,
}));

// Mock the valitio store
const mockAddNewEpisode = jest.fn();
const mockPERSISTED_APP_STATE = {
  subscribedShows: [],
  newEpisodes: [],
  watchedEpisodes: [],
  watchList: { shows: [], movies: [] },
  history: { watchedMovies: [], watchedShows: [] },
  settings: {
    newEpisodeNotification: true,
    reminderNotification: true,
    hapticFeedback: true,
  },
};

const mockAddSubscribedShow = jest.fn();
const mockMarkEpisodeAsWatched = jest.fn();
const mockClearWatchedEpisodesForShow = jest.fn();

jest.mock('@/valitio.store', () => ({
  PERSISTED_APP_STATE: mockPERSISTED_APP_STATE,
  addSubscribedShow: mockAddSubscribedShow,
  markEpisodeAsWatched: mockMarkEpisodeAsWatched,
  clearWatchedEpisodesForShow: mockClearWatchedEpisodesForShow,
  addNewEpisode: mockAddNewEpisode,
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
}));

// Import after mocking
const { findNewEpisodes } = require('@/lib/refresh');
const { 
  PERSISTED_APP_STATE,
  addSubscribedShow,
  markEpisodeAsWatched,
  clearWatchedEpisodesForShow,
} = require('@/valitio.store');

describe('Refresh Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddNewEpisode.mockClear();
    
    // Reset store state
    PERSISTED_APP_STATE.subscribedShows = [];
    PERSISTED_APP_STATE.newEpisodes = [];
    PERSISTED_APP_STATE.watchedEpisodes = [];
    
    // Reset fetch mock
    global.fetch = jest.fn();
  });

  afterEach(() => {
    restoreDate();
  });

  describe('findNewEpisodes', () => {
    test('should handle empty subscribed shows', async () => {
      await findNewEpisodes();
      
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockAddNewEpisode).not.toHaveBeenCalled();
    });

    test('should fetch fresh data for subscribed shows', async () => {
      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: {
          ...mockTVShow.last_episode_to_air,
          season_number: 1,
          episode_number: 11,
          air_date: '2024-01-07',
          name: 'New Episode',
        },
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);

      await findNewEpisodes();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`tv/${mockTVShow.id}`),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
          }),
        })
      );
    });

    test('should detect new episode when latest episode is newer than last watched', async () => {
      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: {
          ...mockTVShow.last_episode_to_air,
          season_number: 1,
          episode_number: 12,
          air_date: '2024-01-08',
          name: 'Brand New Episode',
        },
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);
      
      // Mark episode 10 as watched
      markEpisodeAsWatched(mockTVShow.id, 1, 10);

      await findNewEpisodes();

      expect(mockAddNewEpisode).toHaveBeenCalledWith({
        id: mockTVShow.id.toString(),
        title: mockTVShow.name,
        url: `https://www.themoviedb.org/tv/${mockTVShow.id}`,
        season: 1,
        episode: 12,
        poster: mockTVShow.poster_path || '',
      });
    });

    test('should not detect new episode when no newer episodes available', async () => {
      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: {
          ...mockTVShow.last_episode_to_air,
          season_number: 1,
          episode_number: 10,
          air_date: '2023-12-31',
          name: 'Current Episode',
        },
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);
      
      // Mark episode 10 as watched (same as latest)
      markEpisodeAsWatched(mockTVShow.id, 1, 10);

      await findNewEpisodes();

      expect(mockAddNewEpisode).not.toHaveBeenCalled();
    });

    test('should detect new season episode', async () => {
      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: {
          ...mockTVShow.last_episode_to_air,
          season_number: 2,
          episode_number: 1,
          air_date: '2024-01-15',
          name: 'Season 2 Premiere',
        },
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);
      
      // Mark season 1 finale as watched
      markEpisodeAsWatched(mockTVShow.id, 1, 10);

      await findNewEpisodes();

      expect(mockAddNewEpisode).toHaveBeenCalledWith({
        id: mockTVShow.id.toString(),
        title: mockTVShow.name,
        url: `https://www.themoviedb.org/tv/${mockTVShow.id}`,
        season: 2,
        episode: 1,
        poster: mockTVShow.poster_path || '',
      });
    });

    test('should handle new subscription with recent episode', async () => {
      createMockDate('2024-01-05T12:00:00.000Z'); // 3 days after episode aired

      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: {
          ...mockTVShow.last_episode_to_air,
          season_number: 1,
          episode_number: 10,
          air_date: '2024-01-02', // 3 days ago
          name: 'Recent Episode',
        },
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);
      // No watched episodes (new subscription)

      await findNewEpisodes();

      expect(mockAddNewEpisode).toHaveBeenCalledWith({
        id: mockTVShow.id.toString(),
        title: mockTVShow.name,
        url: `https://www.themoviedb.org/tv/${mockTVShow.id}`,
        season: 1,
        episode: 10,
        poster: mockTVShow.poster_path || '',
      });
    });

    test('should mark old episode as watched for new subscription', async () => {
      createMockDate('2024-01-15T12:00:00.000Z'); // 10 days after episode aired

      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: {
          ...mockTVShow.last_episode_to_air,
          season_number: 1,
          episode_number: 10,
          air_date: '2024-01-05', // 10 days ago
          name: 'Old Episode',
        },
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);
      // No watched episodes (new subscription)

      await findNewEpisodes();

      // Should not add as new episode due to age
      expect(mockAddNewEpisode).not.toHaveBeenCalled();
      
      // Should mark as watched
      expect(PERSISTED_APP_STATE.watchedEpisodes).toContainEqual(
        expect.objectContaining({
          showId: mockTVShow.id,
          seasonNumber: 1,
          episodeNumber: 10,
        })
      );
    });

    test('should handle multiple shows concurrently', async () => {
      const show1 = { ...mockTVShow, id: 1111 };
      const show2 = { ...mockTVShow, id: 2222 };

      const freshData1 = {
        ...show1,
        last_episode_to_air: {
          ...show1.last_episode_to_air,
          season_number: 1,
          episode_number: 11,
          air_date: '2024-01-08',
        },
      };

      const freshData2 = {
        ...show2,
        last_episode_to_air: {
          ...show2.last_episode_to_air,
          season_number: 1,
          episode_number: 12,
          air_date: '2024-01-09',
        },
      };

      // Mock fetch to return different data based on URL
      global.fetch = jest.fn((url: string) => {
        if (url.includes('tv/1111')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(freshData1),
          });
        } else if (url.includes('tv/2222')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(freshData2),
          });
        }
        return Promise.reject(new Error('Unexpected URL'));
      }) as jest.MockedFunction<typeof fetch>;

      addSubscribedShow(show1);
      addSubscribedShow(show2);
      
      markEpisodeAsWatched(1111, 1, 10);
      markEpisodeAsWatched(2222, 1, 10);

      await findNewEpisodes();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(mockAddNewEpisode).toHaveBeenCalledTimes(2);
    });

    test('should handle API errors gracefully', async () => {
      global.fetch = createMockFetch({}, { ok: false, status: 500 });
      addSubscribedShow(mockTVShow);

      await expect(findNewEpisodes()).resolves.not.toThrow();
      expect(mockAddNewEpisode).not.toHaveBeenCalled();
    });

    test('should handle missing episode data', async () => {
      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: null,
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);

      await findNewEpisodes();

      expect(mockAddNewEpisode).not.toHaveBeenCalled();
    });

    test('should handle network failure', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      addSubscribedShow(mockTVShow);

      await expect(findNewEpisodes()).resolves.not.toThrow();
      expect(mockAddNewEpisode).not.toHaveBeenCalled();
    });

    test('should handle invalid response format', async () => {
      global.fetch = createMockFetch({ invalid: 'response' });
      addSubscribedShow(mockTVShow);

      await expect(findNewEpisodes()).resolves.not.toThrow();
      expect(mockAddNewEpisode).not.toHaveBeenCalled();
    });

    test('should not add episode if already watched higher episode', async () => {
      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: {
          ...mockTVShow.last_episode_to_air,
          season_number: 1,
          episode_number: 11,
          air_date: '2024-01-08',
          name: 'Episode 11',
        },
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);
      
      // User has already watched episode 12 (ahead of latest)
      markEpisodeAsWatched(mockTVShow.id, 1, 12);

      await findNewEpisodes();

      expect(mockAddNewEpisode).not.toHaveBeenCalled();
    });

    test('should handle same episode number in different season', async () => {
      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: {
          ...mockTVShow.last_episode_to_air,
          season_number: 2,
          episode_number: 5,
          air_date: '2024-01-15',
          name: 'Season 2 Episode 5',
        },
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);
      
      // Mark season 1 episode 5 as watched
      markEpisodeAsWatched(mockTVShow.id, 1, 5);

      await findNewEpisodes();

      expect(mockAddNewEpisode).toHaveBeenCalledWith({
        id: mockTVShow.id.toString(),
        title: mockTVShow.name,
        url: `https://www.themoviedb.org/tv/${mockTVShow.id}`,
        season: 2,
        episode: 5,
        poster: mockTVShow.poster_path || '',
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle missing API key', async () => {
      delete process.env.EXPO_PUBLIC_TMDB_API_KEY;
      addSubscribedShow(mockTVShow);

      await expect(findNewEpisodes()).resolves.not.toThrow();
      expect(global.fetch).not.toHaveBeenCalled();
      
      // Restore API key
      process.env.EXPO_PUBLIC_TMDB_API_KEY = 'test-api-key';
    });

    test('should handle malformed air date', async () => {
      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: {
          ...mockTVShow.last_episode_to_air,
          season_number: 1,
          episode_number: 11,
          air_date: 'invalid-date',
          name: 'Episode with bad date',
        },
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);

      await expect(findNewEpisodes()).resolves.not.toThrow();
    });

    test('should handle concurrent modifications to store', async () => {
      const freshShowData = {
        ...mockTVShow,
        last_episode_to_air: {
          ...mockTVShow.last_episode_to_air,
          season_number: 1,
          episode_number: 11,
          air_date: '2024-01-08',
        },
      };

      global.fetch = createMockFetch(freshShowData);
      addSubscribedShow(mockTVShow);

      // Simulate concurrent modification
      const findPromise = findNewEpisodes();
      
      // Modify store while checking is in progress
      setTimeout(() => {
        clearWatchedEpisodesForShow(mockTVShow.id);
      }, 10);

      await expect(findPromise).resolves.not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    test('should handle large number of subscribed shows', async () => {
      const shows = Array.from({ length: 50 }, (_, i) => ({
        ...mockTVShow,
        id: i + 1000,
        name: `Test Show ${i}`,
      }));

      // Mock fetch for all shows
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            ...mockTVShow,
            last_episode_to_air: {
              ...mockTVShow.last_episode_to_air,
              episode_number: 11,
            },
          }),
        })
      );

      shows.forEach(show => addSubscribedShow(show));

      const startTime = Date.now();
      await findNewEpisodes();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(global.fetch).toHaveBeenCalledTimes(50);
    });
  });
});