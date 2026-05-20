import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/komik")({
  component: KomikIndex,
});

function KomikIndex() {
  const popular = useQuery({
    queryKey: ["komik", "popular"],
    queryFn: () => api.komikPopular(1),
    staleTime: 1000 * 60 * 10,
  });
  const latest = useQuery({
    queryKey: ["komik", "latest", "manga"],
    queryFn: () => api.komikLatest("manga"),
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div>
      <div className="px-4 pt-6 sm:px-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold sm:text-4xl">
            <span className="text-gradient">Komik</span>
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Baca manga, manhwa, dan manhua.
        </p>
      </div>

      <KomikRow title="Populer" data={popular.data?.data} loading={popular.isLoading} />
      <KomikRow title="Terbaru" data={latest.data?.data} loading={latest.isLoading} />
    </div>
  );
}

function KomikRow({
  title,
  data,
  loading,
}: {
  title: string;
  data?: any[];
  loading: boolean;
}) {
  return (
    <Section title={title}>
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton aspect-[2/3] rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {(data || []).map((k: any, i: number) => (
            <motion.div
              key={k.book_id || k.id || i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
            >
              <Link
                to="/komik/$id"
                params={{ id: String(k.book_id || k.id) }}
                className="group block"
              >
                <div className="glass relative aspect-[2/3] overflow-hidden rounded-2xl transition group-hover:-translate-y-1">
                  <img
                    src={k.cover_portrait_url || k.cover_image_url}
                    alt={k.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-2 line-clamp-1 text-sm font-medium">
                  {k.title || k.alternative_title}
                </h3>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {k.country_id}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
}
