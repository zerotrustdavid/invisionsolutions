# Invision Solutions website

Marketing site for Invision Solutions Ltd. Next.js App Router, TypeScript,
Tailwind, deployed on Vercel at invisionsolutions.co.uk.

## Read the operational notes first

Operational and security records for this site live in a separate **private**
repository: `zerotrustdavid/invision-security-notes`.

**Read them before starting or resuming work here**, not afterwards to check a
claim. They carry the current state of the Web3Forms configuration, which
controls are and are not in force, the working protocol, and a list of the
things that have already gone wrong on this project. That repository's own
`CLAUDE.md` states the protocol in full.

Any report or note produced while working on this site belongs in that
repository, not this one.

**This repository is public.** Nothing about which security controls are or are
not in force goes in here.

## Two things that will break the live site

**A `NEXT_PUBLIC_` change needs a redeploy.** These values are compiled into the
bundle at build time, so changing one in Vercel and reloading shows the old
value, and looks like the change did not save.

**Do not enable Captcha Protection in the Web3Forms dashboard on its own.** It
makes the service require a token the forms do not send, which rejects every
submission from every form. It also cannot be scoped to one page: one Web3Forms
form serves `/contact`, `/enquiries` and `/testimonials`.

## Load-bearing configuration

`next.config.ts` sets the CSP. The `connect-src 'self' https://api.web3forms.com`
directive is load-bearing: every form posts there from the browser, and
narrowing it fails lead capture on three pages silently. No build, lint or type
check catches it.

`src/lib/mailboxes.ts` holds the single access key read. There is one
environment read in the whole codebase. Do not reintroduce a `?? FALLBACK` chain
of per-mailbox keys: that pattern let a broken key hide behind a working one and
is how `/contact` failed in August.

## Conventions

- No `Co-Authored-By` trailer and no "Generated with Claude Code" anywhere in this repository, including pull request bodies. A PR body must be updated immediately after creation, because the footer is appended server-side on create.
- British English. No em dashes. No invented clients, testimonials or figures.
