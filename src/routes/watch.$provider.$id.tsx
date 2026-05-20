import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Provider } from "@/lib/api";
import { fetchDetail, resolveStream } from "@/lib/streaming";
import { VideoPlayer } from "@/components/VideoPlayer";

const searchSchema = z.object({ ep: z.number().optional() });

export const Route = createFileRoute("/watch/$provider/$id")({
  component: WatchPage,
  validateSearch: searchSchema,
});

function WatchPage() {
  const { provider, id } = useParams({ from: "/watch/$provider/$id" }) as {
    provider: Provider;
    id: string;
  };
  const { ep = 1 } = Route.useSearch();

  const detailQ = useQuery({
    queryKey: ["detail", provider, id],
    queryFn: () => fetchDetail(provider, id),
    staleTime: 1000 * 60 * 5,
  });

  const episode = detailQ.data?.episodes.find((e) => e.index === ep) || detailQ.data?.episodes[0];

  const streamQ = useQuery({
    queryKey: ["stream", provider, id, episode?.key],
    queryFn: () => resolveStream(provider, id, episode!),
    enabled: !!episode,
    retry: 0,
    staleTime: 1000 * 60,
  });

  const prev = detailQ.data?.episodes.find((e) => e.index === ep - 1);
  const next = detailQ.data?.episodes.find((e) => e.index === ep + 1);

  return (
    <div className="px-3 pt-4 sm:px-6">
      <Link
        to="/title/$provider/$id"
        params={{ provider, id }}
        className="glass-pill mb-3 inline-flex items-center gap-1 px-3 py-1.5 text-xs"
      >
        <ChevronLeft className="h-3 w-3" /> Detail
      </Link>

      {streamQ.isLoading || !episode ? (
        <div className="skeleton aspect-video w-full rounded-3xl" />
      ) : streamQ.isError ? (
        <div className="glass-strong flex aspect-video items-center justify-center rounded-3xl p-6 text-center">
          <p className="text-sm text-destructive">
            Tidak bisa memutar episode: {(streamQ.error as Error).message}
          </p>
        </div>
      ) : (
        <VideoPlayer src={streamQ.data!.url} poster={detailQ.data?.cover} />
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">{detailQ.data?.title}</h1>
          <p className="text-sm text-muted-foreground">{episode?.label}</p>
        </div>
        <div className="flex gap-2">
          {prev && (
            <Link
              to="/watch/$provider/$id"
              params={{ provider, id }}
              search={{ ep: prev.index }}
              className="glass inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> {prev.label}
            </Link>
          )}
          {next && (
            <Link
              to="/watch/$provider/$id"
              params={{ provider, id }}
              search={{ ep: next.index }}
              className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground inline-flex items-center gap-1"
            >
              {next.label} <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {detailQ.data && detailQ.data.episodes.length > 1 && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
            Episode lainnya
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-10">
            {detailQ.data.episodes.map((e) => (
              <Link
                key={e.key}
                to="/watch/$provider/$id"
                params={{ provider, id }}
                search={{ ep: e.index }}
                className={`rounded-xl px-2 py-2 text-center text-xs transition ${
                  e.index === ep
                    ? "bg-white text-black"
                    : "glass hover:bg-white/15"
                }`}
              >
                {e.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
