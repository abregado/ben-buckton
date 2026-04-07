# Ben Buckton — Portfolio Site

Jekyll 4 + esbuild (TypeScript → `assets/js/main.js`) + Jekyll Sass. Hosted on GitHub Pages via Actions.

## Non-obvious conventions

- `assets/js/main.js` is gitignored build output — it's generated in CI before `jekyll build`. Never commit it.
- Nav has a single **Projects** link (`/projects/`) and an avatar image (`assets/avatar.png`, 512×512 PNG scaled to 36px circle). The old tag-preset buttons (Beliefs, Games, etc.) are gone.
- Post front matter: `layout`, `title`, `date`, `tags[]` (values: `games`, `job`, `life`, `meetup` — first tag drives color/icon/label), `clickable` (bool), `project?` (slug), `image?`, `timeline?` (bool — set `false` to hide from timeline), `featured?` (bool — forces tile), `external_url?` (string)
- Project overview pages live in `projects/` (e.g. `projects/deeper.md`) with `permalink`, `timeline: false`, and a `color:` field that sets `--tag-color` directly on the post-full article.
- Adding a **post type** requires 2 coordinated changes — use `/add-post-type`.
- Adding a **project** requires an entry in `_data/projects.yml` AND a page in `projects/` — use `/add-project`.

## Default theme

Inkwell is the default on first visit. The JS reads `localStorage.getItem('site-theme') ?? 'inkwell'`. When the user explicitly dismisses all themes, `'none'` is stored so Inkwell doesn't re-apply on the next visit.

## Themes

Two dark themes — **Inkwell** (warm brown, full tag colors) and **Noir** (strict monochrome). Activated by `data-theme="inkwell"` or `data-theme="noir"` on `<html>`. The nav style selector sets this and persists to `localStorage`. When no `data-theme` is set, the GitHub-dark base styles apply.

CSS lives in `_sass/_inkwell.scss` and `_sass/_noir.scss`, compiled into the main bundle.

### Tag color variables

Defined at `:root` in both theme files. Used as `--tag-color` inline on `.post-card-wrap` (timeline cards) and as an inline style on `.post-full` articles (set via Liquid from `page.tags[0]`, or directly from `page.color` for project pages):

```
--c-games, --c-job, --c-life, --c-meetup
```

**Inkwell:** tag colors used on card left border, corner element fill, top border sweep, hover tint, and post-full dividers/links.  
**Noir:** tag colors used **only** in filter row dots. All card and post-full elements are forced to gray.

### Card HTML structure

`timeline.ts` and `post-related.ts` both render posts into this wrapper structure:

```
.post-card-wrap  (hover target; --tag-color, --edge-img, data-tags set inline)
├── .card-top-border   (sibling div — NOT ::before, so it isn't clipped by card overflow:hidden)
├── .card-corner       (div masked by --edge-img; absolute, left:0 top:0; 36×36px)
└── .post-card.chip / .post-card.tile  (inner card; also carries .post-type--{tags[0]})
    └── .post-title / .post-excerpt / .post-secondary-tags
```

Title/excerpt elements are dual-classed (e.g. `chip__title post-title`) so both the default BEM SCSS and the themed CSS match.

When no theme is active, `.card-corner { display:none }` and `.post-card-wrap { padding-left:0 }` (set in `_base.scss`) keep the layout identical to the pre-theme look.

### Hover states

| Element | Inkwell | Noir |
|---|---|---|
| `.post-card-wrap` | `translateY(-3px)` + drop shadow | same |
| `.card-top-border` | sweeps in left→right, tag color | sweeps in, gray `#555` |
| `.post-card::after` | radial gradient tint fades in (opacity 0→0.12) | hidden (`display:none`) |
| Left border | tag color (static) | gray `#383838` (static) |

The top border sweep uses `transform: scaleX(0→1)` with `transform-origin: left center` and `transition: 0.32s cubic-bezier(0.4,0,0.2,1)`. It starts at `left: var(--corner-size)` so it begins flush with the card's left edge (after the corner element).

### Corner element

`.card-corner` is a plain `<div>` (replaced the old inline SVG path). It uses `mask-image: var(--edge-img)` + `background` for color. `--edge-img` is set inline per card to `url('/assets/edges/{tags[0]}.svg')`.

Per-type SVG files live in `assets/edges/` — one square SVG per post type (placeholder black rectangles, intended to be customized). They are masked to the element height; width = height = `--corner-size` (36px).

**Inkwell:** `background: var(--tag-color)`  
**Noir:** `background: var(--corner-fill)` (#2e2e2e — never tag color)

## post-full pages

Post articles (`layout: post`) inject `--tag-color` as an inline style on the `<article>` element via Liquid:
- Standard posts: mapped from `page.tags[0]` using the same `github-project → github` slug rule
- Project pages: use `page.color` directly (set in front matter)

`--tag-color` drives: header `border-bottom`, `blockquote` left border, body `a` color/hover, `hr` dividers, back link hover, project link color.

### Related posts

`post-related.ts` is initialised by `main.ts` when `#related-posts` is present (post pages only). It reads `window.__SITE_DATA__` (all `site.posts`, embedded by `post.html`) and `window.__CURRENT_POST_URL__`.

- If the post has a `project`: shows other posts in the same project ("Other posts in this project")
- Otherwise: shows most-recent posts sharing any tag, capped at 6 ("Related posts")
- Project overview pages (not in `site.posts`): falls back to `window.__CURRENT_PROJECT__` and shows all posts in that project ("Posts in this project")

The related chips are rendered with the same `.post-card-wrap` / `.card-corner` / `.chip` structure as the timeline, so they respect the active theme automatically.

## Projects

### `_data/projects.yml` fields

```yaml
slug:        # matches project: front matter in posts
name:        # display name
color:       # hex color for bar and accent
start:       # YYYY-MM-DD
end:         # YYYY-MM-DD (omit for ongoing)
repo:        # optional GitHub repo slug
post:        # URL of the project overview page, e.g. /projects/deeper/
description: # one-sentence description shown on the projects listing page
```

### Projects listing page (`/projects/`)

`projects.md` uses `layout: projects` (`_layouts/projects.html`). It loops `site.data.projects`, counts timeline posts per project via Liquid, and renders a `.project-card-full` for each project that has at least one post. Cards link to `project.post`.

SCSS in `_sass/_projects.scss` (imported in `main.scss`). Inkwell and Noir overrides are included in the same file.

## Skills

| Command | Use for |
|---|---|
| `/add-post` | Create a new post |
| `/add-project` | Add a project |
| `/add-post-type` | Register a new post type (SCSS + icon) |

## Writing skills

Skills live in `.claude/commands/<name>.md`. The file content becomes the prompt. Use `$ARGUMENTS` where the user's inline arguments should be substituted. Keep skills task-focused and include all context needed to complete the task without reading CLAUDE.md again.
