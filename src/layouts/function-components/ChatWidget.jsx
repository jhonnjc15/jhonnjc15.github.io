import React, { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "paqari-rag-chat-history";
const ENDPOINT =
  import.meta.env.PUBLIC_RAG_ENDPOINT ||
  "http://127.0.0.1:8000/api/v1/rag/query";

const initialMessages = [];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [locale, setLocale] = useState("es");
  const endRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setLocale(window.navigator?.language || "es");

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (err) {
        console.error("Failed to parse chat history", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!isOpen || !endRef.current) return;
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const isSpanish = locale?.toLowerCase().startsWith("es");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    const nextHistory = [...messages, userMessage];

    setMessages(nextHistory);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          history: nextHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        role: "assistant",
        content: data.answer || "No encontramos una respuesta en este momento.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat request failed", err);
      const fallbackMessage = {
        role: "assistant",
        content: "Ups, algo salió mal. Inténtalo nuevamente en un momento.",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      setError("No pudimos obtener respuesta. Por favor, vuelve a intentarlo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleDownload = () => {
    if (!messages.length) return;

    const transcript = messages
      .map((message) => {
        const author = message.role === "assistant" ? "PaqariBot" : "Usuario";
        return `${author}: ${message.content}`;
      })
      .join("\n\n");

    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "paqari-chat.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleHide = () => setIsOpen(false);

  const renderMessage = (message, index) => {
    const isUser = message.role === "user";
    const alignment = isUser ? "justify-end" : "justify-start";
    const bubbleStyles = isUser
      ? "bg-paqariYellow text-gray-900 rounded-2xl rounded-br-md"
      : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-md";

    return (
      <div
        key={`${message.role}-${index}-${message.content.slice(0, 8)}`}
        className={`flex ${alignment}`}
      >
        {!isUser && (
          <div className="mr-2 flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-paqariGreen text-white shadow-sm">
              <span className="text-xs font-semibold">P</span>
            </div>
            <div>
              <p className="text-xs font-semibold leading-tight">PaqariBot</p>
              <div className={`mt-1 max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm ${bubbleStyles}`}>
                {message.content}
              </div>
            </div>
          </div>
        )}
        {isUser && (
          <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm ${bubbleStyles}`}>
            {message.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-8 z-50 flex flex-col items-end gap-3">
      <div
        aria-hidden={!isOpen}
        className={`w-[320px] sm:w-[380px] rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Paqari AI</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Chatbot RAG</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Descargar conversación"
              onClick={handleDownload}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-paqariYellow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-3.5-3.5M12 16l3.5-3.5M6 20h12" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Limpiar chat"
              onClick={handleClear}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-paqariYellow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6m4-6v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Ocultar chat"
              onClick={handleHide}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-paqariYellow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-h-[420px] min-h-[260px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          {messages.length === 0 && !isLoading && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Escribe tu primera pregunta para comenzar a conversar.
            </div>
          )}
          {messages.map((message, index) => renderMessage(message, index))}
          {isLoading && (
            <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <span className="mt-1 inline-flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse [animation-delay:120ms]"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse [animation-delay:240ms]"></span>
              </span>
              <span>El bot está escribiendo…</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {error && (
          <div className="px-4 pb-1 text-xs text-red-500">{error}</div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={isSpanish ? "Escribe tu mensaje..." : "Type your message..."}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-paqariYellow focus:border-transparent px-3 py-3"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-paqariGreen text-white px-3 py-3 text-sm font-semibold shadow-lg transition hover:bg-paqariGreenDark disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h13M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            {isSpanish
              ? "Paqari puede equivocarse. Verifica las respuestas."
              : "Paqari can make mistakes. Double-check replies."}
          </p>
        </form>
      </div>

      <button
        type="button"
        aria-label="Abrir chat con el bot"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-center h-14 w-14 rounded-full bg-paqariGreen text-white shadow-xl transition transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-paqariYellow ${
          isOpen ? "translate-y-1 opacity-0 pointer-events-none" : "hover:scale-105"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="w-7 h-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h6m6 0c0 3.314-3.582 6-8 6-.97 0-1.903-.116-2.776-.329L4 19l1.425-2.85C4.527 14.907 4 13.511 4 12c0-3.314 3.582-6 8-6s8 2.686 8 6z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatWidget;
