Register a new post type (first-tag value) in this portfolio site.

User arguments: $ARGUMENTS

If no type name was given, ask the user for: the type name (kebab-case) and a display label.

Post types are driven by tags[0] — the first tag in a post's front matter. Adding a new type requires exactly 2 coordinated changes:

## 1. `_sass/_variables.scss`
- Add an entry to the `$post-type-colors` map: `"<type>": #hexcolor`
- Also add a CSS custom property to the `:root` block in `_sass/_inkwell.scss` and `_sass/_noir.scss`:
  `--c-<type>: #hexcolor;`
- Choose a color that doesn't clash with the existing ones

## 2. `assets/icons/<type>.svg`
- Create a placeholder SVG icon (simple geometric shape, `viewBox="0 0 24 24"`, `fill="currentColor"`)
- The icon is rendered via CSS `mask-image` so it must be a solid-fill shape

Optionally, if a corner edge graphic is needed:
- Create `assets/edges/<type>.svg` — square SVG used as the card corner mask

After making all changes, tell the user:
- The type is ready to use as the first tag in post front matter: `tags: [<type>, ...]`
- They should replace `assets/icons/<type>.svg` with their real icon when ready
- If they want this type to appear under a nav button, posts need the matching nav tag (`games`, `cooking`, `meetup`, `life`, or `beliefs`)
