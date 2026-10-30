# ACC Module Hub — Chatbox Removal

The floating chatbox was removed from the dashboard because it was only a visual placeholder. It had no submit handler, backend route, controller, AI provider, project context, or response logic, so it could not answer users.

A real project assistant is technically possible, but it would require an AI provider API key, a secure backend endpoint, project-specific prompt/context rules, rate limiting, error handling, and usage-cost controls. The widget should be reintroduced only after those pieces are configured.

This update removes the dashboard import and rendered widget. The old `resources/js/components/chatbox.tsx` file may remain unused in the project and can be deleted manually if desired.
