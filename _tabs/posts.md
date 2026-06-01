---
layout: page
title: "Posts"
icon: fas fa-fw fa-blog
order: 4
permalink: /posts/
---

<style>
.post-feed-intro {
  color: #374151;
  font-size: .95rem;
  line-height: 1.55;
  margin: 4px 0 8px;
}
.post-feed-meta {
  color: #9ca3af;
  font-size: .82rem;
  margin: 0 0 20px;
  letter-spacing: .02em;
}
@media (prefers-color-scheme: dark) {
  .post-feed-intro { color: #d1d5db; }
  .post-feed-meta { color: #6b7280; }
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}
.chip {
  font-size: .82rem;
  font-weight: 600;
  letter-spacing: .04em;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: var(--card-bg, #fff);
  color: #6b7280;
  cursor: pointer;
  transition: all .15s ease;
}
.chip:hover {
  border-color: #6b7280;
  color: #111827;
}
.chip.active {
  background: #111827;
  border-color: #111827;
  color: #fff;
}

.feed { display: flex; flex-direction: column; }
.feed-card {
  display: block;
  padding: 16px 18px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  margin-bottom: 10px;
  background: var(--card-bg, #fff);
  text-decoration: none !important;
  color: inherit !important;
  transition: border-color .15s ease, box-shadow .15s ease, transform .15s ease;
}
.feed-card:hover {
  border-color: #9ca3af;
  box-shadow: 0 4px 12px rgba(0,0,0,.04);
  transform: translateY(-1px);
}
.feed-card.hidden { display: none; }

.feed-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
}
.feed-date {
  font-size: .78rem;
  color: #6b7280;
  letter-spacing: .03em;
}
.feed-cat-pill {
  font-size: .68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}
.feed-title {
  font-size: 1.02rem;
  font-weight: 700;
  margin: 0;
  color: #111827;
  line-height: 1.35;
}

.feed-empty {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: .92rem;
  display: none;
}
.feed-empty.show { display: block; }

@media (prefers-color-scheme: dark) {
  .post-feed-intro { color: #9ca3af; }
  .filter-chips { border-color: #374151; }
  .chip { background: #111827; border-color: #374151; color: #9ca3af; }
  .chip:hover { border-color: #9ca3af; color: #f3f4f6; }
  .chip.active { background: #f3f4f6; color: #111827; border-color: #f3f4f6; }
  .feed-card { background: #111827; border-color: #374151; }
  .feed-card:hover { border-color: #6b7280; }
  .feed-date { color: #9ca3af; }
  .feed-cat-pill { background: #1f2937; border-color: #374151; color: #9ca3af; }
  .feed-title { color: #f3f4f6; }
  .feed-empty { color: #6b7280; }
}
</style>

<p class="post-feed-intro">These are casual study notes I jot down while reading papers.</p>
<p class="post-feed-meta">{{ site.posts | size }} posts · Filter by category below.</p>

{% assign top_cats = "" | split: "" %}
{% for post in site.posts %}
  {% assign top = post.categories[0] | default: "uncategorized" %}
  {% unless top_cats contains top %}
    {% assign top_cats = top_cats | push: top %}
  {% endunless %}
{% endfor %}
{% assign top_cats = top_cats | sort %}

<div class="filter-chips" id="filter-chips">
  <button class="chip active" data-filter="all" type="button">All</button>
  {% for cat in top_cats %}
    <button class="chip" data-filter="{{ cat | slugify }}" type="button">{{ cat }}</button>
  {% endfor %}
</div>

<div class="feed" id="feed">
  {% assign sorted_posts = site.posts | sort: "date" | reverse %}
  {% for post in sorted_posts %}
    {% assign top = post.categories[0] | default: "uncategorized" %}
    <a href="{{ post.url | relative_url }}" class="feed-card" data-cat="{{ top | slugify }}">
      <div class="feed-meta">
        <span class="feed-date">{{ post.date | date: "%Y-%m-%d" }}</span>
        <span class="feed-cat-pill">{{ top }}</span>
        {% if post.categories[1] %}
          <span class="feed-cat-pill">{{ post.categories[1] }}</span>
        {% endif %}
      </div>
      <p class="feed-title">{{ post.title }}</p>
    </a>
  {% endfor %}
</div>

<div class="feed-empty" id="feed-empty">No posts in this category.</div>

<script>
  (function () {
    var chips = document.querySelectorAll('#filter-chips .chip');
    var cards = document.querySelectorAll('#feed .feed-card');
    var emptyMsg = document.getElementById('feed-empty');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var filter = chip.dataset.filter;
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var visible = 0;
        cards.forEach(function (card) {
          var show = filter === 'all' || card.dataset.cat === filter;
          card.classList.toggle('hidden', !show);
          if (show) visible++;
        });
        emptyMsg.classList.toggle('show', visible === 0);
      });
    });
  })();
</script>
