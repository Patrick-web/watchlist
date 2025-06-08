import { mockTVShow, mockMovie, mockNewEpisode, mockWatchedEpisode } from '../utils/test-utils';

// Mock lib/refresh to avoid process.env issues
jest.mock('@/lib/refresh', () => ({
  findNewEpisodes: jest.fn(),
}));

// Import the store functions after mocking
const { 
  PERSISTED_APP_STATE,
  addSubscribedShow,
  unsubscribeShow,
  isSubscribed,
  isInWatchList,
  addMovieToWatchList,
  addShowToWatchList,
  removeMovieFromWatchList,
  removeShowFromWatchList,
  isMovieInWatchList,
  isShowInWatchList,
  onMovieWatched,
  onShowWatched,
  markEpisodeAsWatched,
  isEpisodeWatched,
  getLastWatchedEpisode,
  getWatchedEpisodesForShow,
  getWatchedEpisodesCount,
  removeWatchedEpisode,
  clearWatchedEpisodesForShow,
  addNewEpisode,
  deleteNewEpisode,
  onEpisodeWatched,
  setSetting,
  decreaseEpisode,
} = require('@/valitio.store');

describe('Valtio Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    PERSISTED_APP_STATE.subscribedShows = [];
    PERSISTED_APP_STATE.newEpisodes = [];
    PERSISTED_APP_STATE.watchedEpisodes = [];
    PERSISTED_APP_STATE.watchList.shows = [];
    PERSISTED_APP_STATE.watchList.movies = [];
    PERSISTED_APP_STATE.history.watchedMovies = [];
    PERSISTED_APP_STATE.history.watchedShows = [];
    PERSISTED_APP_STATE.settings = {
      newEpisodeNotification: true,
      reminderNotification: true,
      hapticFeedback: true,
    };
  });

  describe('Subscribed Shows', () => {
    test('should add a new show to subscribed shows', () => {
      addSubscribedShow(mockTVShow);
      
      expect(PERSISTED_APP_STATE.subscribedShows).toHaveLength(1);
      expect(PERSISTED_APP_STATE.subscribedShows[0]).toEqual(mockTVShow);
    });

    test('should not add duplicate shows', () => {
      addSubscribedShow(mockTVShow);
      addSubscribedShow(mockTVShow);
      
      expect(PERSISTED_APP_STATE.subscribedShows).toHaveLength(1);
    });

    test('should unsubscribe from a show', () => {
      addSubscribedShow(mockTVShow);
      expect(PERSISTED_APP_STATE.subscribedShows).toHaveLength(1);
      
      unsubscribeShow(mockTVShow);
      expect(PERSISTED_APP_STATE.subscribedShows).toHaveLength(0);
    });

    test('should toggle subscription when adding same show twice', () => {
      addSubscribedShow(mockTVShow);
      expect(PERSISTED_APP_STATE.subscribedShows).toHaveLength(1);
      
      addSubscribedShow(mockTVShow); // Should unsubscribe
      expect(PERSISTED_APP_STATE.subscribedShows).toHaveLength(0);
    });

    test('should check if user is subscribed to a show', () => {
      expect(isSubscribed(mockTVShow.id)).toBe(false);
      
      addSubscribedShow(mockTVShow);
      expect(isSubscribed(mockTVShow.id)).toBe(true);
      
      unsubscribeShow(mockTVShow);
      expect(isSubscribed(mockTVShow.id)).toBe(false);
    });
  });

  describe('Watch List', () => {
    test('should add movie to watch list', () => {
      addMovieToWatchList(mockMovie);
      
      expect(PERSISTED_APP_STATE.watchList.movies).toHaveLength(1);
      expect(PERSISTED_APP_STATE.watchList.movies[0]).toEqual(mockMovie);
    });

    test('should not add duplicate movies to watch list', () => {
      addMovieToWatchList(mockMovie);
      addMovieToWatchList(mockMovie);
      
      expect(PERSISTED_APP_STATE.watchList.movies).toHaveLength(1);
    });

    test('should add show to watch list', () => {
      addShowToWatchList(mockTVShow);
      
      expect(PERSISTED_APP_STATE.watchList.shows).toHaveLength(1);
      expect(PERSISTED_APP_STATE.watchList.shows[0]).toEqual(mockTVShow);
    });

    test('should remove movie from watch list', () => {
      addMovieToWatchList(mockMovie);
      expect(PERSISTED_APP_STATE.watchList.movies).toHaveLength(1);
      
      removeMovieFromWatchList(mockMovie);
      expect(PERSISTED_APP_STATE.watchList.movies).toHaveLength(0);
    });

    test('should remove show from watch list', () => {
      addShowToWatchList(mockTVShow);
      expect(PERSISTED_APP_STATE.watchList.shows).toHaveLength(1);
      
      removeShowFromWatchList(mockTVShow);
      expect(PERSISTED_APP_STATE.watchList.shows).toHaveLength(0);
    });

    test('should check if movie is in watch list', () => {
      expect(isMovieInWatchList(mockMovie)).toBeFalsy();
      
      addMovieToWatchList(mockMovie);
      expect(isMovieInWatchList(mockMovie)).toBeTruthy();
    });

    test('should check if show is in watch list', () => {
      expect(isShowInWatchList(mockTVShow)).toBeFalsy();
      
      addShowToWatchList(mockTVShow);
      expect(isShowInWatchList(mockTVShow)).toBeTruthy();
    });

    test('should check if item is in general watch list', () => {
      expect(isInWatchList(mockMovie.id)).toBe(false);
      expect(isInWatchList(mockTVShow.id)).toBe(false);
      
      addMovieToWatchList(mockMovie);
      addShowToWatchList(mockTVShow);
      
      expect(isInWatchList(mockMovie.id)).toBe(true);
      expect(isInWatchList(mockTVShow.id)).toBe(true);
    });
  });

  describe('Watched Episodes', () => {
    test('should mark episode as watched', () => {
      markEpisodeAsWatched(1234, 1, 5);
      
      expect(PERSISTED_APP_STATE.watchedEpisodes).toHaveLength(1);
      expect(isEpisodeWatched(1234, 1, 5)).toBe(true);
    });

    test('should not add duplicate watched episodes', () => {
      markEpisodeAsWatched(1234, 1, 5);
      markEpisodeAsWatched(1234, 1, 5);
      
      expect(PERSISTED_APP_STATE.watchedEpisodes).toHaveLength(1);
    });

    test('should get last watched episode for a show', () => {
      markEpisodeAsWatched(1234, 1, 3);
      markEpisodeAsWatched(1234, 1, 5);
      markEpisodeAsWatched(1234, 2, 1);
      
      const lastWatched = getLastWatchedEpisode(1234);
      expect(lastWatched).toEqual({
        showId: 1234,
        seasonNumber: 2,
        episodeNumber: 1,
        watchedAt: expect.any(String),
      });
    });

    test('should get all watched episodes for a show', () => {
      markEpisodeAsWatched(1234, 1, 3);
      markEpisodeAsWatched(1234, 1, 1);
      markEpisodeAsWatched(1234, 2, 1);
      
      const watchedEpisodes = getWatchedEpisodesForShow(1234);
      expect(watchedEpisodes).toHaveLength(3);
      
      // Should be sorted by season and episode
      expect(watchedEpisodes[0].episodeNumber).toBe(1);
      expect(watchedEpisodes[1].episodeNumber).toBe(3);
      expect(watchedEpisodes[2].seasonNumber).toBe(2);
    });

    test('should get watched episodes count', () => {
      markEpisodeAsWatched(1234, 1, 1);
      markEpisodeAsWatched(1234, 1, 2);
      markEpisodeAsWatched(5678, 1, 1);
      
      expect(getWatchedEpisodesCount(1234)).toBe(2);
      expect(getWatchedEpisodesCount(5678)).toBe(1);
      expect(getWatchedEpisodesCount(9999)).toBe(0);
    });

    test('should remove watched episode', () => {
      markEpisodeAsWatched(1234, 1, 5);
      expect(isEpisodeWatched(1234, 1, 5)).toBe(true);
      
      removeWatchedEpisode(1234, 1, 5);
      expect(isEpisodeWatched(1234, 1, 5)).toBe(false);
    });

    test('should clear all watched episodes for a show', () => {
      markEpisodeAsWatched(1234, 1, 1);
      markEpisodeAsWatched(1234, 1, 2);
      markEpisodeAsWatched(5678, 1, 1);
      
      expect(getWatchedEpisodesCount(1234)).toBe(2);
      expect(getWatchedEpisodesCount(5678)).toBe(1);
      
      clearWatchedEpisodesForShow(1234);
      
      expect(getWatchedEpisodesCount(1234)).toBe(0);
      expect(getWatchedEpisodesCount(5678)).toBe(1);
    });
  });

  describe('New Episodes', () => {
    test('should add new episode', async () => {
      await addNewEpisode(mockNewEpisode.show);
      
      expect(PERSISTED_APP_STATE.newEpisodes).toHaveLength(1);
      expect(PERSISTED_APP_STATE.newEpisodes[0].show).toEqual(mockNewEpisode.show);
    });

    test('should not add duplicate new episodes', async () => {
      await addNewEpisode(mockNewEpisode.show);
      await addNewEpisode(mockNewEpisode.show);
      
      expect(PERSISTED_APP_STATE.newEpisodes).toHaveLength(1);
    });

    test('should not add already watched episodes as new', async () => {
      markEpisodeAsWatched(parseInt(mockNewEpisode.show.id), mockNewEpisode.show.season, mockNewEpisode.show.episode);
      
      await addNewEpisode(mockNewEpisode.show);
      
      expect(PERSISTED_APP_STATE.newEpisodes).toHaveLength(0);
    });

    test('should delete new episode', async () => {
      await addNewEpisode(mockNewEpisode.show);
      expect(PERSISTED_APP_STATE.newEpisodes).toHaveLength(1);
      
      deleteNewEpisode(PERSISTED_APP_STATE.newEpisodes[0]);
      expect(PERSISTED_APP_STATE.newEpisodes).toHaveLength(0);
    });

    test('should handle episode watched', async () => {
      await addNewEpisode(mockNewEpisode.show);
      const newEpisode = PERSISTED_APP_STATE.newEpisodes[0];
      
      onEpisodeWatched(newEpisode);
      
      // Should remove from new episodes
      expect(PERSISTED_APP_STATE.newEpisodes).toHaveLength(0);
      
      // Should add to watched episodes
      expect(isEpisodeWatched(
        parseInt(mockNewEpisode.show.id),
        mockNewEpisode.show.season,
        mockNewEpisode.show.episode
      )).toBe(true);
    });
  });

  describe('History', () => {
    test('should track watched movies', () => {
      addMovieToWatchList(mockMovie);
      
      onMovieWatched(mockMovie);
      
      expect(PERSISTED_APP_STATE.history.watchedMovies).toHaveLength(1);
      expect(PERSISTED_APP_STATE.history.watchedMovies[0]).toEqual(mockMovie);
      expect(PERSISTED_APP_STATE.watchList.movies).toHaveLength(0);
    });

    test('should track watched shows', () => {
      addShowToWatchList(mockTVShow);
      
      onShowWatched(mockTVShow);
      
      expect(PERSISTED_APP_STATE.history.watchedShows).toHaveLength(1);
      expect(PERSISTED_APP_STATE.history.watchedShows[0]).toEqual(mockTVShow);
      expect(PERSISTED_APP_STATE.watchList.shows).toHaveLength(0);
    });
  });

  describe('Settings', () => {
    test('should update settings', () => {
      expect(PERSISTED_APP_STATE.settings.newEpisodeNotification).toBe(true);
      
      setSetting('newEpisodeNotification', false);
      expect(PERSISTED_APP_STATE.settings.newEpisodeNotification).toBe(false);
      
      setSetting('hapticFeedback', false);
      expect(PERSISTED_APP_STATE.settings.hapticFeedback).toBe(false);
    });
  });

  describe('Utility Functions', () => {
    test('should decrease episode count', () => {
      // Add some watched episodes
      markEpisodeAsWatched(1234, 1, 5);
      markEpisodeAsWatched(1234, 2, 3);
      markEpisodeAsWatched(5678, 1, 2);
      
      // Add subscribed shows
      addSubscribedShow(mockTVShow);
      addSubscribedShow({ ...mockTVShow, id: 5678 });
      
      const initialCount = PERSISTED_APP_STATE.watchedEpisodes.length;
      
      decreaseEpisode();
      
      // Should remove the last watched episode for each show
      expect(PERSISTED_APP_STATE.watchedEpisodes.length).toBe(initialCount - 2);
      
      // Should not have the latest episodes
      expect(isEpisodeWatched(1234, 2, 3)).toBe(false);
      expect(isEpisodeWatched(5678, 1, 2)).toBe(false);
      
      // Should still have earlier episodes
      expect(isEpisodeWatched(1234, 1, 5)).toBe(true);
    });

    test('should handle unsubscribe cleanup', () => {
      // Add show and some new episodes
      addSubscribedShow(mockTVShow);
      PERSISTED_APP_STATE.newEpisodes.push({
        ...mockNewEpisode,
        show: { ...mockNewEpisode.show, id: mockTVShow.id.toString() }
      });
      
      expect(PERSISTED_APP_STATE.subscribedShows).toHaveLength(1);
      expect(PERSISTED_APP_STATE.newEpisodes).toHaveLength(1);
      
      unsubscribeShow(mockTVShow);
      
      expect(PERSISTED_APP_STATE.subscribedShows).toHaveLength(0);
      expect(PERSISTED_APP_STATE.newEpisodes).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing data gracefully', () => {
      expect(getLastWatchedEpisode(9999)).toBeNull();
      expect(getWatchedEpisodesForShow(9999)).toEqual([]);
      expect(getWatchedEpisodesCount(9999)).toBe(0);
      expect(isEpisodeWatched(9999, 1, 1)).toBe(false);
    });

    test('should handle invalid episode removal', () => {
      const initialLength = PERSISTED_APP_STATE.watchedEpisodes.length;
      
      removeWatchedEpisode(9999, 1, 1); // Non-existent episode
      
      expect(PERSISTED_APP_STATE.watchedEpisodes).toHaveLength(initialLength);
    });

    test('should handle empty new episodes deletion', () => {
      const nonExistentEpisode = {
        id: 'fake-id',
        show: mockNewEpisode.show,
        notifiedUser: false,
        reminder: null,
      };
      
      expect(() => deleteNewEpisode(nonExistentEpisode)).not.toThrow();
      expect(PERSISTED_APP_STATE.newEpisodes).toHaveLength(0);
    });
  });
});