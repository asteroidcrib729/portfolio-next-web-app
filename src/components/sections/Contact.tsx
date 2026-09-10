"use client";

import { FormEvent, useState } from "react";
import { Check, Clipboard, LoaderCircle, Mail, MapPin, Send } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SocialAnchor } from "@/components/common/SocialAnchor";
import { siteConfig, socialLinks } from "@/data/siteConfig";

type SubmitState = "idle" | "sending" | "sent" | "fallback" | "error";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

export function Contact() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData) as unknown as ContactPayload;

    setSubmitState("sending");
    setStatusMessage("Sending your message…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (response.status === 503) {
        const mailto = new URL(`mailto:${siteConfig.email}`);
        mailto.searchParams.set("subject", payload.subject);
        mailto.searchParams.set(
          "body",
          `${payload.message}\n\nFrom: ${payload.name} <${payload.email}>`
        );
        window.location.href = mailto.toString();
        setSubmitState("fallback");
        setStatusMessage("Your mail app has been opened with the message prefilled.");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message ?? "The message could not be sent.");
      }

      form.reset();
      setSubmitState("sent");
      setStatusMessage("Message sent. I’ll get back to you as soon as possible.");
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : `Something went wrong. Email ${siteConfig.email} directly.`
      );
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  }

  const fieldClassName =
    "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-accent/35 focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          id="contact-title"
          eyebrow="Let’s build something"
          title="Have a frontend problem worth solving well?"
          description="Tell me what you are building, where the interface is falling short, and what an excellent outcome looks like."
          align="left"
        />

        <div className="grid overflow-hidden rounded-[1.75rem] border border-border bg-card/85 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative overflow-hidden border-b border-border bg-foreground p-6 text-background sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-bright/20 blur-3xl"
            />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-background/60">
                Direct channel
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-4 block break-all text-xl font-semibold tracking-tight transition-opacity hover:opacity-75 sm:text-2xl"
              >
                {siteConfig.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-background/20 bg-background/10 px-4 text-sm font-medium transition-colors hover:bg-background/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background"
              >
                {copied ? (
                  <Check aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Clipboard aria-hidden="true" className="h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy email"}
              </button>

              <div className="mt-10 space-y-4 border-t border-background/15 pt-6 text-sm text-background/70">
                <p className="flex items-center gap-3">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  {siteConfig.location}
                </p>
                <p className="flex items-center gap-3">
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  Direct replies, without an automated sales flow
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <SocialAnchor
                    key={link.label}
                    link={link}
                    showLabel
                    openInNewTab
                    className="border-background/20 bg-background/10 text-background/80 hover:border-background/40 hover:text-background focus-visible:ring-background focus-visible:ring-offset-foreground"
                  />
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-foreground">
                Name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Your name"
                  className={fieldClassName}
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={160}
                  placeholder="you@company.com"
                  className={fieldClassName}
                />
              </label>
            </div>

            <label className="mt-5 block text-sm font-medium text-foreground">
              Subject
              <input
                name="subject"
                required
                minLength={3}
                maxLength={120}
                placeholder="What are we solving?"
                className={fieldClassName}
              />
            </label>

            <label className="mt-5 block text-sm font-medium text-foreground">
              Message
              <textarea
                name="message"
                required
                minLength={20}
                maxLength={3000}
                rows={6}
                placeholder="A little context, the challenge, and what success looks like…"
                className={`${fieldClassName} resize-y`}
              />
            </label>

            <label className="sr-only" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-xs leading-5 text-muted-foreground">
                Your details are used only to respond to this message.
              </p>
              <button
                type="submit"
                disabled={submitState === "sending"}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {submitState === "sending" ? (
                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                ) : (
                  <Send aria-hidden="true" className="h-4 w-4" />
                )}
                {submitState === "sending" ? "Sending…" : "Send message"}
              </button>
            </div>

            {statusMessage ? (
              <p
                role={submitState === "error" ? "alert" : "status"}
                className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                  submitState === "error"
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {statusMessage}
              </p>
            ) : null}
          </form>
        </div>
      </Container>
    </section>
  );
}
