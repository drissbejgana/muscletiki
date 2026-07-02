import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Crown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SYSTEM_PROMPT = `You are Alex, an expert professional fitness trainer and sports nutritionist with 15+ years of experience.
You help users with:
- Personalized workout plans and exercise recommendations
- Muscle anatomy and proper form guidance
- Nutrition advice, meal planning, and macros
- Recovery, injury prevention, and mobility
- Progress tracking and goal setting

Always be encouraging, motivating, and professional. Give specific, actionable advice.
Keep responses concise and practical (3-5 sentences max unless a detailed plan is requested).
Ask clarifying questions when needed to personalize advice.`;

const PAID_PLANS = ["premium_5day", "premium_annual", "premium", "pro"];

const WELCOME: Message = {
  role: "assistant",
  text: "Hey! I'm Alex, your personal AI trainer 💪 Ask me anything about workouts, nutrition, or your fitness goals!",
};

const TrainerChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const user = authService.getCurrentUser();
  const isPaid = user && PAID_PLANS.includes(user.subscription?.plan);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  useEffect(() => {
    if (open && isPaid) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, isPaid]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      // Build full conversation for Groq (system + all messages)
      const groqMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...next.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        })),
      ];

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) throw new Error("quota");
        throw new Error(`API ${res.status}`);
      }

      const reply =
        data.choices?.[0]?.message?.content ??
        "Sorry, I couldn't get a response. Please try again.";

      setMessages([...next, { role: "assistant", text: reply }]);
    } catch (err: unknown) {
      const isQuota = err instanceof Error && err.message === "quota";
      setMessages([
        ...next,
        {
          role: "assistant",
          text: isQuota
            ? "I've hit the rate limit. Please wait a moment and try again."
            : "Connection issue — please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 lg:bottom-8 lg:right-6 z-50 flex flex-col items-end gap-3">
      {/* ── Chat panel ─────────────────────────────────────────── */}
      {open && (
        <div
          className={cn(
            "w-[340px] sm:w-[380px] h-[500px]",
            "bg-card border border-border rounded-2xl shadow-2xl shadow-black/20",
            "flex flex-col overflow-hidden",
            "animate-in slide-in-from-bottom-4 fade-in duration-200"
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-primary/5 shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Alex — Pro Trainer</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <p className="text-[10px] text-muted-foreground">Online · AI powered</p>
              </div>
            </div>
            <Crown className="h-4 w-4 text-amber-500 shrink-0" />
          </div>

          {/* ── Paywall (free users) ─────────────────────────── */}
          {!isPaid ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">Pro & Premium Feature</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Upgrade to chat with your personal AI trainer and get expert fitness advice anytime.
                </p>
              </div>
              <button
                onClick={() => {
                  navigate("/subscription");
                  setOpen(false);
                }}
                className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                View Plans
              </button>
              {!user && (
                <button
                  onClick={() => {
                    navigate("/auth");
                    setOpen(false);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Already have an account? Sign in
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ── Messages ─────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2 items-end",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                        msg.role === "user" ? "bg-primary/15" : "bg-secondary"
                      )}
                    >
                      {msg.role === "user" ? (
                        <User className="h-3 w-3 text-primary" />
                      ) : (
                        <Bot className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[78%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                          : "bg-secondary text-foreground rounded-2xl rounded-bl-sm"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex gap-2 items-end">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Bot className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-bl-sm px-3 py-2.5">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* ── Input ────────────────────────────────────── */}
              <div className="px-3 pb-3 pt-2 border-t border-border shrink-0">
                <div className="flex gap-2 items-center bg-secondary rounded-xl px-3 py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Ask your trainer..."
                    disabled={loading}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0 disabled:opacity-60"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className={cn(
                      "w-7 h-7 rounded-lg bg-primary text-primary-foreground",
                      "flex items-center justify-center shrink-0",
                      "transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Floating button ────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-14 h-14 rounded-full bg-primary text-primary-foreground",
          "flex items-center justify-center shadow-lg shadow-primary/30",
          "transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40 active:scale-95"
        )}
        aria-label="Open trainer chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default TrainerChat;
