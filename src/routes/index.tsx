import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Sparkles, TrendingUp, ChevronRight } from "lucide-react";
import { api, PROVIDERS } from "@/lib/api";
import { normalize, pickList } from "@/lib/normalize";
import { MovieCard } from "@/components/MovieCard";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Lumen — Streaming Film, Drama & Anime" },
      { name: "description", content: "Tonton film, drama pendek, dan anime dengan UI iOS 26 Liquid Glass." },
    ],
  }),
});

function Home() {
  const homepage = useQuery({
    queryKey: ["moviebox", "homepage"],
    queryFn: () => api.movieboxHomepage(),
    staleTime: 1000 * 60 * 5,
  });

  const trending = useQuery({
    queryKey: ["moviebox", "trending"],
    queryFn: () => api.movieboxTrending(1),
    staleTime: 1000 * 60 * 5,
  });

  const dramabox = useQuery({
    queryKey: ["dramabox", "trending"],
    queryFn: () => api.dramaboxTrending(),
    staleTime: 1000 * 60 * 5,
  });

  const animeLatest = useQuery({
    queryKey: ["anime", "latest"],
    queryFn: () => api.animeLatest(),
    staleTime: 1000 * 60 * 5,
  });

  const shortmax = useQuery({
    queryKey: ["shortmax", "latest"],
    queryFn: () => api.shortmaxLatest(),
    staleTime: 1000 * 60 * 5,
  });

  // Hero banners from MovieBox homepage operating list
  const banners: any[] =
    homepage.data?.operatingList?.find((o: any) => o.type === "BANNER")?.banner?.items ||
    pickList(trending.data).slice(0, 5);

  return (
    <div>
      {/* HERO */}
      <Hero items={banners} />

      <Section
        title="Trending sekarang"
        subtitle="Yang sedang ramai ditonton"
        action={
          <Link
            to="/browse/$provider"
            params={{ provider: "moviebox" }}
            className="glass-pill inline-flex items-center gap-1 px-3 py-1.5 text-xs"
          >
            Lihat semua <ChevronRight className="h-3 w-3" />
          </Link>
        }
      >
        <div className="scroll-row">
          {trending.isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[2/3] w-40 rounded-2xl sm:w-48" />
              ))
            : pickList(trending.data)
                .map((r: any) => normalize("moviebox", r))
                .filter(Boolean)
                .map((it, i) => (
                  <MovieCard
                    key={it!.id + i}
                    to={{ provider: "moviebox", id: it!.id }}
                    title={it!.title}
                    cover={it!.cover}
                    rating={it!.rating}
                    meta={it!.meta}
                    badge={it!.badge}
                    index={i}
                  />
                ))}
        </div>
      </Section>

      <ProviderShortcuts />

      <Section
        title="Drama pendek populer"
        subtitle="Dari DramaBox"
        action={
          <Link
            to="/browse/$provider"
            params={{ provider: "dramabox" }}
            className="glass-pill inline-flex items-center gap-1 px-3 py-1.5 text-xs"
          >
            Semua <ChevronRight className="h-3 w-3" />
          </Link>
        }
      >
        <div className="scroll-row">
          {dramabox.isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[2/3] w-40 rounded-2xl" />
              ))
            : pickList(dramabox.data)
                .map((r: any) => normalize("dramabox", r))
                .filter(Boolean)
                .map((it, i) => (
                  <MovieCard
                    key={it!.id + i}
                    to={{ provider: "dramabox", id: it!.id }}
                    title={it!.title}
                    cover={it!.cover}
                    meta={it!.meta}
                    index={i}
                  />
                ))}
        </div>
      </Section>

      <Section
        title="Anime terbaru"
        subtitle="Update episode terkini"
        action={
          <Link
            to="/browse/$provider"
            params={{ provider: "anime" }}
            className="glass-pill inline-flex items-center gap-1 px-3 py-1.5 text-xs"
          >
            Semua <ChevronRight className="h-3 w-3" />
          </Link>
        }
      >
        <div className="scroll-row">
          {animeLatest.isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[2/3] w-40 rounded-2xl" />
              ))
            : pickList(animeLatest.data)
                .map((r: any) => normalize("anime", r))
                .filter(Boolean)
                .map((it, i) => (
                  <MovieCard
                    key={it!.id + i}
                    to={{ provider: "anime", id: it!.id }}
                    title={it!.title}
                    cover={it!.cover}
                    meta={it!.meta}
                    index={i}
                  />
                ))}
        </div>
      </Section>

      <Section title="Short drama" subtitle="ShortMax pilihan">
        <div className="scroll-row">
          {shortmax.isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[2/3] w-40 rounded-2xl" />
              ))
            : pickList(shortmax.data)
                .map((r: any) => normalize("shortmax", r))
                .filter(Boolean)
                .slice(0, 18)
                .map((it, i) => (
                  <MovieCard
                    key={it!.id + i}
                    to={{ provider: "shortmax", id: it!.id }}
                    title={it!.title}
                    cover={it!.cover}
                    meta={it!.meta}
                    badge={it!.badge}
                    index={i}
                  />
                ))}
        </div>
      </Section>
    </div>
  );
}

function Hero({ items }: { items: any[] }) {
  const featured = items?.[0];
  if (!featured) {
    return (
      <div className="mx-4 mt-4 sm:mx-6">
        <div className="skeleton h-[420px] rounded-3xl" />
      </div>
    );
  }
  const cover =
    featured?.subject?.cover?.url ||
    featured?.image?.url ||
    featured?.cover?.url;
  const title = featured?.title || featured?.subject?.title;
  const desc = featured?.subject?.description;
  const id = featured?.subjectId || featured?.subject?.subjectId;
  const rating = featured?.subject?.imdbRatingValue;
  const genre = featured?.subject?.genre;

  return (
    <div className="px-3 pt-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="relative aspect-[16/10] sm:aspect-[21/9]">
          {cover && (
            <img
              src={cover}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-end p-5 sm:p-10">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-pill mb-3 inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-widest"
              >
                <Sparkles className="h-3 w-3" /> Sorotan utama
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="text-3xl font-bold leading-tight sm:text-5xl"
              >
                {title}
              </motion.h1>
              {(rating || genre) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 }}
                  className="mt-3 flex flex-wrap gap-2 text-xs text-white/80"
                >
                  {rating && (
                    <span className="glass-pill px-2.5 py-1">⭐ {rating}</span>
                  )}
                  {genre &&
                    genre
                      .split(",")
                      .slice(0, 3)
                      .map((g: string) => (
                        <span key={g} className="glass-pill px-2.5 py-1">
                          {g.trim()}
                        </span>
                      ))}
                </motion.div>
              )}
              {desc && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44 }}
                  className="mt-3 line-clamp-2 max-w-md text-sm text-white/75 sm:text-base"
                >
                  {desc}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52 }}
                className="mt-5 flex gap-2"
              >
                {id && (
                  <Link
                    to="/title/$provider/$id"
                    params={{ provider: "moviebox", id: String(id) }}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
                  >
                    <Play className="h-4 w-4 fill-black" /> Tonton sekarang
                  </Link>
                )}
                <Link
                  to="/browse/$provider"
                  params={{ provider: "moviebox" }}
                  className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                >
                  <TrendingUp className="h-4 w-4" /> Jelajah
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProviderShortcuts() {
  return (
    <Section title="Jelajahi sumber" subtitle="Pilih dari berbagai platform">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PROVIDERS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              to="/browse/$provider"
              params={{ provider: p.id }}
              className="glass group relative block overflow-hidden rounded-2xl p-4 transition hover:bg-white/10"
            >
              <div
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-40 blur-xl transition group-hover:opacity-70"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.21 305), oklch(0.78 0.18 200))",
                }}
              />
              <div className="relative">
                <p className="text-xs text-muted-foreground">{p.tag}</p>
                <p className="mt-1 text-lg font-semibold">{p.name}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                  Jelajahi <ChevronRight className="h-3 w-3" />
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
