import React, { useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";

const STORAGE_KEY = "paqari-rag-chat-history";
const ENDPOINT =
  import.meta.env.PUBLIC_RAG_ENDPOINT ||
  "http://127.0.0.1:8000/api/v1/rag/query";

marked.setOptions({ gfm: true, breaks: true });

const defaultCopy = {
  locale: "es",
  headerTitle: "Paqari AI",
  headerSubtitle: "Chatbot RAG",
  greeting: "Hola 👋",
  greetingQuestion: "¿Cómo te puedo ayudar hoy?",
  description: "Elige una de las preguntas rápidas o escribe tu consulta para comenzar.",
  emptyState: "Escribe tu primera pregunta para comenzar a conversar.",
  placeholder: "Escribe tu mensaje...",
  disclaimer: "Paqari puede equivocarse. Verifica las respuestas.",
  loaderLabel: "El bot está escribiendo…",
  quickPrompts: [
    {
      label: "Quiero migrar a Hostinger",
      message:
        "¡Hola! Quiero migrar a Hostinger. ¿Puedes ayudarme a planificar la migración paso a paso?",
    },
    {
      label: "Quiero crear un sitio web",
      message:
        "¡Hola! Quiero crear un sitio web. ¿Puedes guiarme sobre la mejor forma de hacerlo y recomendarme un plan de hosting?",
    },
    {
      label: "Elegir plan adecuado",
      message:
        "Necesito ayuda para elegir el plan de hosting adecuado. ¿Qué me recomiendas según mi tipo de proyecto?",
    },
  ],
  actions: {
    download: {
      title: "Descargar conversación",
      message: "¿Quieres descargar el historial del chat en un archivo de texto?",
      confirm: "Descargar",
      cancel: "Cancelar",
    },
    clear: {
      title: "Borrar conversación",
      message: "¿Seguro que deseas borrar el historial del chat? Esta acción no se puede deshacer.",
      confirm: "Borrar",
      cancel: "Cancelar",
    },
  },
};

const ChatWidget = ({ chatContent }) => {
  const copy = useMemo(() => {
    const actions = {
      download: {
        ...defaultCopy.actions.download,
        ...chatContent?.actions?.download,
      },
      clear: {
        ...defaultCopy.actions.clear,
        ...chatContent?.actions?.clear,
      },
    };

    return {
      ...defaultCopy,
      ...chatContent,
      actions,
      quickPrompts:
        chatContent?.quickPrompts?.length > 0
          ? chatContent.quickPrompts
          : defaultCopy.quickPrompts,
    };
  }, [chatContent]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [locale, setLocale] = useState(copy.locale || "es");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isPreviewingPrompt, setIsPreviewingPrompt] = useState(false);

  const endRef = useRef(null);
  const isMountedRef = useRef(false);
  const previousInputRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setLocale(copy.locale || window.navigator?.language || "es");

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (err) {
        console.error("Failed to parse chat history", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copy.locale]);

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

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const className = "chat-open";
    if (isOpen) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }

    return () => document.body.classList.remove(className);
  }, [isOpen]);

  const isSpanish = (locale || copy.locale || "es").toLowerCase().startsWith("es");

  const renderMarkdown = (content) => ({
    __html: marked.parse(content || ""),
  });

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    const nextHistory = [...messages, userMessage];

    setMessages(nextHistory);
    setInput("");
    setIsPreviewingPrompt(false);
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
        content:
          data.answer ||
          (isSpanish
            ? "No encontramos una respuesta en este momento."
            : "We could not find an answer right now."),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat request failed", err);
      const fallbackMessage = {
        role: "assistant",
        content: isSpanish
          ? "Ups, algo salió mal. Inténtalo nuevamente en un momento."
          : "Oops, something went wrong. Please try again soon.",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      setError(
        isSpanish
          ? "No pudimos obtener respuesta. Por favor, vuelve a intentarlo."
          : "We couldn't get a response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
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
        const author = message.role === "assistant" ? "PaqariBot" : isSpanish ? "Usuario" : "User";
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

  const openConfirmation = (type) => {
    if (!copy.actions?.[type]) return;
    setConfirmAction({ type, ...copy.actions[type] });
  };

  const confirmAndExecute = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "download") {
      handleDownload();
    }
    if (confirmAction.type === "clear") {
      handleClear();
    }
    setConfirmAction(null);
  };

  const cancelConfirmation = () => setConfirmAction(null);

  const handleQuickPrompt = (prompt) => {
    setInput(prompt.message);
    sendMessage(prompt.message);
  };

  const handlePromptHover = (prompt) => {
    previousInputRef.current = input;
    setInput(prompt.message);
    setIsPreviewingPrompt(true);
  };

  const handlePromptLeave = () => {
    if (isPreviewingPrompt) {
      setInput(previousInputRef.current);
      setIsPreviewingPrompt(false);
    }
  };

  const handleHide = () => setIsOpen(false);

  const renderMessage = (message, index) => {
    const isUser = message.role === "user";
    const alignment = isUser ? "justify-end" : "justify-start";
    const bubbleStyles = isUser
      ? "bg-paqariYellow text-gray-900 rounded-2xl rounded-br-md"
      : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-md";

    if (isUser) {
      return (
        <div
          key={`${message.role}-${index}-${message.content.slice(0, 8)}`}
          className={`flex ${alignment}`}
        >
          <div className="flex flex-col items-end max-w-[80%] ml-auto">
            <p className="mb-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
              {isSpanish ? "Tú" : "You"}
            </p>
            <div className={`w-full px-4 py-3 text-sm leading-relaxed shadow-sm ${bubbleStyles}`}>
              <p className="whitespace-pre-wrap text-right">{message.content}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={`${message.role}-${index}-${message.content.slice(0, 8)}`}
        className={`flex ${alignment}`}
      >
        <div className="mr-2 flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
          <div className="mt-1 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700 shadow-sm">
            <img
              src="/images/hoja_rayo_logo.ico"
              alt="PaqariBot"
              className="h-6 w-6 object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-semibold leading-tight">PaqariBot</p>
            <div className={`mt-1 max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm ${bubbleStyles}`}>
              <div
                className="prose prose-sm prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 dark:prose-invert"
                dangerouslySetInnerHTML={renderMarkdown(message.content)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const quickPromptButtons = copy.quickPrompts.map((prompt, idx) => (
    <button
      key={`${prompt.label}-${idx}`}
      type="button"
      onClick={() => handleQuickPrompt(prompt)}
      onMouseEnter={() => handlePromptHover(prompt)}
      onMouseLeave={handlePromptLeave}
      className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:border-paqariGreen hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
    >
      <span>{prompt.label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  ));

    return (
      <div className="pointer-events-none fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 z-[70] sm:z-[70] flex flex-col items-end gap-3">
        <div
          aria-hidden={!isOpen}
          className={`relative sm:mr-16 flex h-[70vh] max-h-[640px] w-full sm:h-[560px] sm:w-[420px] flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl transition-all duration-300 ease-out dark:border-gray-700 dark:bg-gray-900 origin-bottom-right ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{copy.headerTitle}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{copy.headerSubtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={copy.actions.download.title}
                title={copy.actions.download.title}
                onClick={() => openConfirmation("download")}
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
                aria-label={copy.actions.clear.title}
                title={copy.actions.clear.title}
                onClick={() => openConfirmation("clear")}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16m-9-3h2a1 1 0 011 1v2H9V5a1 1 0 011-1zm8 3l-.8 12.01A2 2 0 0116.207 21H7.793a2 2 0 01-1.993-1.99L5 7"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label={isSpanish ? "Ocultar chat" : "Hide chat"}
                title={isSpanish ? "Ocultar chat" : "Hide chat"}
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

          {confirmAction && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.6"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{confirmAction.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{confirmAction.message}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={confirmAndExecute}
                    className="inline-flex items-center justify-center rounded-lg bg-paqariYellow px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-paqariYellowHover focus:outline-none focus:ring-2 focus:ring-paqariYellow"
                  >
                    {confirmAction.confirm}
                  </button>
                  <button
                    type="button"
                    onClick={cancelConfirmation}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {confirmAction.cancel}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="relative flex-1 overflow-hidden">
            <div className="max-h-full min-h-[320px] overflow-y-auto space-y-4 bg-gradient-to-b from-white to-gray-50 p-4 text-[13px] dark:from-gray-900 dark:to-gray-950">
              {messages.length === 0 && !isLoading && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-gray-200 shadow-sm dark:bg-gray-800 dark:ring-gray-700">
                      <img
                        src="/images/hoja_rayo_logo.ico"
                        alt="PaqariBot"
                        className="h-7 w-7 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{copy.greeting}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{copy.greetingQuestion}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{copy.description}</p>
                  <div className="mt-4 space-y-2">{quickPromptButtons}</div>
                </div>
              )}

              {messages.length === 0 && isLoading && (
                <div className="text-center text-xs text-gray-500 dark:text-gray-400">{copy.emptyState}</div>
              )}

              {messages.map((message, index) => renderMessage(message, index))}

              {isLoading && (
                <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="mt-1 inline-flex gap-1">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-300"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-300 [animation-delay:120ms]"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-300 [animation-delay:240ms]"></span>
                  </span>
                  <span>{copy.loaderLabel}</span>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </div>

          {error && <div className="px-4 pb-1 text-xs text-red-500">{error}</div>}

          <form
            onSubmit={handleSubmit}
            className="backdrop-blur p-3 border-t border-gray-200 bg-white/90 dark:border-gray-700 dark:bg-gray-900/90"
          >
            <div className="flex items-start gap-2">
              <textarea
                rows={4}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit(event);
                  }
                }}
                placeholder={copy.placeholder}
                className="min-h-[96px] flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-paqariYellow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label={isSpanish ? "Enviar mensaje" : "Send message"}
                className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-paqariGreen text-white shadow-lg transition hover:bg-paqariGreenDark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h13M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-gray-500 dark:text-gray-400">{copy.disclaimer}</p>
          </form>
        </div>

        <button
          type="button"
          aria-label="Abrir chat con el bot"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-paqariGreen text-white shadow-xl transition transform focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-95 ${
            isOpen ? "scale-95" : "hover:scale-105"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-7 w-7"
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
