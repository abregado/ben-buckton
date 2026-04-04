Personal Portfolio Website Blog
The project should use vanilla typescript, html and css. It will be hosted on github pages. It does not use cookies at all, and will not have a cookies confirmation pop up. We will leverage the features of Jekyll for this project.

Top Nav bar
Beliefs - limits the Timeline to microblog posts
Games - limits the Timeline to game project posts
Cooking - limits the timeline to recipe posts
Meetup - limits the timeline to meetup posts
Life - limits the timeline to life events and jobs

Timeline
Lists all posts in chronological order
Adds year numbers as dividers
Adds month abbreviations rotated 90 degrees on the left when there is a card in that month. The month abbreviation extends to include all cards in that month.
If a month has no posts, then no month name is shown.
If a year has no posts, then no heading is shown for it.
There is a toggle button which removes the month abbreviations and year headers, which results in the posts just being listed without division.
Latest post is always shown in the larger card style
There are tag filters (one per tag) at the top with three states (allowed/disallowed/ignored). Posts with at least one Allowed tag can show up, Posts with at least one Disallowed tag cannot show up. Ignored tags are ignored for the purposes of filtering. Clicking a tag filter cycles between states.
There is a button to clear filters

Types of post
Microblog
Gamejams
Game Project Update
Laser Project Update
Physical game projects
Github projects
Meetup news
Life event
Recipe cooking post
Jobs

Make ONE post of each type for style testing. Spread them out over 2020-2026 to test timeline formatting.

Posts are viewed in the timeline and landing page in two different ways. The first is a condensed card version that only includes the heading. The other is a larger card version that contains a truncated version of the content, the heading and a small version of the first image in the post if it has one. By default both are clickable and lead to a full page version of the post. Each post has a boolean in the front matter which decides if it is clickable. Give these two card version names for us to use in further discussion. Post cards do not show the date by default.

Each type of post should have a different color flourish and an svg icon flourish that goes in one of the corners of both the link cards and the full page.

We also need some way to show ongoing projects in the timeline. Each project might include multiple posts of various types. But a project should have a start date. It could have an end date. If no end date then we assume it is ongoing so the end date is today. On the timeline all ongoing projects are displayed as a thin vertical bars on the right. These connect various posts together and show there is a connection between them. On the top of the visible part of the bar is an arrow that takes the view up to the next recent post card associated with that project. At the bottom of the visible bar is an arrow that takes the view down to the next oldest post card. Hovering a bar should highlight associated cards that are currently visible. Each project can also have a github repo associated with it, and then it should get gradient coloring based on my activity on the project. Projects that have no posts associated with it are not shown.
