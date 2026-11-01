"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { CopilotChat, CopilotKitCSSProperties, InputProps, UserMessageProps } from "@copilotkit/react-ui";
import { ArrowUp, Square, FileText, ListChecks, Sparkles } from "lucide-react";

type ChatUIContextValue = {
  userName: string;
  draft: string;
  setDraft: (draft: string) => void;
};

// CopilotChat instantiates Input/UserMessage itself, so shared UI state is passed via context
const ChatUIContext = createContext<ChatUIContextValue>({ userName: "", draft: "", setDraft: () => {} });

const STARTERS = [
  {
    icon: FileText,
    title: "Break down a PRD",
    prompt: "Create tasks from this PRD:\n\n",
  },
  {
    icon: ListChecks,
    title: "Plan a feature",
    prompt: "Create tasks for this feature. Include priorities and time estimates:\n\n",
  },
  {
    icon: Sparkles,
    title: "Sprint planning",
    prompt: "Split this PRD into tasks we can finish in a two-week sprint:\n\n",
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

function EmptyState() {
  const { userName, setDraft } = useContext(ChatUIContext);
  const firstName = userName.split(" ")[0];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6 text-center">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
        {getGreeting()}{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mt-2 text-gray-500">Paste a PRD and I&apos;ll turn it into prioritized, estimated tasks.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {STARTERS.map(({ icon: Icon, title, prompt }) => (
          <button
            key={title}
            type="button"
            onClick={() => setDraft(prompt)}
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <Icon className="h-4 w-4 shrink-0 text-indigo-600" />
            {title}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatComposer({ inProgress, onSend, onStop, hideStopButton }: InputProps) {
  const { draft, setDraft } = useContext(ChatUIContext);
  const { visibleMessages } = useCopilotChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEmpty = visibleMessages.length === 0;

  // Grow with the content (PRDs are long) up to a cap, then scroll
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [draft]);

  useEffect(() => {
    if (draft) textareaRef.current?.focus();
  }, [draft]);

  const send = () => {
    const text = draft.trim();
    if (!text || inProgress) return;
    onSend(text);
    setDraft("");
  };

  const showStop = inProgress && !hideStopButton;

  return (
    <div className={`w-full bg-white px-4 pb-4 pt-2 ${isEmpty ? "tf-composer-empty" : ""}`}>
      {isEmpty && <EmptyState />}
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-[26px] border border-gray-200 bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition focus-within:border-gray-300 focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={isEmpty ? "Paste your PRD here..." : "Reply to TeamFlow..."}
            className="block max-h-80 w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-6 text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="pl-2 text-xs text-gray-400">
              <kbd className="font-sans">Enter</kbd> to send · <kbd className="font-sans">Shift + Enter</kbd> for a new line
            </span>
            {showStop ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Stop generating"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={send}
                disabled={!draft.trim() || inProgress}
                aria-label="Send message"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          TeamFlow AI can make mistakes. Review generated tasks before assigning them.
        </p>
      </div>
    </div>
  );
}

const COLLAPSE_AFTER_CHARS = 600;

function ChatUserMessage({ message, ImageRenderer }: UserMessageProps) {
  const [expanded, setExpanded] = useState(false);

  if (message && "image" in message && message.image) {
    return (
      <div className="copilotKitMessage copilotKitUserMessage">
        <ImageRenderer image={message.image} content={message.content} />
      </div>
    );
  }

  const content = typeof message?.content === "string" ? message.content : "";
  // Pasted PRDs can be thousands of characters; collapse them like Claude/ChatGPT do
  const isLong = content.length > COLLAPSE_AFTER_CHARS;

  return (
    <div className="copilotKitMessage copilotKitUserMessage">
      <div className={isLong && !expanded ? "line-clamp-[8]" : undefined}>{content}</div>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-sm font-medium text-gray-500 hover:text-gray-800"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

export default function AssistantChat({
  userName,
  userId,
  themeColor,
}: {
  userName: string;
  userId: string;
  themeColor: string;
}) {
  const [draft, setDraft] = useState("");

  return (
    <ChatUIContext.Provider value={{ userName, draft, setDraft }}>
      <main
        className="h-[calc(100vh-4rem)] bg-white"
        style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}
      >
        <CopilotChat
          className="teamflow-chat h-full"
          suggestions="manual"
          Input={ChatComposer}
          UserMessage={ChatUserMessage}
          labels={{
            title: "AI Task Creation Assistant",
            initial: "",
          }}
          instructions={`You will create tasks from PRD text provided by user having userId ${userId}. Always help users organize their work efficiently.`}
        />
      </main>
    </ChatUIContext.Provider>
  );
}
