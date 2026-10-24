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
