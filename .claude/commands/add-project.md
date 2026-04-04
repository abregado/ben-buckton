Add a new project to this portfolio site's timeline bars.

User arguments: $ARGUMENTS

If no arguments were given, ask the user for: name, slug, color (hex), start date, optional end date, optional GitHub repo URL.

## What a project does
Projects group related posts with a vertical bar on the right of the timeline. Posts opt in via `project: <slug>` in their front matter. Projects with no associated posts render nothing.

## Step 1 — append to `_data/projects.yml`
```yaml
- slug: my-slug           # kebab-case, matches post front matter
  name: "Display Name"
  color: "#hexcolor"      # solid color for the bar
  start: "YYYY-MM-DD"
  # end: "YYYY-MM-DD"    # omit for ongoing projects
  # repo: "user/repo"    # optional GitHub repo
```

## Step 2 — associate existing posts (if any)
If the user has existing posts that belong to this project, add `project: <slug>` to their front matter.

## Step 3 — confirm
List the posts now associated with the project and remind the user that the bar only appears when at least one associated post is visible in the filtered timeline.
