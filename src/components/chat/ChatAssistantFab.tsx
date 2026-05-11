import { useCallback, useEffect, useRef, useState } from 'react';
  import { ChatApiError, sendChat, type ChatMessage } from '../../lib/chatApi';
  const drawerWidth = 400;
  export function ChatAssistantFab() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const isDev = import.meta.env.DEV;
    useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [open]);
    useEffect(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }, [messages, loading]);
    const onSubmit = useCallback(async () => {
      const trimmed = input.trim();
      if (!trimmed || loading) return;
      const userMessage: ChatMessage = { role: 'user', content: trimmed };
      const next = [...messages, userMessage];
      setMessages(next);
      setInput('');
      setError(null);
      setLoading(true);
      try {
        const { reply, toolTrace } = await sendChat(next, {
          debug: isDev && debug,
        });
        const assistantText =
          isDev && debug && toolTrace !== undefined
            ? `${reply}\n\n__toolTrace__\n${JSON.stringify(toolTrace, null, 2)}`
            : reply;
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: assistantText },
        ]);
      } catch (e) {
        const msg =
          e instanceof ChatApiError
            ? e.message
            : e instanceof Error
              ? e.message
              : 'Something went wrong.';
        setError(msg);
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setLoading(false);
      }
    }, [debug, input, isDev, loading, messages]);
    return (
      <>
        {/* FAB */}
        <button
          type="button"
          aria-label="Open assistant chat"
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            zIndex: 1300,
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            background: '#1976d2',
            color: '#fff',
            fontSize: 24,
            lineHeight: 1,
          }}
        >
          💬
        </button>
        {/* Backdrop */}
        {open ? (
          <button
            type="button"
            aria-label="Close assistant overlay"
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1298,
              border: 'none',
              padding: 0,
              margin: 0,
              background: 'rgba(0,0,0,0.35)',
              cursor: 'pointer',
            }}
          />
        ) : null}
        {/* Drawer */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-assistant-title"
          hidden={!open}
          style={{
            position: 'fixed',
            top: 0,
            right: open ? 0 : -drawerWidth,
            width: drawerWidth,
            maxWidth: '100vw',
            height: '100vh',
            zIndex: 1299,
            background: '#fff',
            boxShadow: open ? '-4px 0 24px rgba(0,0,0,0.15)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            transition: 'right 0.2s ease',
          }}
        >
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <h2 id="chat-assistant-title" style={{ margin: 0, fontSize: 18 }}>
              Assistant
            </h2>
            <button
              type="button"
              aria-label="Close assistant chat"
              onClick={() => setOpen(false)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </header>
          {isDev ? (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                fontSize: 14,
              }}
            >
              <input
                type="checkbox"
                checked={debug}
                onChange={(e) => setDebug(e.target.checked)}
                aria-label="Debug chat API"
              />
              Debug
            </label>
          ) : null}
          <div
            ref={listRef}
            aria-live="polite"
            style={{
              flex: 1,
              overflow: 'auto',
              padding: 16,
            }}
          >
            {messages.length === 0 ? (
              <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                Ask a question to get started.
              </p>
            ) : null}
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#888' }}>
                  {m.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 16, color: '#666' }}>
                Thinking…
              </div>
            ) : null}
          </div>
          {error ? (
            <div
              role="alert"
              style={{
                margin: '0 16px 8px',
                padding: 12,
                background: '#ffebee',
                color: '#c62828',
                borderRadius: 4,
                fontSize: 14,
              }}
            >
              {error}
              <button
                type="button"
                onClick={() => setError(null)}
                style={{ marginLeft: 8, border: 'none', background: 'transparent', cursor: 
  'pointer' }}
              >
                Dismiss
              </button>
            </div>
          ) : null}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmit();
            }}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end',
              padding: 16,
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <textarea
              aria-label="Chat message"
              placeholder="Message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              rows={3}
              style={{
                flex: 1,
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: 14,
              }}
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={loading || !input.trim()}
              style={{
                padding: '8px 16px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              Send
            </button>
          </form>
        </aside>
      </>
    );
  }
