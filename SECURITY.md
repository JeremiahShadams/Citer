# Security Policy

## Supported versions

Only `main` receives security fixes. There are no maintained release branches yet.

## Reporting a vulnerability

Please **do not** open a public issue for security reports.

- Email the maintainer via the GitHub profile contact, or open a [private security advisory](https://docs.github.com/en/code-security/security-advisories) on this repo.
- Include: affected endpoint/file, repro steps, and impact.
- I aim to acknowledge within 48 hours and ship a fix or mitigation promptly.

## Scope notes

- `/api/ask` and `/api/index` currently have no auth gating in local dev — do not expose this stack to the public internet without adding authentication, rate limiting, and secret rotation.
- Never commit `GROQ_API_KEY`, `OPENAI_API_KEY`, `GITHUB_TOKEN`, or `JWT_SECRET`. Rotation instructions live in `.env.example`.
