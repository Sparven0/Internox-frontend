export type ChatRole = 'user' | 'assistant' | 'system';
  export type ChatMessage = { role: ChatRole; content: string };
  export type ChatRequestBody = {
    messages: ChatMessage[];
    model?: string;
    debug?: boolean;
  };
  export type ChatSuccessBody = {
    reply: string;
    toolTrace?: unknown;
  };
  export class ChatApiError extends Error {
    constructor(
      message: string,
      public readonly status?: number,
      public readonly body?: unknown,
    ) {
      super(message);
      this.name = 'ChatApiError';
    }
  }
  function getApiBaseUrl(): string {
    const base = import.meta.env.VITE_API_URL as string | undefined;
    if (!base || !String(base).trim()) {
      const msg =
        'VITE_API_URL is not set. Add it to .env (e.g. VITE_API_URL=https://internox.duckdns.org).';
      if (import.meta.env.DEV) console.error(msg);
      throw new Error(msg);
    }
    return String(base).replace(/\/+$/, '');
  }
  function getBearerToken(): string | null {
    if (typeof window === 'undefined') return null;
    for (const k of ['token', 'authToken', 'jwt', 'accessToken'] as const) {
      const v =
        window.localStorage.getItem(k) ?? window.sessionStorage.getItem(k);
      if (v?.trim()) return v.trim();
    }
    return null;
  }
  export type SendChatOptions = {
    model?: string;
    debug?: boolean;
    signal?: AbortSignal;
  };
  export async function sendChat(
    messages: ChatMessage[],
    options: SendChatOptions = {},
  ): Promise<ChatSuccessBody> {
    const base = getApiBaseUrl();
    const url = `${base}/api/chat`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = getBearerToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const body: ChatRequestBody = {
      messages,
      ...(options.model ? { model: options.model } : {}),
      ...(options.debug ? { debug: true } : {}),
    };
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(body),
        signal: options.signal,
      });
    } catch {
      throw new ChatApiError(
        'Network error — check your connection and that the API is running.',
      );
    }
    const text = await res.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        parsed = text;
      }
    }
    const msgFromBody = (() => {
      if (!parsed || typeof parsed !== 'object') return '';
      const o = parsed as { message?: unknown; error?: unknown };
      const m = o.message ?? o.error;
      return typeof m === 'string' ? m : '';
    })();
    if (!res.ok) {
      if (res.status === 401) {
        throw new ChatApiError(
          msgFromBody || 'You need to sign in to use the assistant.',
          401,
          parsed,
        );
      }
      if (res.status === 403) {
        throw new ChatApiError(
          msgFromBody ||
            'Assistant requires a company context (e.g. not available for this account).',
          403,
          parsed,
        );
      }
      if (res.status === 500) {
        throw new ChatApiError(
          msgFromBody || 'Server error — try again or contact support.',
          500,
          parsed,
        );
      }
      throw new ChatApiError(
        msgFromBody || `Request failed (${res.status}).`,
        res.status,
        parsed,
      );
    }
    if (!parsed || typeof parsed !== 'object') {
      throw new ChatApiError('Invalid response from assistant.', res.status, parsed);
    }
    const reply = (parsed as { reply?: unknown }).reply;
    if (typeof reply !== 'string') {
      throw new ChatApiError('Assistant response missing reply.', res.status, parsed);
    }
    const toolTrace =
      'toolTrace' in parsed
        ? (parsed as { toolTrace: unknown }).toolTrace
        : undefined;
    return toolTrace !== undefined ? { reply, toolTrace } : { reply };
  }