import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { api } from "@/lib/api";

export const Route = createFileRoute("/komik/$id")({
  component: KomikDetail,
});

function KomikDetail() {
  const { id } = useParams({ from: "/komik/$id" });
  const [chapterId, setChapterId] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ["komik", "detail", id],
    queryFn: () => api.komikDetail(id),
  });
  const chapters = useQuery({
    queryKey: ["komik", "chapters", id],
    queryFn: () => api.komikChapterList(id),
  });
  const images = useQuery({
    queryKey: ["komik", "images", chapterId],
    queryFn: () => api.komikGetImage(chapterId!),
    enabled: !!chapterId,
  });

  const info = detail.data?.data || detail.data;
  const chapList = chapters.data?.data || [];
  const chapImages = images.data?.data?.chapter?.pages || images.data?.data || [];

  const currentIdx = chapList.findIndex(
    (c: any) => String(c.chapter_id || c.id) === chapterId
  );

  return (
    <div className="px-4 pt-6 sm:px-6">
      <Link
        to="/komik"
        className="glass-pill mb-3 inline-flex items-center gap-1 px-3 py-1.5 text-xs"
      >
        <ChevronLeft className="h-3 w-3" /> Komik
      </Link>

      {detail.isLoading ? (
        <div className="skeleton h-48 rounded-3xl" />
      ) : info ? (
        <div className="glass-strong flex flex-col gap-4 rounded-3xl p-5 sm:flex-row">
          <img
            src={info.cover_portrait_url || info.cover_image_url}
            alt={info.title}
            className="aspect-[2/3] w-32 rounded-2xl object-cover sm:w-44"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">{info.title}</h1>
            <p className="mt-2 line-clamp-5 text-sm text-muted-foreground sm:text-base">
              {info.description}
            </p>
          </div>
        </div>
      ) : null}

      <h2 className="mb-2 mt-6 text-lg font-semibold">Chapter</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {chapters.isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-10 rounded-xl" />
            ))
          : chapList.map((c: any) => {
              const cid = String(c.chapter_id || c.id);
              return (
                <button
                  key={cid}
                  onClick={() => {
                    setChapterId(cid);
                    setTimeout(
                      () =>
                        document
                          .getElementById("reader")
                          ?.scrollIntoView({ behavior: "smooth" }),
                      100
                    );
                  }}
                  className={`rounded-xl px-2 py-2 text-xs transition ${
                    chapterId === cid
                      ? "bg-white text-black"
                      : "glass hover:bg-white/15"
                  }`}
                >
                  Ch {c.chapter_number || c.chapter}
                </button>
              );
            })}
      </div>

      {chapterId && (
        <div id="reader" className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={() =>
                currentIdx > 0 &&
                setChapterId(
                  String(
                    chapList[currentIdx - 1].chapter_id || chapList[currentIdx - 1].id
                  )
                )
              }
              disabled={currentIdx <= 0}
              className="glass inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Sebelumnya
            </button>
            <button
              onClick={() =>
                currentIdx < chapList.length - 1 &&
                setChapterId(
                  String(
                    chapList[currentIdx + 1].chapter_id || chapList[currentIdx + 1].id
                  )
                )
              }
              disabled={currentIdx >= chapList.length - 1}
              className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-40 inline-flex items-center gap-1"
            >
              Berikutnya <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {images.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {(Array.isArray(chapImages) ? chapImages : []).map(
                (img: any, i: number) => (
                  <motion.img
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={img.image_url || img.url || img}
                    alt={`Page ${i + 1}`}
                    loading="lazy"
                    className="w-full max-w-2xl rounded-xl"
                  />
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
