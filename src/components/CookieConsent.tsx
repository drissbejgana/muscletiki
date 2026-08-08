import { useState, useEffect, useCallback } from "react";
import { Cookie, ChevronDown, Check, X } from "lucide-react";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import {
  ConsentCategory, CATEGORY_DETAILS, DEFAULT_CATEGORIES, ALL_ACCEPTED,
  CONSENT_OPEN_EVENT, getConsent, saveConsent, needsConsentDecision,
} from "@/lib/consent";

/**
 * First-visit privacy & cookie banner.
 *
 * Shown until the visitor makes a choice, then never again unless they reopen
 * it from the footer or CONSENT_VERSION is bumped. Rendered as a bottom sheet
 * rather than a full-screen modal so it never blocks the page — the free-trial
 * overlay already competes for the centre of the screen.
 */
const CookieConsent = () => {
  const { t } = useTranslation();

  const [visible, setVisible]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [choices, setChoices]   = useState<Record<ConsentCategory, boolean>>(DEFAULT_CATEGORIES);

  // Decide on mount whether this is a first visit.
  useEffect(() => {
    if (needsConsentDecision()) {
      // Small delay so the banner animates in after the page paints.
      const timer = window.setTimeout(() => setVisible(true), 600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  // Allow the footer link to reopen it, pre-filled with the current choice.
  useEffect(() => {
    const reopen = () => {
      const existing = getConsent();
      setChoices(existing?.categories ?? DEFAULT_CATEGORIES);
      setExpanded(true);
      setVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const decide = useCallback((categories: Record<ConsentCategory, boolean>) => {
    saveConsent(categories);
    setVisible(false);
    setExpanded(false);
  }, []);

  const toggle = (id: ConsentCategory) =>
    setChoices((prev) => ({ ...prev, [id]: !prev[id] }));

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 pb-20 lg:pb-4 animate-in slide-in-from-bottom duration-500"
    >
      <div className="max-w-screen-md mx-auto bg-card border border-border rounded-2xl shadow-2xl shadow-black/15 overflow-hidden">
        {/* Header + copy */}
        <div className="p-5">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/15 flex items-center justify-center">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="cookie-consent-title" className="text-base font-bold text-foreground mb-1">
                {t("cookies.title")}
              </h2>
              <p id="cookie-consent-desc" className="text-sm text-muted-foreground leading-relaxed">
                {t("cookies.description")}
              </p>

              <button
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                {expanded ? t("cookies.hideDetails") : t("cookies.customize")}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
              </button>
            </div>
          </div>

          {/* Per-category toggles */}
          {expanded && (
            <div className="mt-4 space-y-2.5 border-t border-border pt-4">
              {CATEGORY_DETAILS.map(({ id, required, keys }) => {
                const on = required || choices[id];
                return (
                  <div key={id} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
                    <button
                      role="switch"
                      aria-checked={on}
                      aria-label={t(`cookies.categories.${id}.name`)}
                      disabled={required}
                      onClick={() => !required && toggle(id)}
                      className={cn(
                        "mt-0.5 relative h-5 w-9 shrink-0 rounded-full transition-colors",
                        on ? "bg-primary" : "bg-muted-foreground/30",
                        required ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                      )}
                    >
                      <span className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                        on ? "translate-x-[1.125rem]" : "translate-x-0.5"
                      )} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground">
                          {t(`cookies.categories.${id}.name`)}
                        </span>
                        {required && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/15 px-1.5 py-0.5 rounded">
                            {t("cookies.alwaysOn")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {t(`cookies.categories.${id}.description`)}
                      </p>
                      {keys.length > 0 && (
                        <p className="text-[10px] text-muted-foreground/70 mt-1 font-mono break-all">
                          {keys.join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 border-t border-border bg-secondary/30 p-4">
          <button
            onClick={() => decide(DEFAULT_CATEGORIES)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground border border-border hover:border-muted-foreground/40 bg-card transition-colors"
          >
            <X className="h-4 w-4" />
            {t("cookies.rejectAll")}
          </button>

          {expanded && (
            <button
              onClick={() => decide(choices)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-foreground border border-border hover:border-muted-foreground/40 bg-card transition-colors"
            >
              {t("cookies.savePreferences")}
            </button>
          )}

          <button
            onClick={() => decide(ALL_ACCEPTED)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Check className="h-4 w-4" />
            {t("cookies.acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
