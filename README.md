# venkatsadras.com

Personal site of Venkat Sadras. Plain HTML and CSS with no framework, hosted on GitHub Pages.

## How it works

- **Pages:** `index.html` (home), `miya/`, `team/` (the agent wall, plus one page per agent), `rahat/`, `writing/`, `demos/`, `about/` and `404.html`. All styles live in `assets/site.css`. `assets/site.js` adds the mobile menu, the flows that light up once, the map video's autoplay and the search on the writing page; every page also works without it.
- **The map:** `assets/img/rahat-map.{webm,mp4}` is the moving map with `rahat-map.png` as its poster and as the still shown under reduced motion. `assets/img/og-card.png` (1200×630) is the share preview.
- **Posts:** posts are written on [Substack](https://venkatsadras.substack.com). `scripts/build.py` reads the Substack feed and saves every post to `data/posts.json`, where posts are kept even after they leave the feed. It then renders the list into `writing/index.html` and the newest post into the home page. The search box and series chips appear once there are three posts.
- **Series:** to put a post in a series, add its slug to `data/series.json`.
- **Deploy:** `.github/workflows/deploy.yml` runs on every push, every morning, and on demand. It syncs posts, saves any new ones back to the repo, and publishes the site.

## Changing the site

1. Edit the files.
2. `git pull --rebase` (the morning job may have saved new posts).
3. `git push`.

The site is live about a minute later.

## Your photo

`assets/img/venkat.jpg` (480×480, the round photo on the home page) and `assets/img/venkat-desk.jpg` (720×900, About). To change either, replace the file with one the same shape.

## Agent portraits

`assets/team/*.jpg` are the badger portraits, one per agent (480×480, shown in a circle). The `*.svg` robots are the earlier drawings, kept as fallbacks.

## Adding a demo

Add an `<li><article class="demo">…</article></li>` at the top of the list in `demos/index.html`, and update the "Demo" button in the Rahat section of `index.html`. Each demo shows only shipped behaviour and is labeled with its date.

## Adding an agent

Every surface that names, counts or groups the agents changes in the same commit, here and in the Rahat repo.

- **Its page:** `team/<slug>/index.html`, from another specialist's page (problem, why, what it does, where it helped, how it works, not built yet). The crumb names its group.
- **Both walls:** the grouped wall on `index.html` and `team/index.html`. Put it in its group (training and recovery, or family life; a new group gets its own dashed box). Chip: "Through Miya", or "Own door now · Miya soon".
- **The Miya page:** one card under "What I ask Miya", in group order, above the "Anything else" foundation.
- **The ring:** prev/next links on every agent page follow the wall order (Miya, then each group left to right).
- **Counts:** Home hero ("Seven agents"), the Rahat section and team lead on Home, the Team lede ("six specialists", "all seven"), the Rahat page stat strip, the door line, and the terms table if it joins the harness.
- **Elsewhere:** `sitemap.xml`; the share card (`assets/img/og-card.png`) if a count shows; About if it comes from my life (running links to Kipchoge).
- **The Rahat repo, same day:** the README agents table (in group order, with its status), the counts line, "Who's on it" if it joins the harness, the doors box, the profile README's agent sentence and its copy in the profile repo; the architect updates ARCHITECTURE.md (section 6 and Appendix B) and the map page.
- **Before the commit:** the portrait to the shared spec (480×480), and every new line checked against `private/privacy_terms.txt`.
