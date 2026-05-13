"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  Crown,
  KeyRound,
  Languages,
  Menu,
  Paperclip,
  Palette,
  Send,
  User,
  X,
} from "lucide-react";
import { Sidebar, type ChatThread } from "@/components/Sidebar";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const initialThreads: ChatThread[] = [
  { id: "1", title: "Bienvenue sur Congo IA" },
  { id: "2", title: "Idees de startup IA" },
  { id: "3", title: "Resume d'un document" },
];

const initialMessages: Message[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Mbote ! Je suis **Congo IA**. Pose-moi une question, demande-moi du code, ou envoie-moi une idee a structurer.",
  },
];

export default function ChatPage() {
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState("1");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"account" | "settings" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId),
    [threads, activeThreadId]
  );

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        throw new Error("Erreur API");
      }

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message ?? "Je n'ai pas pu generer de reponse.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Impossible de contacter le modele IA pour le moment. Verifie la cle API dans les variables d'environnement.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function startNewChat() {
    const newThread: ChatThread = {
      id: crypto.randomUUID(),
      title: "Nouvelle discussion",
    };

    setThreads((current) => [newThread, ...current]);
    setActiveThreadId(newThread.id);
    setMessages(initialMessages);
    setIsSidebarOpen(false);
  }

  return (
    <main className="relative flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#064e3b_0%,transparent_32%),radial-gradient(circle_at_bottom_right,#1e1b4b_0%,transparent_30%),#05070d]">
      <div className="hidden md:block">
        <Sidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onNewChat={startNewChat}
          onSelectThread={setActiveThreadId}
          onOpenSettings={() => setActiveModal("settings")}
          onOpenAccount={() => setActiveModal("account")}
        />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fermer le menu"
          />
          <div className="relative h-full w-80 max-w-[86vw]">
            <Sidebar
              threads={threads}
              activeThreadId={activeThreadId}
              onNewChat={startNewChat}
              onSelectThread={(id) => {
                setActiveThreadId(id);
                setIsSidebarOpen(false);
              }}
              onOpenSettings={() => setActiveModal("settings")}
              onOpenAccount={() => setActiveModal("account")}
            />
          </div>
        </div>
      )}

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/8 text-white md:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-base font-semibold md:text-lg">Congo IA</h1>
              <p className="text-xs text-emerald-200/70">
                Modele : {process.env.NEXT_PUBLIC_AI_MODEL ?? "Llama 3"}
              </p>
            </div>
          </div>

          <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
            {activeThread?.title}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-5 pb-28">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-400/15 ring-1 ring-emerald-300/20">
                    <Bot className="h-4 w-4 text-emerald-200" />
                  </div>
                )}

                <div
                  className={`prose prose-invert max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/40 ${
                    message.role === "user"
                      ? "bg-emerald-400 text-emerald-950 prose-strong:text-emerald-950"
                      : "border border-white/10 bg-white/[0.07] text-white/85 backdrop-blur-xl"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>

                {message.role === "user" && (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
                    <User className="h-4 w-4 text-white/80" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="ml-12 text-sm text-white/45">
                Congo IA reflechit...
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 md:left-72">
          <div className="mx-auto max-w-3xl px-4 pb-4">
            <div className="pointer-events-auto flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.08] p-2 shadow-2xl backdrop-blur-2xl">
              <button
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Ajouter une piece jointe"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                placeholder="Ecris ton message..."
                className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/35"
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-400 text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Envoyer"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {activeModal && (
        <Modal onClose={() => setActiveModal(null)}>
          {activeModal === "account" ? <AccountPanel /> : <SettingsPanel />}
        </Modal>
      )}
    </main>
  );
}

function Modal({
  children,
  onClose,
}: Readonly<{
  children: React.ReactNode;
  onClose: () => void;
}>) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b0f19]/95 p-5 shadow-2xl">
        <div className="mb-4 flex justify-end">
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/8 text-white/70 hover:text-white"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AccountPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Crown className="h-5 w-5 text-emerald-300" />
        <h2 className="text-lg font-semibold">Mon Compte</h2>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
        <p className="text-sm text-white/45">Nom d'utilisateur</p>
        <p className="font-medium">Utilisateur Congo IA</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
        <p className="text-sm text-white/45">Email</p>
        <p className="font-medium">user@congoia.com</p>
      </div>

      <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4">
        <p className="text-sm text-emerald-100/70">Abonnement</p>
        <p className="font-semibold text-emerald-100">Gratuit</p>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Palette className="h-5 w-5 text-emerald-300" />
        <h2 className="text-lg font-semibold">Parametres</h2>
      </div>

      <label className="block space-y-2">
        <span className="flex items-center gap-2 text-sm text-white/65">
          <Languages className="h-4 w-4" />
          Langue
        </span>
        <select className="w-full rounded-xl border border-white/10 bg-[#101622] px-3 py-3 text-sm outline-none">
          <option>Francais</option>
          <option>Lingala</option>
          <option>Swahili</option>
        </select>
      </label>

      <label className="block space-y-2">
        <span className="flex items-center gap-2 text-sm text-white/65">
          <Palette className="h-4 w-4" />
          Theme
        </span>
        <select className="w-full rounded-xl border border-white/10 bg-[#101622] px-3 py-3 text-sm outline-none">
          <option>Dark Mode</option>
          <option>System</option>
        </select>
      </label>

      <label className="block space-y-2">
        <span className="flex items-center gap-2 text-sm text-white/65">
          <KeyRound className="h-4 w-4" />
          Cle API
        </span>
        <input
          type="password"
          placeholder="sk-..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3 text-sm outline-none placeholder:text-white/30"
        />
      </label>
    </div>
  );
}
