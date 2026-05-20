import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/ai")({
  component: AIChat,
});

interface Msg {
  role: "user" | "assistant";
  text: string;
}

function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Halo! Saya asisten AI Lumen. Mau rekomendasi film, drama, atau anime? Tanya saja.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const m = useMutation({
    mutationFn: (prompt: string) => api.aiChatGPT(prompt),
    onSuccess: (res: any) => {
      const text =
        res.response || res.result || res.message || res.data || JSON.stringify(res);
      setMessages((prev) => [...prev, { role: "assistant", text: String(text) }]);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 1e9, behavior: "smooth" }), 50);
    },
    onError: (err: Error) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Maaf, terjadi error: ${err.message}` },
      ]);
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || m.isPending) return;
    setMessages((p) => [...p, { role: "user", text: input.trim() }]);
    m.mutate(input.trim());
    setInput("");
  };

  return (
    <div className="px-3 pt-6 sm:px-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold sm:text-4xl">
          <span className="text-gradient">Lumen AI</span>
        </h1>
      </div>

      <div className="glass-strong flex h-[70vh] flex-col rounded-3xl">
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:text-base ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {m.isPending && (
            <div className="flex justify-start">
              <div className="glass flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Berpikir…
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={submit}
          className="border-t border-white/10 p-3 sm:p-4"
        >
          <div className="glass flex items-center gap-2 rounded-full px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya sesuatu…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              disabled={m.isPending}
            />
            <button
              type="submit"
              disabled={m.isPending || !input.trim()}
              className="rounded-full bg-primary p-2 text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
