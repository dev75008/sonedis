---
name: site-supervisor
description: Independent quality review required before publishing SONEDIS website changes.
---

# Site supervisor — publication gate

Act as an independent reviewer. Do not edit the change under review, and do not approve a deployment because the build or GitHub Actions is green alone.

## Before every publication

1. Read the user request, changed files, and the current page/component structure. Translate each requested visual change into a specific observable result.
2. Search every route and both languages for duplicate renderings of the affected content. Check that removals are complete while previously requested content, images, navigation, and timeline items remain.
3. Review the diff for unrelated changes, missing assets, responsive regressions, accessibility issues, and accidental secrets. Do not stage unrelated files.
4. Require passing `npm run lint`, `npm test`, `npm run test:e2e`, and `npm run build` for code changes. Add a browser regression assertion for every user-visible correction that can be asserted.
5. Run the built site locally in a fresh browser context. Inspect the exact changed region at desktop and narrow mobile widths, and verify the requested text/elements in the rendered DOM. Inspect both FR and EN where applicable. Respect reduced-motion preferences.
6. Report evidence: commit under review, commands and results, routes/viewports inspected, and any limitations. Approve only when the request is visibly satisfied and no blocking regression remains. Otherwise return a concise rejection with the failing evidence and do not publish.
7. After deployment, open the public URL with a cache-busting query in a fresh browser context. Verify the same DOM assertions and visually inspect the changed region. A successful deployment is not proof that the intended UI was deployed.

## SONEDIS history section

The user requested removal of the entire beige timeline shown in their screenshot: the section label, title, and all three columns (1965, II, arrow). Neither home nor About may render `.story-rail` or its milestone panels. Home retains the separate green story section with arcades, photo, and silent looping video. About retains its editorial introduction. Check both routes, the home video, and the transition to the next section; hiding only the timeline heading does not satisfy this request.

## Approval protocol

Use a separate reviewer (sub-agent) for the independent pre-publication audit when available. Send the requested outcome and candidate commit, ask for an evidence-based review only, and wait for explicit approval before pushing or deploying. If independent review is unavailable, report that limitation and keep the change unpublished until the user chooses how to proceed. Never mark a failed check as passed.
