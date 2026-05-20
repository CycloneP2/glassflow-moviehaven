import { api, type Provider } from "./api";

export interface DetailInfo {
  title: string;
  cover?: string;
  banner?: string;
  description?: string;
  meta?: string[];
  genres?: string[];
  rating?: string | number;
  episodes: EpisodeInfo[];
  raw?: any;
}

export interface EpisodeInfo {
  key: string;          // unique key for routing
  label: string;        // "Ep 1", "Chapter 1"
  index: number;        // 1-based ordering
  thumb?: string;
  // identifiers used by resolveStream
  episodeNumber?: number;
  fileId?: string;
  chapterUrlId?: string;
}

export interface StreamInfo {
  url: string;
  type?: "hls" | "mp4";
  poster?: string;
}

export async function fetchDetail(provider: Provider, id: string): Promise<DetailInfo> {
  switch (provider) {
    case "moviebox": {
      const d: any = await api.movieboxDetail(id);
      const s = d.subject || {};
      const episodes: EpisodeInfo[] = [];
      // For series: try to enumerate via resources if present
      const resCount = d.resource?.seasons?.[0]?.episodes?.length;
      const total = resCount || (s.subjectType === 2 ? 12 : 1);
      for (let i = 1; i <= Math.min(total, 100); i++) {
        episodes.push({
          key: `s1-e${i}`,
          label: s.subjectType === 1 ? "Putar Film" : `Episode ${i}`,
          index: i,
          episodeNumber: i,
        });
      }
      return {
        title: s.title,
        cover: s.cover?.url,
        banner: s.cover?.url,
        description: s.description,
        rating: s.imdbRatingValue,
        genres: (s.genre || "").split(",").map((g: string) => g.trim()).filter(Boolean),
        meta: [s.countryName, s.releaseDate].filter(Boolean),
        episodes,
        raw: d,
      };
    }
    case "dramabox": {
      const [d, ep]: any = await Promise.all([
        api.dramaboxDetail(id),
        api.dramaboxAllEpisode(id).catch(() => null),
      ]);
      const info = d.bookInfo || d;
      const list = ep?.chapterList || ep?.data || ep || [];
      const eps: EpisodeInfo[] = (Array.isArray(list) ? list : []).map((c: any, i: number) => ({
        key: `c${c.chapterId || i + 1}`,
        label: `Ep ${c.chapterIndex ?? i + 1}`,
        index: c.chapterIndex ?? i + 1,
        episodeNumber: c.chapterIndex ?? i + 1,
        thumb: c.chapterImg,
      }));
      return {
        title: info.bookName || info.title,
        cover: info.coverWap || info.cover,
        description: info.introduction,
        meta: info.tags || [],
        episodes: eps,
        raw: { detail: d, episodes: ep },
      };
    }
    case "goodshort": {
      const [d, ep]: any = await Promise.all([
        api.goodshortDetail(id),
        api.goodshortAllEpisode(id).catch(() => null),
      ]);
      const info = d.bookInfo || d;
      const list = ep?.chapterList || ep?.data || ep || [];
      const eps: EpisodeInfo[] = (Array.isArray(list) ? list : []).map((c: any, i: number) => ({
        key: `c${i + 1}`,
        label: `Ep ${c.chapterIndex ?? i + 1}`,
        index: c.chapterIndex ?? i + 1,
        episodeNumber: c.chapterIndex ?? i + 1,
        thumb: c.chapterImg,
      }));
      return {
        title: info.bookName || info.title,
        cover: info.coverWap || info.cover,
        description: info.introduction,
        episodes: eps,
        raw: { detail: d, episodes: ep },
      };
    }
    case "reelshort": {
      const d: any = await api.reelshortDetail(id);
      const info = d.data || d;
      const total = info.chapterCount || info.totalChapter || info.episodeCount || 12;
      const eps: EpisodeInfo[] = Array.from({ length: Math.min(total, 200) }, (_, i) => ({
        key: `ep${i + 1}`,
        label: `Ep ${i + 1}`,
        index: i + 1,
        episodeNumber: i + 1,
      }));
      return {
        title: info.bookName || info.name,
        cover: info.cover || info.coverImage,
        description: info.introduction || info.description,
        episodes: eps,
        raw: d,
      };
    }
    case "shortmax": {
      const d: any = await api.shortmaxDetail(id);
      const info = d.data || d;
      const total = info.totalEpisodes || info.episodeCount || 10;
      const eps: EpisodeInfo[] = Array.from({ length: Math.min(total, 200) }, (_, i) => ({
        key: `ep${i + 1}`,
        label: `Ep ${i + 1}`,
        index: i + 1,
        episodeNumber: i + 1,
      }));
      return {
        title: info.name,
        cover: info.cover,
        description: info.introduction || info.description,
        episodes: eps,
        raw: d,
      };
    }
    case "pinedrama": {
      const d: any = await api.pinedramaDetail(id);
      const info = d.data || d;
      const total = info.episode_count || info.totalEpisodes || (info.episodes?.length) || 10;
      const eps: EpisodeInfo[] = Array.from({ length: Math.min(total, 200) }, (_, i) => ({
        key: `ep${i + 1}`,
        label: `Ep ${i + 1}`,
        index: i + 1,
        episodeNumber: i + 1,
      }));
      return {
        title: info.title || info.name,
        cover: info.cover || info.poster,
        description: info.description || info.introduction,
        episodes: eps,
        raw: d,
      };
    }
    case "freereels": {
      const d: any = await api.freereelsDetail(id);
      const info = d.data || d;
      const list = info.episodes || info.allEpisode || [];
      const eps: EpisodeInfo[] = list.map((c: any, i: number) => ({
        key: `ep${i + 1}`,
        label: `Ep ${c.episodeNumber ?? i + 1}`,
        index: i + 1,
        episodeNumber: c.episodeNumber ?? i + 1,
        fileId: c.url || c.videoUrl || c.fileId,
      }));
      return {
        title: info.title,
        cover: info.cover || info.image,
        description: info.description,
        episodes: eps,
        raw: d,
      };
    }
    case "dramanova": {
      const d: any = await api.dramanovaDetail(id);
      const info = d.data || d;
      const list = info.episodes || info.chapters || [];
      const eps: EpisodeInfo[] = list.map((c: any, i: number) => ({
        key: `ep${i + 1}`,
        label: `Ep ${c.episode ?? i + 1}`,
        index: i + 1,
        fileId: c.fileId || c.file_id || c.id,
      }));
      return {
        title: info.title,
        cover: info.cover || info.poster,
        description: info.description,
        episodes: eps,
        raw: d,
      };
    }
    case "anime": {
      const d: any = await api.animeDetail(id);
      const info = (d.data && d.data[0]) || d;
      const list = info.chapter || info.chapters || [];
      const eps: EpisodeInfo[] = list.map((c: any, i: number) => ({
        key: c.url || `ep${i + 1}`,
        label: `Ep ${c.ch ?? i + 1}`,
        index: list.length - i,
        chapterUrlId: c.url,
      }));
      return {
        title: info.judul || info.title,
        cover: info.cover,
        description: info.sinopsis,
        rating: info.rating,
        meta: [info.status, info.published].filter(Boolean),
        genres: info.genre,
        episodes: eps.reverse(),
        raw: d,
      };
    }
  }
}

export async function resolveStream(
  provider: Provider,
  id: string,
  ep: EpisodeInfo
): Promise<StreamInfo> {
  switch (provider) {
    case "moviebox": {
      const r: any = await api.movieboxSources(id, 1, ep.episodeNumber || 1);
      const dl = (r.downloads || []).sort(
        (a: any, b: any) => (b.resolution || 0) - (a.resolution || 0)
      )[0];
      if (!dl?.url) throw new Error("Tidak ada sumber video");
      // try to generate streamable link
      try {
        const g: any = await api.movieboxGenerateLink(dl.url);
        const stream = g.streamUrl || g.url || g.data?.url || dl.url;
        return { url: stream, type: stream.includes(".m3u8") ? "hls" : "mp4" };
      } catch {
        return { url: dl.url, type: "mp4" };
      }
    }
    case "dramabox": {
      const ep_data: any = await api.dramaboxAllEpisode(id);
      const list = ep_data?.chapterList || ep_data?.data || ep_data || [];
      const chap = list[(ep.index || 1) - 1];
      const url = chap?.cdnList?.[0]?.cdnUrl?.[0]?.url || chap?.videoPath;
      if (!url) throw new Error("Episode tidak tersedia");
      try {
        const d: any = await api.dramaboxDecrypt(url);
        return { url: d.url || d.data?.url || url, type: "hls" };
      } catch {
        return { url, type: url.includes(".m3u8") ? "hls" : "mp4" };
      }
    }
    case "goodshort": {
      const ep_data: any = await api.goodshortAllEpisode(id);
      const list = ep_data?.chapterList || ep_data?.data || ep_data || [];
      const chap = list[(ep.index || 1) - 1];
      const url = chap?.cdnList?.[0]?.cdnUrl?.[0]?.url || chap?.videoPath;
      if (!url) throw new Error("Episode tidak tersedia");
      try {
        const d: any = await api.goodshortDecrypt(url);
        return { url: d.url || d.data?.url || url, type: "hls" };
      } catch {
        return { url, type: "hls" };
      }
    }
    case "reelshort": {
      const r: any = await api.reelshortEpisode(id, ep.episodeNumber || 1);
      const url =
        r.url || r.streamUrl || r.data?.url || r.videoUrl || r.data?.videoUrl;
      if (!url) throw new Error("Tidak ada sumber");
      return { url, type: url.includes(".m3u8") ? "hls" : "mp4" };
    }
    case "shortmax": {
      const r: any = await api.shortmaxEpisode(id, ep.episodeNumber || 1);
      const url = r.url || r.streamUrl || r.data?.url || r.videoUrl;
      if (!url) throw new Error("Tidak ada sumber");
      return { url, type: url.includes(".m3u8") ? "hls" : "mp4" };
    }
    case "pinedrama": {
      const r: any = await api.pinedramaEpisode(id, ep.episodeNumber || 1);
      const url = r.url || r.streamUrl || r.data?.url || r.videoUrl;
      if (!url) throw new Error("Tidak ada sumber");
      return { url, type: url.includes(".m3u8") ? "hls" : "mp4" };
    }
    case "freereels": {
      const url = ep.fileId;
      if (!url) throw new Error("Tidak ada sumber");
      return { url, type: url.includes(".m3u8") ? "hls" : "mp4" };
    }
    case "dramanova": {
      if (!ep.fileId) throw new Error("Tidak ada fileId");
      const r: any = await api.dramanovaGetVideo(ep.fileId);
      const url = r.url || r.streamUrl || r.data?.url || r.videoUrl;
      if (!url) throw new Error("Tidak ada sumber");
      return { url, type: url.includes(".m3u8") ? "hls" : "mp4" };
    }
    case "anime": {
      if (!ep.chapterUrlId) throw new Error("Tidak ada chapter");
      const r: any = await api.animeGetVideo(ep.chapterUrlId);
      const sources = r.data || r.sources || r.videos || r;
      const first =
        (Array.isArray(sources) && sources[0]) ||
        sources?.url ||
        sources?.streamUrl;
      const url = typeof first === "string" ? first : first?.url || first?.file;
      if (!url) throw new Error("Tidak ada sumber");
      return { url, type: url.includes(".m3u8") ? "hls" : "mp4" };
    }
  }
}
