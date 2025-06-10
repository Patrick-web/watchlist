export interface SearchResponse {
  page: number;
  results: (MovieResult | TVResult)[];
  total_pages: number;
  total_results: number;
}

// Base interface for common properties
interface BaseResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

// Movie-specific result
export interface MovieResult extends BaseResult {
  original_title: string;
  release_date: string;
  title: string;
  video: boolean;
}

// TV show-specific result
export interface TVResult extends BaseResult {
  first_air_date: string;
  name: string;
  origin_country: string[];
  original_name: string;
}

// Type guard functions
export const isMovieResult = (
  result: MovieResult | TVResult,
): result is MovieResult => {
  return "title" in result && "release_date" in result;
};

export const isTVResult = (
  result: MovieResult | TVResult,
): result is TVResult => {
  return "name" in result && "first_air_date" in result;
};

// Union type for search results
export type SearchResult = MovieResult | TVResult;

// Movie Details
export interface MovieDetailsResponse {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: GenresItem[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompaniesItem[];
  production_countries: ProductionCountriesItem[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguagesItem[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
interface GenresItem {
  id: number;
  name: string;
}
interface ProductionCompaniesItem {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}
interface ProductionCountriesItem {
  iso_3166_1: string;
  name: string;
}
interface SpokenLanguagesItem {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Season Details Response
export interface SeasonDetailsResponse {
  _id: string;
  air_date: string;
  episodes: EpisodeItem[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

interface EpisodeItem {
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  crew: CrewItem[];
  guest_stars: GuestStarItem[];
}

interface CrewItem {
  job: string;
  department: string;
  credit_id: string;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

interface GuestStarItem {
  character: string;
  credit_id: string;
  order: number;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

// TV show
//
export interface TVShowDetailsResponse {
  adult: boolean;
  backdrop_path: string;
  created_by: any[];
  episode_run_time: number[];
  first_air_date: string;
  genres: GenresItem[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Last_episode_to_air;
  name: string;
  next_episode_to_air: null;
  networks: NetworksItem[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompaniesItem[];
  production_countries: any[];
  seasons: SeasonsItem[];
  spoken_languages: SpokenLanguagesItem[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}
interface GenresItem {
  id: number;
  name: string;
}
interface Last_episode_to_air {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: null;
}
interface NetworksItem {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}
interface ProductionCompaniesItem {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}
interface SeasonsItem {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: null | string;
  season_number: number;
  vote_average: number;
}
interface SpokenLanguagesItem {
  english_name: string;
  iso_639_1: string;
  name: string;
}
