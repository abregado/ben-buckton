Create a new Jekyll post for this portfolio site.

User arguments: $ARGUMENTS

If no arguments were given, ask the user for: the first tag (which acts as the post "type"), title, date, remaining tags, and whether it belongs to a project.

## Tags
Only four tag values are used. The first tag drives the card color, corner icon, and type label:
- `games` — game jams, game updates, physical games, tools
- `job` — employment history
- `life` — life events, milestones
- `meetup` — meetup events

Posts can have multiple tags, e.g. `[job, life]` or `[games, job]`.

## Front matter schema
```yaml
---
layout: post
title: "..."
date: YYYY-MM-DD
tags: [games]                    # one or more of: games, job, life, meetup
clickable: true          # false = static card with no link
project: slug            # optional — must match a slug in _data/projects.yml
image: /assets/images/x  # optional
featured: true           # optional — forces tile display on timeline
external_url: https://…  # optional — adds external link icon on chip
---
```

## Steps
1. Determine the filename: `_posts/YYYY-MM-DD-slugified-title.md`
2. Write the front matter using the schema above
3. Write realistic Markdown content appropriate to the post type
4. Create the file

Do not add the post to any other file — Jekyll picks it up automatically.
