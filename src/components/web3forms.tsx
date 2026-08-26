"use client";

import { useState, type FormEvent, type ReactNode } from "react";

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
 * Why a submission failed. Three causes previously collapsed into one message,
 * which meant the only way to tell them apart was the browser console: no use
 * to a visitor, and no use in a screenshot of the failure.
 *
 * They need different actions, so they now say different things:
 *   unconfigured - the build has no access key. Nobody can submit. Mine to fix.
 *   rejected     - the request reached Web3Forms and it said no. Its own
 *                  message is shown, since that names the actual cause
 *                  (domain restriction, quota, unverified recipient).
 *   unreachable  - the request never arrived. Usually a privacy or ad blocker
 *                  blocking api.web3forms.com, which is why this can fail for
 *                  one visitor while working for everyone else.
 */
type Failure =
  | { kind: "unconfigured" }
  | { kind: "malformed"; got: string }
  | { kind: "rejected"; detail?: string }
  | { kind: "unreachable" };

/**
 * Web3Forms access keys are UUIDs. Checking the shape before submitting
 * separates "the build never received a usable key" from "the service said no",
 * which otherwise look identical from outside.
 *
 * The value reaching the browser is not always the value that was typed into
 * the hosting dashboard: a NEXT_PUBLIC_ variable is inlined into the bundle at
 * build time, so anything that rewrites or withholds it during the build
 * arrives here as a placeholder rather than a key.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-slate/70 outline-none transition-colors focus-visible:border-gold-ink";

/**
 * A Web3Forms-backed form.
 *
 * `accessKey` decides which mailbox the submission lands in — each Web3Forms
 * form has its own key and its own configured recipient.
 */
function Web3Form({
  accessKey,
  keyName,
  subject,
  fields,
  submitLabel = "Send message",
  successTitle = "Status: Received",
  successBody,
  compact = false,
}: {
  accessKey: string | undefined;
  /**
   * The environment variable this form's key comes from. Shown only when the
   * key is missing, because the usual reason for that is a variable created
   * under a name nothing reads. Naming it turns a dead end into a one-line fix.
   */
  keyName?: string;
  subject: string;
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
    // Trim defensively: values pasted into a hosting dashboard commonly pick up
    // a leading tab or trailing newline, which Web3Forms rejects outright as a
    // malformed UUID. The whitespace is invisible wherever you would inspect it.
    const key = accessKey?.trim();

    if (!key) {
      console.error(
        `[web3forms] No access key for this form (expected ${keyName ?? "a NEXT_PUBLIC_WEB3FORMS_KEY* variable"}). ` +
          "NEXT_PUBLIC_ variables are inlined at BUILD time, so setting one after a build requires a redeploy.",
      );
      setFailure({ kind: "unconfigured" });
      setStatus("error");
      return;
    }

    if (!UUID.test(key)) {
      console.error(
        `[web3forms] ${keyName ?? "The access key"} reached the browser with invalid format ` +
          `(${key.length} chars).`,
      );
      setFailure({ kind: "malformed", got: key });
      setStatus("error");
      return;
    }

    const formData = new FormData(form);
    formData.append("access_key", key);
    formData.append("subject", subject);
    formData.append("from_name", "Invision Solutions Website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        console.error("[web3forms] Rejected the submission:", result.message);
        setFailure({ kind: "rejected", detail: result.message });
        setStatus("error");
      }
    } catch (error) {
      // fetch only rejects when the request never completed: offline, DNS,
      // CORS, or an extension blocking the endpoint. A rejection by the service
      // resolves normally and is handled above.
      console.error("[web3forms] Could not reach api.web3forms.com:", error);
      setFailure({ kind: "unreachable" });
      setStatus("error");
    }
  }

  const reason =
    failure?.kind === "unconfigured"
      ? `This form is not configured on this deployment, so nothing was sent. Please use the email address above.${
          keyName ? ` (Missing ${keyName}.)` : ""
        }`
      : failure?.kind === "malformed"
        ? `The access key in this build is not a valid key. It arrived as "${failure.got}" (${failure.got.length} characters), so ${keyName ?? "the variable"} was not exposed to the build intact.`
      : failure?.kind === "unreachable"
        ? "The form service could not be reached. A privacy or ad blocker will sometimes block it, so it is worth retrying with one paused."
        : failure?.detail
          ? `The form service rejected it: ${failure.detail}`
          : null;

  if (status === "success") {
    return (
      <div className="surface-raised rounded-xl p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-ink">
          {successTitle}
        </p>
        <p className="mt-4 text-lg text-ink">{successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`surface-raised rounded-xl ${compact ? "p-5 sm:p-6" : "p-6 sm:p-8"}`}
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
          const id = `${subject.replace(/\W+/g, "-").toLowerCase()}-${field.name}`;
          const wrapper = field.full || compact ? "sm:col-span-2" : "";
          return (
            <div key={field.name} className={wrapper}>
              <label htmlFor={id} className="block text-sm font-medium text-ink">
                {field.label}
                {!field.required && (
                  <span className="ml-1.5 font-normal text-slate">(optional)</span>
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
          <p className="text-sm text-red-700">
            Something went wrong sending that. Please try again, or email{" "}
            <a
              href="mailto:contact@invisionsolutions.co.uk"
              className="underline underline-offset-4"
            >
              contact@invisionsolutions.co.uk
            </a>{" "}
            directly.
          </p>
          {/* The specific cause, so a screenshot of the failure is enough to
              diagnose it without asking anyone to open a browser console. */}
          {reason && <p className="mt-1.5 text-xs text-slate">{reason}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-opacity hover:opacity-88 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

export { Web3Form };
