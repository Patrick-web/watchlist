import { FilmResult, MovieInfo, Season, SeasonEpisode } from "@/types";
import * as he from "he";
import { z } from "zod";

export function extractFilmInfo(html: string) {
  const genreRegex = /<a[^"]*href="\/genre\/[^"]*"[^"]*title="([^"]*)">/;
  const releaseDateRegex =
    /<span class="type">Released:<\/span>\s*(\d{4}-\d{2}-\d{2})/;
  const productionRegex = /<a href="\/production[^"]*"[^"]*title="([^"]*)"/gs;
  const castsRegex = /<a href="\/cast[^"]*"[^"]*title="([^"]*)"/gs;
  const durationRegex = /\d{2,3}m/g;
  const ratingRegex = /fa-star.*(\d\.\d)/g;

  const genreMatch = html.match(genreRegex);
  const releaseDateMatch = html.match(releaseDateRegex);
  const ratingMatch = html.match(ratingRegex);
  const rating =
    ratingMatch && ratingMatch[0]
      ? ratingMatch[0].match(/\d\.\d/)?.[0] || "Not Found"
      : "Not Found";
  const durationMatch = html.match(durationRegex);

  let productionMatch;
  let castsMatch;

  const productions: string[] = [];
  const casts: string[] = [];

  while ((productionMatch = productionRegex.exec(html)) !== null) {
    productions.push(productionMatch[1]);
  }

  while ((castsMatch = castsRegex.exec(html)) !== null) {
    casts.push(castsMatch[1]);
  }

  return {
    genre: genreMatch ? genreMatch[1] : "Not Found",
    releaseDate: releaseDateMatch ? releaseDateMatch[1] : "Not Found",
    productions,
    casts,
    duration: durationMatch ? durationMatch[0] : "Not Found",
    rating: rating,
  };
}

export function extractShowSeasons(html: string) {
  const aTagRegex = /<a data-id="(\d*)"[^>]*>([^>]*)<\/a>/gs;

  const resultsAsHtml = html.matchAll(aTagRegex);

  const seasons: Season[] = [];

  for (const match of resultsAsHtml) {
    const seasonNumberMatch = match[2].match(/\d{1,2}/gm);
    seasons.push({
      id: parseInt(match[1]),
      title: he.decode(match[2]),
      seasonNumber: seasonNumberMatch ? parseInt(seasonNumberMatch[0]) : 0,
    });
  }

  return seasons;
}

export function extractShowEpisodes(html: string) {
  const aTagRegex = /<a[^>]*title="([^>]*)"/gs;

  const resultsAsHtml = html.matchAll(aTagRegex);
  const episodes: SeasonEpisode[] = [];

  for (const match of resultsAsHtml) {
    const episodeTitle = match[1] || "";
    const episodeNumberMatch = episodeTitle.match(/\d*:/);
    const episodeNumber = episodeNumberMatch
      ? parseInt(episodeNumberMatch[0].replace(":", ""))
      : 0;
    episodes.push({
      title: he.decode(episodeTitle),
      episode: episodeNumber,
    });
  }

  return episodes;
}

export function extractSearchResults(html: string) {
  console.log(html);
  const showDetailsRegex =
    /<img[^>]*data-src="([^"]*)"[^.]*href="([^"]*)"[^>]*title="([^"]*)"[^>]*>[^.]*SS[^.]*\d{1,2}[^.]*TV/gms;

  const showMatches = html.matchAll(showDetailsRegex);

  const shows: FilmResult[] = [];

  console.log(showMatches);

  if (showMatches) {
    for (const match of showMatches) {
      shows.push({
        poster: match[1],
        url: match[2],
        title: he.decode(match[3]),
      });
    }
  }
  const movies: MovieInfo[] = [];

  const movieDetailsRegex =
    /<img[^>]*data-src="([^"]*)"[^.]*href="([^"]*)"[^>]*title="([^"]*)"[^>]*>[^.]*(\d{4})[^.]*(\d{2,3}m)/gms;

  const movieMatches = html.matchAll(movieDetailsRegex);

  console.log({ movieMatches });

  if (movieMatches) {
    for (const match of movieMatches) {
      const movieInfo: MovieInfo = {
        url: match[2],
        poster: match[1],
        title: he.decode(match[3]),
        year: parseInt(match[4].replace(/\D/g, "")),
        duration: parseInt(match[5].replace(/\D/g, "")),
      };
      movies.push(movieInfo);
    }
  }
  return { shows, movies };
}

export const F_HEADERS = new Headers();
F_HEADERS.append("Host", "fmovies.ps");
F_HEADERS.append("Connection", "keep-alive");
F_HEADERS.append("sec-ch-ua-platform", '"macOS"');
F_HEADERS.append("sec-ch-ua", '"Chromium";v="131", "Not_A Brand";v="24"');
F_HEADERS.append("sec-ch-ua-mobile", "?0");
F_HEADERS.append("X-Requested-With", "XMLHttpRequest");
F_HEADERS.append(
  "User-Agent",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
);
F_HEADERS.append("Accept", "*/*");
F_HEADERS.append("DNT", "1");
F_HEADERS.append("Origin", "https://fmovies.ps");
F_HEADERS.append("Sec-Fetch-Site", "same-origin");
F_HEADERS.append("Sec-Fetch-Mode", "cors");
F_HEADERS.append("Sec-Fetch-Dest", "empty");
F_HEADERS.append("Referer", "https://fmovies.ps/tv-show");
F_HEADERS.append("Accept-Language", "en-US,en;q=0.9");
F_HEADERS.append(
  "Content-Type",
  "application/x-www-form-urlencoded; charset=UTF-8",
);
