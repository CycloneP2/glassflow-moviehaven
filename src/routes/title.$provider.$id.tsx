import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Calendar, Star, Globe2, ChevronLeft } from "lucide-react";
import type { Provider } from "@/lib/api";
import { fetchDetail } from "@/lib/streaming";

export const Route = createFileRoute("/title/$provider/$id")({
  component: TitlePage,
});

function TitlePage() {
  const { provider, id } = useParams({ from: "/title/$provider/$id" }) as {
    provider: Provider;
    id: string;
  };

  const q = useQuery({
    queryKey: ["detail", provider, id],
    queryFn: () => fetchDetail(provider, id),
    staleTime: 1000 * 60 * 5,
  });

  if (q.isLoading) {
    return (
      <div className="px-4 pt-6 sm:px-6">
        <div className="skeleton h-[280px] rounded-3xl" />
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-14 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (q.isError || !q.data) {
    return (
      <div className="px-6 py-10">
        <p className="text-destructive">
          Gagal memuat detail: {(q.error as Error)?.message || "unknown"}
        </p>
      </div>
    );
  }

  const d = q.data;

  return (
    <div>
      {/* Backdrop */}
      <div className="relative">
        <div className="relative h-[280px] overflow-hidden sm:h-[420px]">
          {d.banner || d.cover ? (
            <img
              src={d.banner || d.cover}
              alt={d.title}
              className="h-full w-full object-cover blur-md scale-110 opacity-50"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        </div>

        <div className="relative -mt-44 px-4 sm:-mt-56 sm:px-6">
          <Link
            to="/browse/$provider"
            params={{ provider }}
            className="glass-pill mb-4 inline-flex items-center gap-1 px-3 py-1.5 text-xs"
          >
            <ChevronLeft className="h-3 w-3" /> Kembali
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong flex flex-col gap-5 rounded-3xl p-5 sm:flex-row sm:p-6"
          >
            {d.cover && (
              <img
                src={d.cover}
                alt={d.title}
                className="aspect-[2/3] w-32 self-start rounded-2xl object-cover sm:w-48"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold sm:text-4xl">{d.title}</h1>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {d.rating && (
                  <span className="glass-pill inline-flex items-center gap-1 px-2.5 py-1">
                    <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                    {d.rating}
                  </span>
                )}
                {d.meta?.map((m) => (
                  <span key={m} className="glass-pill inline-flex items-center gap-1 px-2.5 py-1">
                    {m.match(/^\d{4}/) ? <Calendar className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
                    {m}
                  </span>
                ))}
                {d.genres?.map((g) => (
                  <span key={g} className="glass-pill px-2.5 py-1">
                    {g}
                  </span>
                ))}
              </div>

              {d.description && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {d.description}
                </p>
              )}

              {d.episodes[0] && (
                <Link
                  to="/watch/$provider/$id"
                  params={{ provider, id }}
                  search={{ ep: d.episodes[0].index }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  <Play className="h-4 w-4 fill-black" /> Putar episode 1
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Episodes */}
      {d.episodes.length > 0 && (
        <div className="px-4 pt-8 sm:px-6">
          <h2 className="mb-3 text-xl font-semibold sm:text-2xl">Episode</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {d.episodes.map((ep, i) => (
              <motion.div
                key={ep.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.015, 0.4) }}
              >
                <Link
                  to="/watch/$provider/$id"
                  params={{ provider, id }}
                  search={{ ep: ep.index }}
                  className="glass group block rounded-2xl px-3 py-3 text-center text-sm font-medium transition hover:bg-white/20"
                >
                  {ep.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
