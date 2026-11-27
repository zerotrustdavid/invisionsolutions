"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { PUBLIC_CONTACT_ADDRESS } from "@/lib/mailboxes";
import type { FormKind } from "@/lib/enquiry";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  required?: boolean;
  options?: string[];
  rows?: number;
  placeholder?: string;
  full?: boolean;
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Why a submission failed, so a screenshot of the failure is enough to tell the
 * causes apart without opening a browser console. They need different actions:
 *
 *   invalid       - the server did not accept a field. Visitor can fix it.
 *   rate_limited  - too many submissions from one connection. Wait.
 *   unavailable   - the server accepted it but could not send it, or is not
 *                   configured. Nothing was sent. Mine to fix.
 *   unreachable   - the request never arrived: offline, or something blocking it.
 */
type Failure = "invalid" | "rate_limited" | "unavailable" | "unreachable";

const REASONS: Record<Failure, string> = {
  invalid: "Some of the details were not accepted. Please check them and try again.",
  rate_limited: "There have been several messages from this connection in a short time. Please wait a few minutes and try again.",
  unavailable: "The message could not be delivered, so nothing was sent.",
  unreachable: "The request did not reach the site, so nothing was sent. Please check your connection and try again.",
};

const inputClass =
  "mt-2 w-full rounded-[3px] border border-control bg-paper px-3.5 py-3 font-sans text-[0.9375rem] text-ink placeholder:text-faint outline-none transition-colors focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent";

/**
 * A form that posts to this site's own /api/enquiry route, which emails the
 * submission. It reports success only when the server says the message was
 * accepted for delivery.
 */
function EnquiryForm({
  kind,
  fields,
  submitLabel = "Send message",
  successTitle = "Message sent",
  successBody,
  compact = false,
}: {
  kind: FormKind;
  fields: Field[];
  submitLabel?: string;
  successTitle?: string;
  successBody: ReactNode;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<Failure | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFailure(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const values: Record<string, string> = {};
    for (const field of fields) {
      const value = data.get(field.name);
      if (typeof value === "string") values[field.name] = value;
    }

    let outcome: Failure | "sent";
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The honeypot checkbox is omitted by browsers when unchecked, so it is
        // only present here if something ticked it.
        body: JSON.stringify({ kind, fields: values, botcheck: data.get("botcheck") ? "1" : "" }),
      });
      const result: { ok?: boolean } = await response.json().catch(() => ({}));
      outcome =
        response.ok && result.ok === true
          ? "sent"
          : response.status === 400
            ? "invalid"
            : response.status === 429
              ? "rate_limited"
              : "unavailable";
    } catch {
      // fetch only rejects when the request never completed.
      outcome = "unreachable";
    }

    if (outcome === "sent") {
      setStatus("success");
      form.reset();
    } else {
      setFailure(outcome);
      setStatus("error");
    }
  }

  const reason = failure ? REASONS[failure] : null;

  if (status === "success") {
    return (
      <div role="status" className="border-t border-line-strong pt-8">
        <p className="t-label">{successTitle}</p>
        <p className="mt-3 font-serif text-[1.375rem] leading-snug text-ink">
          {successBody}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`border-t border-line-strong ${compact ? "pt-6" : "pt-8"}`}
    >
      {/* Honeypot — unchecked checkboxes are omitted from FormData by browsers. */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        {fields.map((field) => {
          const id = `${kind}-${field.name}`;
          const wrapper = field.full || compact ? "sm:col-span-2" : "";
          return (
            <div key={field.name} className={wrapper}>
              <label htmlFor={id} className="block font-sans text-[0.875rem] font-medium text-ink">
                {field.label}
                {!field.required && (
                  <span className="ml-1.5 font-normal text-faint">(optional)</span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.name}
                  required={field.required}
                  rows={field.rows ?? 5}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              ) : field.type === "select" ? (
                <select
                  id={id}
                  name={field.name}
                  required={field.required}
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {field.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  name={field.name}
                  type={field.type ?? "text"}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              )}
            </div>
          );
        })}
      </div>

      {status === "error" && (
        <div className="mt-4" role="alert" aria-live="polite">
          <p className="font-sans text-[0.9375rem] text-danger">
            Something went wrong sending that. Please try again, or email{" "}
            <a
              href={`mailto:${PUBLIC_CONTACT_ADDRESS}`}
              className="underline underline-offset-4"
            >
              {PUBLIC_CONTACT_ADDRESS}
            </a>{" "}
            directly.
          </p>
          {/* The specific cause, so a screenshot of the failure is enough to
              diagnose it without asking anyone to open a browser console. */}
          {reason && <p className="mt-1.5 font-sans text-[0.8125rem] text-slate">{reason}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 inline-flex items-center gap-2 rounded-[3px] bg-ink px-5 py-3 font-sans text-[0.9375rem] font-medium leading-none text-paper transition-colors hover:bg-accent disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

export { EnquiryForm };
