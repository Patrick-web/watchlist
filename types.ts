export interface NewEpisode {
  id: string;
  show: ShowInfo;
  notifiedUser: boolean;
  reminder: Date | null;
}

export interface ShowInfo {
  url: string;
  poster: string;
  title: string;
  season: number;
  episode: number;
}
