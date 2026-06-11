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

/* second-level (field) filter, shown only when a top category with sub-fields is active */
.subfilter-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: -8px 0 24px;
  padding: 12px 0 0;
}
.subfilter-chips[hidden] { display: none; }
.subfilter-label {
  font-size: .72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #9ca3af;
  margin-right: 2px;
}
.subchip {
  font-size: .76rem;
  padding: 4px 11px;
}
.subchip[hidden] { display: none; }
.chip-count {
  font-weight: 600;
  opacity: .55;
  margin-left: 4px;
  font-variant-numeric: tabular-nums;
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
.feed-version {
  font-size: .66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  padding: 2px 8px;
  border-radius: 999px;
  margin-left: auto;
}
.feed-version.short { background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; }
.feed-version.long  { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }
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
  .subfilter-label { color: #6b7280; }
  .feed-card { background: #111827; border-color: #374151; }
  .feed-card:hover { border-color: #6b7280; }
  .feed-date { color: #9ca3af; }
  .feed-cat-pill { background: #1f2937; border-color: #374151; color: #9ca3af; }
  .feed-version.short { background: #064e3b; border-color: #065f46; color: #6ee7b7; }
  .feed-version.long  { background: #1e3a5f; border-color: #1e40af; color: #93c5fd; }
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
  <button class="chip active" data-filter="all" type="button">All <span class="chip-count">{{ site.posts | size }}</span></button>
  {% for cat in top_cats %}
    {% assign top_count = 0 %}
    {% for post in site.posts %}
      {% assign ptop = post.categories[0] | default: "uncategorized" %}
      {% if ptop == cat %}{% assign top_count = top_count | plus: 1 %}{% endif %}
    {% endfor %}
    <button class="chip" data-filter="{{ cat | slugify }}" type="button">{{ cat }} <span class="chip-count">{{ top_count }}</span></button>
  {% endfor %}
</div>

<div class="subfilter-chips" id="subfilter-chips" hidden>
  <span class="subfilter-label">Field</span>
  {% for cat in top_cats %}
    {% assign subs = "" | split: "" %}
    {% for post in site.posts %}
      {% assign ptop = post.categories[0] | default: "uncategorized" %}
      {% if ptop == cat and post.categories[1] %}
        {% assign psub = post.categories[1] %}
        {% unless subs contains psub %}
          {% assign subs = subs | push: psub %}
        {% endunless %}
      {% endif %}
    {% endfor %}
    {% if subs.size > 0 %}
      {% assign subs = subs | sort %}
      {% assign parent_count = 0 %}
      {% for post in site.posts %}
        {% assign ptop = post.categories[0] | default: "uncategorized" %}
        {% if ptop == cat %}{% assign parent_count = parent_count | plus: 1 %}{% endif %}
      {% endfor %}
      <button class="chip subchip active" data-parent="{{ cat | slugify }}" data-sub="all" type="button" hidden>All <span class="chip-count">{{ parent_count }}</span></button>
      {% for sub in subs %}
        {% assign sub_count = 0 %}
        {% for post in site.posts %}
          {% assign ptop = post.categories[0] | default: "uncategorized" %}
          {% if ptop == cat and post.categories[1] == sub %}{% assign sub_count = sub_count | plus: 1 %}{% endif %}
        {% endfor %}
        <button class="chip subchip" data-parent="{{ cat | slugify }}" data-sub="{{ sub | slugify }}" type="button" hidden>{{ sub }} <span class="chip-count">{{ sub_count }}</span></button>
      {% endfor %}
    {% endif %}
  {% endfor %}
</div>

<div class="feed" id="feed">
  {% assign sorted_posts = site.posts | sort: "date" | reverse %}
  {% for post in sorted_posts %}
    {% assign top = post.categories[0] | default: "uncategorized" %}
    {% assign sub = post.categories[1] | default: "" %}
    {% assign version = "" %}
    {% if post.tags contains "short" %}{% assign version = "short" %}{% elsif post.tags contains "long" %}{% assign version = "long" %}{% endif %}
    <a href="{{ post.url | relative_url }}" class="feed-card" data-cat="{{ top | slugify }}" data-sub="{{ sub | slugify }}">
      <div class="feed-meta">
        <span class="feed-date">{{ post.date | date: "%Y-%m-%d" }}</span>
        <span class="feed-cat-pill">{{ top }}</span>
        {% if post.categories[1] %}
          <span class="feed-cat-pill">{{ post.categories[1] }}</span>
        {% endif %}
        {% if version != "" %}
          <span class="feed-version {{ version }}">{{ version }}</span>
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
    var subBar = document.getElementById('subfilter-chips');
    var subChips = subBar.querySelectorAll('.subchip');
    var cards = document.querySelectorAll('#feed .feed-card');
    var emptyMsg = document.getElementById('feed-empty');
    var topFilter = 'all';
    var subFilter = 'all';

    function apply() {
      var visible = 0;
      cards.forEach(function (card) {
        var show = (topFilter === 'all' || card.dataset.cat === topFilter) &&
                   (subFilter === 'all' || card.dataset.sub === subFilter);
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });
      emptyMsg.classList.toggle('show', visible === 0);
    }

    function syncSubBar() {
      // show only the sub-chips belonging to the active top category
      var anyForParent = false;
      subChips.forEach(function (sc) {
        var match = sc.dataset.parent === topFilter;
        sc.hidden = !match;
        sc.classList.toggle('active', match && sc.dataset.sub === 'all');
        if (match) anyForParent = true;
      });
      subBar.hidden = (topFilter === 'all') || !anyForParent;
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        topFilter = chip.dataset.filter;
        subFilter = 'all';
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        syncSubBar();
        apply();
      });
    });

    subChips.forEach(function (sc) {
      sc.addEventListener('click', function () {
        subFilter = sc.dataset.sub;
        subChips.forEach(function (c) {
          if (c.dataset.parent === topFilter) c.classList.remove('active');
        });
        sc.classList.add('active');
        apply();
      });
    });
  })();
</script>
