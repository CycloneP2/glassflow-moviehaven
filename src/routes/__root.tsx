import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { LiquidBackground } from "@/components/LiquidBackground";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-3xl p-8 text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman yang kamu cari mungkin sudah dipindah atau tidak ada.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-3xl p-8 text-center">
        <h1 className="text-xl font-semibold">Halaman gagal dimuat</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            Coba lagi
          </button>
          <a href="/" className="glass rounded-full px-5 py-2 text-sm">Beranda</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Lumen — Nonton Film, Drama & Anime" },
      { name: "description", content: "Streaming film, drama pendek, dan anime gratis dengan tampilan iOS 26 Liquid Glass." },
      { name: "theme-color", content: "#0a0613" },
      { property: "og:title", content: "Lumen — Streaming Liquid Glass" },
      { property: "og:description", content: "Nonton film, drama, dan anime dalam UI iOS 26 Liquid Glass." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LiquidBackground />
      <Navbar />
      <main className="mx-auto max-w-7xl pb-24">
        <Outlet />
      </main>
      <footer className="px-6 pb-10 pt-6 text-center text-xs text-muted-foreground">
        Powered by{" "}
        <a href="https://api.sansekai.my.id" className="underline">
          Sansekai API
        </a>{" "}
        • UI ✦ Lumen Liquid Glass
      </footer>
    </QueryClientProvider>
  );
}
