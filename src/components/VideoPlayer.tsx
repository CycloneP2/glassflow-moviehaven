import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Loader2 } from "lucide-react";

export function VideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;
    setLoading(true);
    setErr(null);
    let hls: Hls | null = null;
    const isM3u8 = src.includes(".m3u8");

    if (isM3u8 && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => setLoading(false));
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) setErr("Gagal memuat video");
      });
    } else {
      video.src = src;
      const onReady = () => setLoading(false);
      video.addEventListener("loadeddata", onReady);
      video.addEventListener("error", () => setErr("Gagal memuat video"));
      return () => {
        video.removeEventListener("loadeddata", onReady);
      };
    }
    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <div className="glass relative aspect-video w-full overflow-hidden rounded-3xl">
      <video
        ref={ref}
        poster={poster}
        controls
        playsInline
        className="h-full w-full bg-black"
      />
      {loading && !err && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-white/80" />
        </div>
      )}
      {err && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-center">
          <p className="text-sm text-white/80">{err}</p>
        </div>
      )}
    </div>
  );
}
