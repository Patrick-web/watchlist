export interface ShowInfo {
  url: string;
  poster: string;
  title: string;
  season: number;
  episode: number;
}

export function extractShows(html: string): ShowInfo[] {
  const aTagRegex = /<a[^>]*>.*?<\/a>/gs;
  const showDetailsRegex =
    /href="([^"]+)".*src="([^"]+)".*<h3 class="film-name">(.*?)<\/h3>.*?(SS \d+).*(EPS \d+)/gs;

  const resultsAsHtml = html.matchAll(aTagRegex);
  let tvShowMatches: string[] = [];

  for (const match of resultsAsHtml) {
    if (match[0].includes("/tv/")) {
      tvShowMatches.push(match[0]);
    }
  }
  const shows: ShowInfo[] = [];
  tvShowMatches.forEach((showHtml) => {
    const matches = showHtml.matchAll(showDetailsRegex);
    for (const match of matches) {
      const showInfo: ShowInfo = {
        url: match[1],
        poster: match[2],
        title: match[3],
        season: parseInt(match[4].replace(/\D/g, "")),
        episode: parseInt(match[5].replace(/\D/g, "")),
      };
      shows.push(showInfo);
    }
  });

  return shows;
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

export function cleanTitle(title: string) {
  return title.replace("&amp;", "&");
}
