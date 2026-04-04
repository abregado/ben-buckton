# Ben Buckton — Portfolio Site

Jekyll 4 + esbuild (TypeScript → `assets/js/main.js`) + Jekyll Sass. Hosted on GitHub Pages via Actions.

## Non-obvious conventions

- `assets/js/main.js` is gitignored build output — it's generated in CI before `jekyll build`. Never commit it.
- Nav buttons (Beliefs, Games, Cooking, Meetup, Life) set tag presets client-side: `beliefs | games | cooking | meetup | life`. They are NOT special pages.
- Post front matter: `layout`, `title`, `date`, `type`, `tags[]`, `clickable` (bool), `project?` (slug), `image?`
- Adding a **post type** requires 3 coordinated changes — use `/add-post-type`.
- Adding a **project bar** requires an entry in `_data/projects.yml` — use `/add-project`.

## Skills

| Command | Use for |
|---|---|
| `/add-post` | Create a new post |
| `/add-project` | Add a project to the timeline bars |
| `/add-post-type` | Register a new post type (SCSS + TS + icon) |

## Writing skills

Skills live in `.claude/commands/<name>.md`. The file content becomes the prompt. Use `$ARGUMENTS` where the user's inline arguments should be substituted. Keep skills task-focused and include all context needed to complete the task without reading CLAUDE.md again.
