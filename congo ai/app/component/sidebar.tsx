"use client";

import {
  MessageCircle,
  Plus,
  Settings,
  Sparkles,
  UserCircle,
} from "lucide-react";

export type ChatThread = {
  id: string;
  title: string;
};

type SidebarProps = {
  threads: ChatThread[];
  activeThreadId: string;
  onNewChat: () => void;
  onSelectThread: (id: string) => void;
  onOpenSettings: () => void;
  onOpenAccount: () => void;
};

export function Sidebar({
  threads,
  activeThreadId,
  onNewChat,
  onSelectThread,
  onOpenSettings,
  onOpenAccount,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-white/[0.04] px-3 py-4 backdrop-blur-2xl md:w-72">
      <div className="mb-5 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15 ring-1 ring-emerald-300/30">
          <Sparkles className="h-5 w-5 text-emerald-300" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide">Congo IA</p>
          <p className="text-xs text-white/45">Assistant intelligent</p>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="mb-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
      >
        <Plus className="h-4 w-4" />
        Nouvelle Discussion
      </button>

      <div className="flex-1 overflow-y-auto pr-1">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-white/35">
          Historique
        </p>

        <div className="space-y-1">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => onSelectThread(thread.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                activeThreadId === thread.id
                  ? "bg-white/12 text-white ring-1 ring-white/10"
                  : "text-white/65 hover:bg-white/8 hover:text-white"
              }`}
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span className="truncate">{thread.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
        <button
          onClick={onOpenSettings}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/8 hover:text-white"
        >
          <Settings className="h-4 w-4" />
          Paramètres
        </button>

        <button
          onClick={onOpenAccount}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/8 hover:text-white"
        >
          <UserCircle className="h-4 w-4" />
          Mon Compte
        </button>
      </div>
    </aside>
  );
}
