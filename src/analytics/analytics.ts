/*
  Mock Analytics client

  This module exposes a small, provider-agnostic analytics API that is safe to
  import anywhere in the app. By default, all functions are no-ops (with optional
  console.debug logging). To enable a real provider, just uncomment the relevant
  block(s) below and add your API key/environment variables.

  Providers (examples):
  - Google Analytics 4 (gtag)
  - PostHog
  - Segment

  Usage examples:
    import { initAnalytics, trackPageView, trackEvent, identify, startTimer, endTimer } from "../analytics/analytics";

    initAnalytics({ appVersion: "1.0.0" });
    trackPageView("/loan-form");
    trackEvent("loan_form_opened");

    const t = startTimer("loan_form_completion");
    // ... user fills out and submits form
    endTimer(t, { result: "success" });

    identify("user_123", { plan: "free" });

  To enable a provider, search for "UNCOMMENT TO ENABLE" and follow directions.
*/

/* eslint-disable @typescript-eslint/no-unused-vars */

export type AnalyticsProps = Record<string, unknown>;

export interface InitOptions {
  appVersion?: string;
  debug?: boolean; // force console.debug even when a provider is active
}

// Toggle console debug of events (still no-ops)
const DEFAULT_DEBUG = true;

// If you prefer an env-based switch, you can use Vite envs:
// const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED === "true";
// For now, we keep this strictly mocked and disabled.
const ANALYTICS_ENABLED = false;

// ---------------------------------------------------------------------------
// Provider stubs — UNCOMMENT TO ENABLE
// ---------------------------------------------------------------------------

// GA4 (gtag) example
// Make sure you've installed GA and injected the script tag in index.html.
// See: https://developers.google.com/tag-platform/gtagjs/install
//
// declare global {
//   interface Window {
//     dataLayer: unknown[];
//     gtag: (...args: unknown[]) => void;
//   }
// }
// function gtag(...args: unknown[]) {
//   window.dataLayer = window.dataLayer || [];
//   window.dataLayer.push(arguments);
// }
// const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

// PostHog example
// import posthog from "posthog-js";
// const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
// const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string | undefined; // e.g. https://app.posthog.com

// Segment example
// import Analytics from "analytics";
// import segmentPlugin from "@analytics/segment";
// let segmentClient: ReturnType<typeof Analytics> | null = null;
// const SEGMENT_WRITE_KEY = import.meta.env.VITE_SEGMENT_WRITE_KEY as string | undefined;

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

let initialized = false;
let debug = DEFAULT_DEBUG;

export function initAnalytics(options: InitOptions = {}): void {
  if (initialized) return;
  initialized = true;
  debug = options.debug ?? DEFAULT_DEBUG;

  if (!ANALYTICS_ENABLED) {
    if (debug) {
      // eslint-disable-next-line no-console
      console.debug("[analytics] initialized in MOCK mode", { options });
    }
    return;
  }

  // GA4 (gtag) — UNCOMMENT TO ENABLE
  // if (GA_MEASUREMENT_ID) {
  //   window.gtag = window.gtag || gtag as any;
  //   window.gtag("js", new Date());
  //   window.gtag("config", GA_MEASUREMENT_ID, {
  //     app_version: options.appVersion,
  //   });
  // }

  // PostHog — UNCOMMENT TO ENABLE
  // if (POSTHOG_KEY) {
  //   posthog.init(POSTHOG_KEY, {
  //     api_host: POSTHOG_HOST,
  //     person_profiles: "identified_only",
  //     loaded: () => {
  //       if (options.appVersion) posthog.group("app", "version", { version: options.appVersion });
  //     }
  //   });
  // }

  // Segment — UNCOMMENT TO ENABLE
  // if (SEGMENT_WRITE_KEY) {
  //   segmentClient = Analytics({
  //     app: "loan-eligibility-simulator",
  //     version: options.appVersion,
  //     plugins: [
  //       segmentPlugin({ writeKey: SEGMENT_WRITE_KEY })
  //     ]
  //   });
  // }

  if (debug) {
    // eslint-disable-next-line no-console
    console.debug("[analytics] initialized (provider enabled)", { options });
  }
}

export function identify(userId: string, traits?: AnalyticsProps): void {
  if (!ANALYTICS_ENABLED) {
    if (debug) console.debug("[analytics] identify (mock)", { userId, traits });
    return;
  }

  // GA4 (gtag)
  // if (window.gtag) {
  //   window.gtag("set", "user_properties", { user_id: userId, ...traits });
  // }

  // PostHog
  // posthog.identify(userId, traits);

  // Segment
  // segmentClient?.identify(userId, traits);
}

export function trackPageView(path: string, props?: AnalyticsProps): void {
  if (!ANALYTICS_ENABLED) {
    if (debug) console.debug("[analytics] pageview (mock)", { path, props });
    return;
  }

  // GA4 (gtag)
  // window.gtag?.("event", "page_view", { page_location: path, ...props });

  // PostHog
  // posthog.capture("$pageview", { path, ...props });

  // Segment
  // segmentClient?.page(undefined, { path, ...props });
}

export function trackEvent(event: string, props?: AnalyticsProps): void {
  if (!ANALYTICS_ENABLED) {
    if (debug) console.debug("[analytics] event (mock)", { event, props });
    return;
  }

  // GA4 (gtag)
  // window.gtag?.("event", event, props);

  // PostHog
  // posthog.capture(event, props);

  // Segment
  // segmentClient?.track(event, props);
}

export function trackError(error: unknown, context?: AnalyticsProps): void {
  const err = normalizeError(error);
  if (!ANALYTICS_ENABLED) {
    if (debug) console.debug("[analytics] error (mock)", { error: err, context });
    return;
  }

  // GA4 — no direct error API. Prefer trackEvent("exception", ...)
  // window.gtag?.("event", "exception", { description: err.message, fatal: false, ...context });

  // PostHog
  // posthog.capture("error", { message: err.message, name: err.name, stack: err.stack, ...context });

  // Segment
  // segmentClient?.track("error", { message: err.message, name: err.name, stack: err.stack, ...context });
}

// Simple timing helper
export interface TimerHandle { name: string; start: number }

export function startTimer(name: string): TimerHandle {
  const handle = { name, start: performance.now() };
  if (debug) console.debug("[analytics] timer:start (mock)", handle);
  return handle;
}

export function endTimer(handle: TimerHandle, props?: AnalyticsProps): void {
  const durationMs = Math.max(0, performance.now() - handle.start);
  if (!ANALYTICS_ENABLED) {
    if (debug) console.debug("[analytics] timer:end (mock)", { name: handle.name, durationMs, props });
    return;
  }

  // GA4 (gtag)
  // window.gtag?.("event", `${handle.name}_timing`, { value: Math.round(durationMs), ...props });

  // PostHog
  // posthog.capture(`${handle.name}_timing`, { durationMs, ...props });

  // Segment
  // segmentClient?.track(`${handle.name}_timing`, { durationMs, ...props });
}

// Domain-specific helpers (examples you might call from LoanForm)
export function trackLoanFormOpened(): void {
  trackEvent("loan_form_opened");
}

export function trackLoanFormSubmitted(success: boolean, details?: { amount?: number; term?: number }): void {
  trackEvent("loan_form_submitted", { success, ...details });
}

export function trackValidationError(field: string, message?: string): void {
  trackEvent("validation_error", { field, message });
}

function normalizeError(err: unknown): { name: string; message: string; stack?: string } {
  if (err instanceof Error) return { name: err.name, message: err.message, stack: err.stack };
  return { name: "Error", message: String(err) };
}
