export interface ShowInfo {
  url: string;
  poster: string;
  title: string;
  season: string;
  episode: string;
  type: string;
}

export function extractShows(html: string): ShowInfo[] {
  const pattern =
    /href="([^"]+)".*?src="([^"]+)"[^>]*>.*?title="([^"]+)".*?(SS \d+)<\/span>.*?<span>(EPS \d+)<\/span>.*?<span>(TV)<\/span>/gs;
  const matches = html.matchAll(pattern);

  const shows: ShowInfo[] = [];

  for (const match of matches) {
    const showInfo: ShowInfo = {
      url: match[1],
      poster: match[2],
      title: match[3].replace("&amp;", "&"),
      season: match[4].replace(/SS/i, "").trim(),
      episode: match[5].replace(/EPS/i, "").trim(),
      type: match[5],
    };
    shows.push(showInfo);
  }

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
