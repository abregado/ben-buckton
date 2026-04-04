# Ben Buckton — Portfolio Site

Jekyll 4 + esbuild (TypeScript → `assets/js/main.js`) + Jekyll Sass. Hosted on GitHub Pages via Actions.

## Non-obvious conventions

- `assets/js/main.js` is gitignored build output — it's generated in CI before `jekyll build`. Never commit it.
- Nav buttons (Beliefs, Games, Cooking, Meetup, Life) set tag presets client-side: `beliefs | games | cooking | meetup | life`. They are NOT special pages.
- Post front matter: `layout`, `title`, `date`, `type`, `tags[]`, `clickable` (bool), `project?` (slug), `image?`
- Adding a **post type** requires 3 coordinated changes — use `/add-post-type`.
- Adding a **project bar** requires an entry in `_data/projects.yml` — use `/add-project`.

## Themes

Two dark themes — **Inkwell** (warm brown, full tag colors) and **Noir** (strict monochrome). Activated by `data-theme="inkwell"` or `data-theme="noir"` on `<html>`. The nav style selector sets this and persists to `localStorage`. Default (no `data-theme`) renders the existing GitHub-dark look.

CSS lives in `_sass/_inkwell.scss` and `_sass/_noir.scss`, compiled into the main bundle.

### Tag color variables

Defined at `:root` in both theme files. Used as `--tag-color` inline on `.post-card-wrap`:

```
--c-microblog, --c-gamejam, --c-game-update, --c-laser-update, --c-physical-game,
--c-github, --c-meetup, --c-life-event, --c-recipe, --c-job
```

Note: post type `github-project` maps to `--c-github` (see `tagColorVar()` in `timeline.ts`).

**Inkwell:** tag colors used on card left border, corner SVG fill, top border sweep, hover tint.  
**Noir:** tag colors used **only** in filter row dots. All card elements are forced to gray.

### Card HTML structure

`timeline.ts` renders every post into this wrapper structure:

```
.post-card-wrap  (hover target; --tag-color and data-tags set inline)
├── .card-top-border   (sibling div — NOT ::before, so it isn't clipped by card overflow:hidden)
├── .card-corner svg   (edge-tag.svg inlined; absolute, left:0 top:0; 36×36px)
└── .post-card.chip / .post-card.tile  (inner card; also carries .post-type--{type})
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

The top border sweep uses `transform: scaleX(0→1)` with `transform-origin: left center` and `transition: 0.32s cubic-bezier(0.4,0,0.2,1)`. It starts at `left: var(--corner-size)` so it begins flush with the card's left edge (after the SVG).

### Corner SVG

`assets/edge-tag.svg` — 36×36px bookmark/tag shape. The SVG path uses absolute coordinates with a `translate(-47.107807,-82.438896)` group transform; both must be present when inlining. CSS sets the fill: `[data-theme="inkwell"] .card-corner path { fill: var(--tag-color) }` / `[data-theme="noir"] .card-corner path { fill: #2e2e2e }` (never tag color in Noir).

## Skills

| Command | Use for |
|---|---|
| `/add-post` | Create a new post |
| `/add-project` | Add a project to the timeline bars |
| `/add-post-type` | Register a new post type (SCSS + TS + icon) |

## Writing skills

Skills live in `.claude/commands/<name>.md`. The file content becomes the prompt. Use `$ARGUMENTS` where the user's inline arguments should be substituted. Keep skills task-focused and include all context needed to complete the task without reading CLAUDE.md again.
