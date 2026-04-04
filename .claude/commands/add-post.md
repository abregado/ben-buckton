Create a new Jekyll post for this portfolio site.

User arguments: $ARGUMENTS

If no arguments were given, ask the user for: post type, title, date, tags, and whether it belongs to a project.

## Post types
`microblog` | `gamejam` | `game-update` | `laser-update` | `physical-game` | `github-project` | `meetup` | `life-event` | `recipe` | `job`

## Tag conventions
Nav preset tags (these make posts appear under that nav button):
- `beliefs` — appears under Beliefs
- `games` — appears under Games
- `cooking` — appears under Cooking
- `meetup` — appears under Meetup
- `life` — appears under Life

Other common tags: `code`, `making`, `jobs`

## Front matter schema
```yaml
---
layout: post
title: "..."
date: YYYY-MM-DD
type: <type>
tags: [tag1, tag2]
clickable: true          # false = static card with no link
project: slug            # optional — must match a slug in _data/projects.yml
image: /assets/images/x  # optional
---
```

## Steps
1. Determine the filename: `_posts/YYYY-MM-DD-slugified-title.md`
2. Write the front matter using the schema above
3. Write realistic Markdown content appropriate to the post type
4. Create the file

Do not add the post to any other file — Jekyll picks it up automatically.
