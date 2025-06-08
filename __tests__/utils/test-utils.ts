import { RenderOptions } from '@testing-library/react-native';

// Mock data for testing
export const mockTVShow = {
  id: 1234,
  name: 'Test TV Show',
  original_name: 'Test TV Show',
  overview: 'A test TV show for unit testing',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  first_air_date: '2023-01-01',
  last_air_date: '2023-12-31',
  number_of_episodes: 10,
  number_of_seasons: 1,
  status: 'Returning Series',
  vote_average: 8.5,
  vote_count: 1000,
  popularity: 100,
  adult: false,
  genre_ids: [18, 35],
  origin_country: ['US'],
  original_language: 'en',
  last_episode_to_air: {
    id: 5678,
    name: 'Test Episode',
    overview: 'A test episode',
    vote_average: 8.0,
    vote_count: 500,
    air_date: '2023-12-31',
    episode_number: 10,
    episode_type: 'finale',
    production_code: '',
    runtime: 45,
    season_number: 1,
    show_id: 1234,
    still_path: null,
  },
  next_episode_to_air: null,
  networks: [],
  genres: [
    { id: 18, name: 'Drama' },
    { id: 35, name: 'Comedy' },
  ],
  production_companies: [],
  production_countries: [],
  spoken_languages: [],
  seasons: [
    {
      id: 9999,
      name: 'Season 1',
      overview: 'First season',
      poster_path: '/season1-poster.jpg',
      season_number: 1,
      episode_count: 10,
      air_date: '2023-01-01',
      vote_average: 8.5,
    },
  ],
  created_by: [],
  episode_run_time: [45],
  homepage: '',
  in_production: false,
  languages: ['en'],
  tagline: 'A test show',
  type: 'Scripted',
};

export const mockMovie = {
  id: 5678,
  title: 'Test Movie',
  original_title: 'Test Movie',
  overview: 'A test movie for unit testing',
  poster_path: '/test-movie-poster.jpg',
  backdrop_path: '/test-movie-backdrop.jpg',
  release_date: '2023-06-15',
  runtime: 120,
  vote_average: 7.5,
  vote_count: 2000,
  popularity: 150,
  adult: false,
  budget: 50000000,
  revenue: 100000000,
  status: 'Released',
  tagline: 'A test movie',
  video: false,
  imdb_id: 'tt1234567',
  homepage: '',
  belongs_to_collection: null,
  genres: [
    { id: 28, name: 'Action' },
    { id: 878, name: 'Science Fiction' },
  ],
  origin_country: ['US'],
  original_language: 'en',
  production_companies: [],
  production_countries: [],
  spoken_languages: [],
};

export const mockNewEpisode = {
  id: '1234-S1E10',
  show: {
    id: '1234',
    title: 'Test TV Show',
    url: 'https://www.themoviedb.org/tv/1234',
    season: 1,
    episode: 10,
    poster: '/test-poster.jpg',
  },
  notifiedUser: false,
  reminder: null,
};

export const mockWatchedEpisode = {
  showId: 1234,
  seasonNumber: 1,
  episodeNumber: 9,
  watchedAt: '2023-12-30T12:00:00.000Z',
};

export const mockSearchResponse = {
  page: 1,
  results: [
    {
      id: 1234,
      name: 'Test TV Show',
      original_name: 'Test TV Show',
      overview: 'A test TV show',
      poster_path: '/test-poster.jpg',
      backdrop_path: '/test-backdrop.jpg',
      first_air_date: '2023-01-01',
      vote_average: 8.5,
      vote_count: 1000,
      popularity: 100,
      adult: false,
      genre_ids: [18, 35],
      origin_country: ['US'],
      original_language: 'en',
    },
  ],
  total_pages: 1,
  total_results: 1,
};

// Create test query client helper
export const createTestQueryClient = () => {
  const { QueryClient } = require('@tanstack/react-query');
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
};

// Utility functions for testing
export const createMockFetch = (responseData: any, options: { ok?: boolean; status?: number } = {}) => {
  return jest.fn(() =>
    Promise.resolve({
      ok: options.ok ?? true,
      status: options.status ?? 200,
      json: () => Promise.resolve(responseData),
      text: () => Promise.resolve(JSON.stringify(responseData)),
    })
  ) as jest.MockedFunction<typeof fetch>;
};

export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

export const createMockDate = (dateString: string) => {
  const mockDate = new Date(dateString);
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  return mockDate;
};

export const restoreDate = () => {
  (global.Date as jest.Mock).mockRestore();
};

// Re-export everything from testing library
export * from '@testing-library/react-native';