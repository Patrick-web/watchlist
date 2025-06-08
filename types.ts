import { TVShowDetailsResponse } from "./types/tmdb.types";

export interface NewEpisode {
  id: string;
  show: ShowInfo;
  notifiedUser: boolean;
  reminder: Date | null;
}

export interface ShowInfo {
  id: string;
  url: string;
  poster: string;
  title: string;
  season: number;
  episode: number;
}

export type FilmResult<T = any> = T & {
  id: string | number;
  url: string;
  poster: string;
  title: string;
};

export type ShowResult = object;

export interface MovieResult {
  year: number;
  duration: number;
}

export interface MovieInfo {
  url: string;
  poster: string;
  title: string;
  year: number;
  duration: number;
}

export interface Season {
  id: number;
  title: string;
  seasonNumber: number;
}

export type SeasonEpisode = {
  title: string;
  episode: number;
};
