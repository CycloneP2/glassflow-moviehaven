import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import type { Provider } from "@/lib/api";

interface Props {
  to: { provider: Provider; id: string };
  title: string;
  cover?: string;
  badge?: string;
  rating?: string | number;
  meta?: string;
  index?: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-32 sm:w-36",
  md: "w-40 sm:w-48",
  lg: "w-48 sm:w-56",
};

export function MovieCard({ to, title, cover, badge, rating, meta, index = 0, size = "md" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.3), ease: "easeOut" }}
      className={sizeMap[size]}
    >
      <Link
        to="/title/$provider/$id"
        params={{ provider: to.provider, id: to.id }}
        className="group block"
      >
        <div className="glass relative aspect-[2/3] overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_oklch(0.72_0.21_305/0.35)]">
          {cover ? (
            <img
              src={cover}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0")}
            />
          ) : (
            <div className="skeleton h-full w-full" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2.5">
            {rating && (
              <div className="glass-pill mb-1 inline-flex items-center gap-1 px-2 py-0.5 text-[10px]">
                <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                {rating}
              </div>
            )}
          </div>
          {badge && (
            <div className="glass-pill absolute right-2 top-2 px-2 py-0.5 text-[10px] uppercase tracking-wider">
              {badge}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="glass-strong rounded-full p-3">
              <Play className="h-5 w-5 fill-white text-white" />
            </div>
          </div>
        </div>
        <div className="mt-2 px-0.5">
          <h3 className="line-clamp-1 text-sm font-medium leading-tight">{title}</h3>
          {meta && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{meta}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
