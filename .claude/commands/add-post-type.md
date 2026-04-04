Register a new post type in this portfolio site.

User arguments: $ARGUMENTS

If no type name was given, ask the user for: the type name (kebab-case) and a display label.

Adding a post type requires exactly 3 coordinated changes:

## 1. `src/ts/types.ts`
- Add the type name to the `PostType` union
- Add an entry to `POST_TYPE_LABELS` record: `'<type>': 'Display Label'`

## 2. `_sass/_variables.scss`
- Add an entry to the `$post-type-colors` map: `"<type>": #hexcolor`
- Choose a color that doesn't clash with the existing ones (see the map for current colours)

## 3. `assets/icons/<type>.svg`
- Create a placeholder SVG icon (simple geometric shape, `viewBox="0 0 24 24"`, `fill="currentColor"`)
- The icon is rendered via CSS `mask-image` so it must be a solid-fill shape

After making all 3 changes, tell the user:
- The type is ready to use in post front matter as `type: <type>`
- They should replace `assets/icons/<type>.svg` with their real icon when ready
- If they want this type to appear under a nav button, posts need the matching nav tag (`games`, `cooking`, `meetup`, `life`, or `beliefs`)
