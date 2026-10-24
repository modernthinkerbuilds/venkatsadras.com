#!/usr/bin/env python3
"""Sync Substack posts into the site. Standard library only.

1. Reads the Substack RSS feed and merges it into data/posts.json. Posts are
   kept forever, even after they fall out of the feed's window.
2. Renders the post list into writing/index.html and the newest post into
   index.html, between the <!-- POSTS:START/END --> and <!-- LATEST:START/END -->
   markers.

If the feed can't be read, the existing posts are kept and the pages are still
rendered, so a Substack outage never breaks a deploy.

Run: python3 scripts/build.py            (network)
     python3 scripts/build.py --offline  (render only)
"""
import email.utils
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FEED = "https://venkatsadras.substack.com/feed"
POSTS = ROOT / "data" / "posts.json"
SERIES = ROOT / "data" / "series.json"

# Series keys, in the order the filter chips show them.
SERIES_LABELS = {
    "where-do-we-eat": "Where do we eat?",
    "life-with-agents": "Life with agents",
    "essays": "Essays",
}

# The search box and the series chips appear once there is enough to filter.
MIN_POSTS_FOR_SEARCH = 3


def load_json(path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def strip_tags(text):
    text = re.sub(r"<[^>]+>", " ", text or "")
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def fetch_feed():
    req = urllib.request.Request(FEED, headers={"User-Agent": "venkatsadras.com site build"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        root = ET.fromstring(resp.read())
    out = []
    for item in root.iter("item"):
        link = (item.findtext("link") or "").strip()
        if not link:
            continue
        date = email.utils.parsedate_to_datetime(item.findtext("pubDate") or "")
        out.append({
            "url": link,
            "slug": link.rstrip("/").rsplit("/", 1)[-1],
            "title": strip_tags(item.findtext("title")),
            "summary": strip_tags(item.findtext("description"))[:280],
            "date": date.date().isoformat() if date else "",
        })
    return out


def merge(existing, fresh):
    by_url = {p["url"]: p for p in existing}
    for p in fresh:
        by_url[p["url"]] = {**by_url.get(p["url"], {}), **p}
    return sorted(by_url.values(), key=lambda p: p.get("date", ""), reverse=True)


def series_of(post, mapping):
    return mapping.get(post.get("slug", ""), "essays")


def fmt_date(iso):
    if not iso:
        return ""
    y, m, d = (int(x) for x in iso.split("-"))
    months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()
    return f"{months[m - 1]} {d}, {y}"


def render_item(post, mapping):
    key = series_of(post, mapping)
    e = html.escape
    return (
        f'<li class="item" data-series="{e(key)}">'
        f'<p class="meta">{e(fmt_date(post.get("date", "")))} · {e(SERIES_LABELS.get(key, "Essays"))}</p>'
        f'<a class="title" href="{e(post["url"])}">{e(post["title"])}</a>'
        + (f'<p>{e(post["summary"])}</p>' if post.get("summary") else "")
        + "</li>"
    )


EMPTY_LIST = (
    '<div class="empty"><strong>Episode 1 of “Where do we eat?” is in progress.</strong> '
    'It appears here the day it goes out. '
    '<a href="https://venkatsadras.substack.com/subscribe">Subscribe to get it by email ↗</a>.</div>'
)


def render_toolbar(posts, mapping):
    """Search box and one chip per series that actually has a post."""
    keys = [k for k in SERIES_LABELS if any(series_of(p, mapping) == k for p in posts)]
    chips = "".join(
        f'<button class="chip" data-series="{k}" aria-pressed="false">{html.escape(SERIES_LABELS[k])}</button>'
        for k in keys)
    return (
        '<div class="toolbar">'
        '<input class="search" type="search" placeholder="Search posts" aria-label="Search posts">'
        '<div class="chips" role="group" aria-label="Filter by series">'
        '<button class="chip" data-series="all" aria-pressed="true">All</button>' + chips + "</div></div>"
    )


def render_latest(post, mapping):
    e = html.escape
    key = series_of(post, mapping)
    return (
        f'<a class="item latest" href="{e(post["url"])}">'
        f'<p class="meta">Latest · {e(fmt_date(post.get("date", "")))} · {e(SERIES_LABELS.get(key, "Essays"))}</p>'
        f'<span class="title">{e(post["title"])}</span>'
        + (f'<p>{e(post["summary"])}</p>' if post.get("summary") else "")
        + '<span class="go">Read it on Substack ↗</span></a>'
    )


def replace_between(text, name, body):
    pattern = re.compile(rf"(<!-- {name}:START -->)(.*?)(<!-- {name}:END -->)", re.S)
    if not pattern.search(text):
        raise SystemExit(f"marker {name} not found")
    return pattern.sub(lambda m: m.group(1) + body + m.group(3), text)


def main():
    posts = load_json(POSTS, [])
    mapping = load_json(SERIES, {})
    if "--offline" not in sys.argv:
        try:
            posts = merge(posts, fetch_feed())
        except Exception as exc:  # keep the deploy alive if Substack is down
            print(f"feed unavailable, keeping {len(posts)} saved posts: {exc}")
    POSTS.write_text(json.dumps(posts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    writing = ROOT / "writing" / "index.html"
    items = "\n".join(render_item(p, mapping) for p in posts)
    toolbar = render_toolbar(posts, mapping) if len(posts) >= MIN_POSTS_FOR_SEARCH else ""
    body = f'\n{toolbar}\n<ul class="list" data-filterable>\n{items}\n</ul>\n' if posts else f"\n{EMPTY_LIST}\n"
    writing.write_text(replace_between(writing.read_text(encoding="utf-8"), "POSTS", body), encoding="utf-8")

    home = ROOT / "index.html"
    latest = f"\n{render_latest(posts[0], mapping)}\n" if posts else "\n"
    home.write_text(replace_between(home.read_text(encoding="utf-8"), "LATEST", latest), encoding="utf-8")
    print(f"{len(posts)} posts rendered")


if __name__ == "__main__":
    main()
