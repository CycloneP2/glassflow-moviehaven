import { createFileRoute } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { z } from "zod";
import { api, PROVIDERS, type Provider } from "@/lib/api";
import { normalize, pickList } from "@/lib/normalize";
import { MovieCard } from "@/components/MovieCard";
import { Section } from "@/components/Section";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: searchSchema,
});

const SEARCHERS: Record<Provider, (q: string) => Promise<any>> = {
  moviebox: (q) => api.movieboxSearch(q),
  dramabox: (q) => api.dramaboxSearch(q),
  reelshort: (q) => api.reelshortSearch(q),
  shortmax: (q) => api.shortmaxSearch(q),
  goodshort: (q) => api.goodshortSearch(q),
  freereels: (q) => api.freereelsSearch(q),
  dramanova: (q) => api.dramanovaSearch(q),
  pinedrama: (q) => api.pinedramaSearch(q),
  anime: (q) => api.animeSearch(q),
};

function SearchPage() {
  const { q } = Route.useSearch();
  const nav = Route.useNavigate();
  const [text, setText] = useState(q || "");
  const query = (q || "").trim();

  const results = useQueries({
    queries: PROVIDERS.map((p) => ({
      queryKey: ["search", p.id, query],
      queryFn: () => SEARCHERS[p.id](query),
      enabled: !!query,
      staleTime: 1000 * 60 * 5,
      retry: 0,
    })),
  });

  return (
    <div>
      <div className="px-4 pt-6 sm:px-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Cari di semua platform</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            nav({ search: { q: text.trim() } });
          }}
          className="glass-strong mt-4 flex items-center gap-3 rounded-full px-4 py-3"
        >
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cari judul film, drama, atau anime…"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
            Cari
          </button>
        </form>
      </div>

      {!query && (
        <div className="px-4 pt-6 sm:px-6">
          <p className="text-sm text-muted-foreground">
            Mulai ketik untuk mencari di {PROVIDERS.length} platform sekaligus.
          </p>
        </div>
      )}

      {query &&
        PROVIDERS.map((p, idx) => {
          const r = results[idx];
          const items = r.data
            ? pickList(r.data).map((row: any) => normalize(p.id, row)).filter(Boolean)
            : [];
          if (r.isLoading) {
            return (
              <Section key={p.id} title={p.name} subtitle={p.tag}>
                <div className="scroll-row">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton aspect-[2/3] w-36 rounded-2xl" />
                  ))}
                </div>
              </Section>
            );
          }
          if (r.isError || items.length === 0) return null;
          return (
            <Section key={p.id} title={p.name} subtitle={`${items.length} hasil • ${p.tag}`}>
              <div className="scroll-row">
                {items.slice(0, 20).map((it, i) => (
                  <MovieCard
                    key={it!.id + i}
                    to={{ provider: p.id, id: it!.id }}
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
          );
        })}
    </div>
  );
}
