// Sansekai API client — all endpoints
const BASE = "https://api.sansekai.my.id/api";

async function get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(BASE + path);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  if (json?.error) throw new Error(json.message || json.error);
  return json as T;
}

export const api = {
  // PineDrama
  pinedramaForyou: (cursor?: string) => get("/pinedrama/foryou", { cursor }),
  pinedramaTrending: (cursor?: string) => get("/pinedrama/trending", { cursor }),
  pinedramaSearch: (query: string) => get("/pinedrama/search", { query }),
  pinedramaDetail: (collection_id: string) => get("/pinedrama/detail", { collection_id }),
  pinedramaEpisode: (collection_id: string, episodeNumber: number) =>
    get("/pinedrama/episode", { collection_id, episodeNumber }),

  // DramaBox
  dramaboxForyou: (page = 1) => get("/dramabox/foryou", { page }),
  dramaboxVip: () => get("/dramabox/vip"),
  dramaboxDubindo: (classify: string, page = 1) =>
    get("/dramabox/dubindo", { classify, page }),
  dramaboxRandom: () => get("/dramabox/randomdrama"),
  dramaboxLatest: () => get("/dramabox/latest"),
  dramaboxTrending: () => get("/dramabox/trending"),
  dramaboxPopulerSearch: () => get("/dramabox/populersearch"),
  dramaboxSearch: (query: string) => get("/dramabox/search", { query }),
  dramaboxDetail: (bookId: string) => get("/dramabox/detail", { bookId }),
  dramaboxAllEpisode: (bookId: string) => get("/dramabox/allepisode", { bookId }),
  dramaboxDecrypt: (url: string) => get("/dramabox/decrypt", { url }),

  // ReelShort
  reelshortForyou: (page = 1) => get("/reelshort/foryou", { page }),
  reelshortHomepage: () => get("/reelshort/homepage"),
  reelshortSearch: (query: string, page = 1) => get("/reelshort/search", { query, page }),
  reelshortDetail: (bookId: string) => get("/reelshort/detail", { bookId }),
  reelshortEpisode: (bookId: string, episodeNumber: number) =>
    get("/reelshort/episode", { bookId, episodeNumber }),

  // ShortMax
  shortmaxForyou: (page = 1) => get("/shortmax/foryou", { page }),
  shortmaxLatest: () => get("/shortmax/latest"),
  shortmaxRekomendasi: () => get("/shortmax/rekomendasi"),
  shortmaxVip: () => get("/shortmax/vip"),
  shortmaxSearch: (query: string) => get("/shortmax/search", { query }),
  shortmaxDetail: (shortPlayId: string) => get("/shortmax/detail", { shortPlayId }),
  shortmaxEpisode: (shortPlayId: string, episodeNumber: number) =>
    get("/shortmax/episode", { shortPlayId, episodeNumber }),

  // GoodShort
  goodshortForyou: (page = 1) => get("/goodshort/foryou", { page }),
  goodshortLatest: () => get("/goodshort/latest"),
  goodshortTrending: () => get("/goodshort/trending"),
  goodshortAnime: (page = 1) => get("/goodshort/anime", { page }),
  goodshortSearch: (query: string) => get("/goodshort/search", { query }),
  goodshortDetail: (bookId: string) => get("/goodshort/detail", { bookId }),
  goodshortAllEpisode: (bookId: string) => get("/goodshort/allepisode", { bookId }),
  goodshortDecrypt: (url: string) => get("/goodshort/decrypt", { url }),

  // FreeReels
  freereelsForyou: (offset = 0) => get("/freereels/foryou", { offset }),
  freereelsHomepage: () => get("/freereels/homepage"),
  freereelsAnimepage: () => get("/freereels/animepage"),
  freereelsSearch: (query: string) => get("/freereels/search", { query }),
  freereelsDetail: (key: string) => get("/freereels/detailAndAllEpisode", { key }),

  // DramaNova
  dramanovaHome: (page = 1) => get("/dramanova/home", { page }),
  dramanovaDrama18: (page = 1) => get("/dramanova/drama18", { page }),
  dramanovaKomik: (page = 1) => get("/dramanova/komik", { page }),
  dramanovaSearch: (query: string) => get("/dramanova/search", { query }),
  dramanovaDetail: (dramaId: string) => get("/dramanova/detail", { dramaId }),
  dramanovaGetVideo: (fileId: string) => get("/dramanova/getvideo", { fileId }),

  // Anime
  animeLatest: () => get("/anime/latest"),
  animeRecommended: (page = 1) => get("/anime/recommended", { page }),
  animeMovie: () => get("/anime/movie"),
  animeSearch: (query: string) => get("/anime/search", { query }),
  animeDetail: (urlId: string) => get("/anime/detail", { urlId }),
  animeGetVideo: (chapterUrlId: string, reso?: string) =>
    get("/anime/getvideo", { chapterUrlId, reso }),

  // Komik
  komikRecommended: (type: string) => get("/komik/recommended", { type }),
  komikLatest: (type: string) => get("/komik/latest", { type }),
  komikSearch: (query: string) => get("/komik/search", { query }),
  komikPopular: (page = 1) => get("/komik/popular", { page }),
  komikDetail: (manga_id: string) => get("/komik/detail", { manga_id }),
  komikChapterList: (manga_id: string) => get("/komik/chapterlist", { manga_id }),
  komikGetImage: (chapter_id: string) => get("/komik/getimage", { chapter_id }),

  // MovieBox
  movieboxHomepage: () => get("/moviebox/homepage"),
  movieboxTrending: (page = 1) => get("/moviebox/trending", { page }),
  movieboxSearch: (query: string, page = 1) => get("/moviebox/search", { query, page }),
  movieboxDetail: (subjectId: string) => get("/moviebox/detail", { subjectId }),
  movieboxSources: (subjectId: string, season?: number, episode?: number) =>
    get("/moviebox/sources", { subjectId, season, episode }),
  movieboxGenerateLink: (url: string) =>
    get("/moviebox/generate-link-stream-video", { url }),

  // AI
  aiChatGPT: (prompt: string) => get("/ai/chatgpt", { prompt }),
};

export type Provider =
  | "moviebox"
  | "dramabox"
  | "reelshort"
  | "shortmax"
  | "goodshort"
  | "freereels"
  | "dramanova"
  | "pinedrama"
  | "anime";

export const PROVIDERS: { id: Provider; name: string; tag: string }[] = [
  { id: "moviebox", name: "MovieBox", tag: "Film & Serial" },
  { id: "dramabox", name: "DramaBox", tag: "Drama Pendek" },
  { id: "reelshort", name: "ReelShort", tag: "Drama Vertikal" },
  { id: "shortmax", name: "ShortMax", tag: "Short Drama" },
  { id: "goodshort", name: "GoodShort", tag: "Drama HD" },
  { id: "freereels", name: "FreeReels", tag: "Reels Gratis" },
  { id: "dramanova", name: "DramaNova", tag: "Nova Drama" },
  { id: "pinedrama", name: "PineDrama", tag: "Pine Drama" },
  { id: "anime", name: "Anime", tag: "Anime Sub Indo" },
];
