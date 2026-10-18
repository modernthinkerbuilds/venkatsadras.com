# venkatsadras.com

Personal site of Venkat Sadras. Plain HTML and CSS with no framework, hosted on GitHub Pages.

## How it works

- **Pages:** `index.html` (home), `rahat/`, `writing/`, `demos/` and `about/`. All styles live in `assets/site.css`. `assets/site.js` adds the mobile menu and the search on the writing page; every page also works without it.
- **Posts:** posts are written on [Substack](https://venkatsadras.substack.com). `scripts/build.py` reads the Substack feed and saves every post to `data/posts.json`, where posts are kept even after they leave the feed. It then renders the list into `writing/index.html` and the newest post into the home page.
- **Series:** to put a post in a series, add its slug to `data/series.json`.
- **Deploy:** `.github/workflows/deploy.yml` runs on every push, every morning, and on demand. It syncs posts, saves any new ones back to the repo, and publishes the site.

## Changing the site

1. Edit the files.
2. `git pull --rebase` (the morning job may have saved new posts).
3. `git push`.

The site is live about a minute later.

## Adding a demo

Add an `<li><article class="demo">…</article></li>` at the top of the list in `demos/index.html`, and update the "Latest demo" card in `index.html`. Each demo shows only shipped behaviour and is labeled with its date.
