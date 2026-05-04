# Mystic Stacker Copilot Instructions

## Project overview
- This project is a React-based card stacking simulation game with occult and cosmic horror themes.
- The current gameplay prototype lives in `origin/App.jsx` and the design handoff is documented in `origin/design.md`.
- Prefer preserving the existing single-file prototype architecture unless the user explicitly asks for a refactor.

## Technical guardrails
- Do not change the `stateRef` synchronization pattern for pointer and touch events unless there is a verified bug.
- Do not replace the `RECIPE_INDEX` lookup with full recipe scans during the 50ms game tick.
- Avoid introducing render-heavy UI such as large live recipe lists in the main game screen.
- Keep card assets emoji-based unless the user explicitly requests external assets.

## Coding conventions
- Keep changes small and local.
- Follow the existing React function component style in `origin/App.jsx`.
- Prefer readable variable names and preserve the current Chinese game text unless the user asks for localization work.
- When expanding gameplay, update both card definitions and recipe data coherently.

## Product constraints
- Maintain the base-driven stacking rule: the bottom card decides recipe scope.
- Maintain complexity priority: recipes with more inputs should win when multiple recipes match.
- Maintain progress reset behavior when stack contents change and the matched recipe changes.

## UI guidance
- Preserve the intentional occult atmosphere.
- Favor high-contrast, legible UI over decorative complexity.
- Ensure mouse, touch, zoom, and pan interactions keep working on desktop and mobile.