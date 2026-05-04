---
layout: page
title: "Posts"
icon: fas fa-fw fa-blog    
order: 3                   
permalink: /posts/
---

<style>
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin: 20px 0;
}
.cat-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px 20px;
  background: var(--card-bg, #fff);
  cursor: pointer;
  transition: box-shadow .2s ease, transform .15s ease;
  text-decoration: none;
  color: inherit;
  display: block;
}
.cat-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,.08);
  transform: translateY(-2px);
  text-decoration: none;
  color: inherit;
}
.cat-card h2 {
  margin: 0 0 6px;
  font-size: 1.2rem;
}
.cat-card .cat-count {
  color: #6b7280;
  font-size: .9rem;
  margin: 0;
}

.post-list {
  list-style: none;
  padding: 0;
}
.post-list li {
  border-bottom: 1px solid #e5e7eb;
  padding: 14px 0;
}
.post-list li:last-child {
  border-bottom: none;
}
.post-list .post-date {
  color: #6b7280;
  font-size: .85rem;
  margin-bottom: 2px;
}
.post-list .post-title a {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
}
.post-list .post-title a:hover {
  color: #2563eb;
  text-decoration: underline;
}
.back-link {
  display: inline-block;
  margin-bottom: 16px;
  color: #3b82f6;
  text-decoration: none;
  font-size: .95rem;
}
.back-link:hover {
  text-decoration: underline;
}

@media(prefers-color-scheme:dark) {
  .cat-card { border-color: #374151; background: #111827; }
  .cat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.3); }
  .cat-card .cat-count { color: #9ca3af; }
  .post-list li { border-color: #374151; }
  .post-list .post-date { color: #9ca3af; }
}
</style>

<!-- Level 1: Top-level categories -->
<div id="level-1">
  <div class="cat-grid">
    {% assign top_cats = "" | split: "" %}
    {% for post in site.posts %}
      {% assign top = post.categories[0] %}
      {% unless top_cats contains top %}
        {% assign top_cats = top_cats | push: top %}
      {% endunless %}
    {% endfor %}
    {% assign top_cats = top_cats | sort %}
    {% for cat in top_cats %}
      {% assign cat_posts = site.posts | where_exp: "p", "p.categories[0] == cat" %}
      <a class="cat-card" href="#" onclick="showSubcats('{{ cat }}'); return false;">
        <h2>{{ cat }}</h2>
        <p class="cat-count">{{ cat_posts.size }} post{% if cat_posts.size != 1 %}s{% endif %}</p>
      </a>
    {% endfor %}
  </div>
</div>

<!-- Level 2: Sub-categories -->
<div id="level-2" style="display:none;">
  <a class="back-link" href="#" onclick="showLevel1(); return false;">&larr; All Categories</a>
  <h2 id="level-2-title"></h2>
  {% for cat in top_cats %}
  <div class="subcat-group" id="subcat-{{ cat | slugify }}" style="display:none;">
    <div class="cat-grid">
      {% assign sub_cats = "" | split: "" %}
      {% assign cat_posts = site.posts | where_exp: "p", "p.categories[0] == cat" %}
      {% for post in cat_posts %}
        {% if post.categories[1] %}
          {% assign sub = post.categories[1] %}
        {% else %}
          {% assign sub = "uncategorized" %}
        {% endif %}
        {% unless sub_cats contains sub %}
          {% assign sub_cats = sub_cats | push: sub %}
        {% endunless %}
      {% endfor %}
      {% assign sub_cats = sub_cats | sort %}
      {% for sub in sub_cats %}
        {% assign sub_posts = site.posts | where_exp: "p", "p.categories[0] == cat and p.categories[1] == sub" %}
        <a class="cat-card" href="#" onclick="showPosts('{{ cat }}', '{{ sub }}'); return false;">
          <h2>{{ sub }}</h2>
          <p class="cat-count">{{ sub_posts.size }} post{% if sub_posts.size != 1 %}s{% endif %}</p>
        </a>
      {% endfor %}
    </div>
  </div>
  {% endfor %}
</div>

<!-- Level 3: Post list -->
<div id="level-3" style="display:none;">
  <a class="back-link" id="level-3-back" href="#" onclick="return false;">&larr; Back</a>
  <h2 id="level-3-title"></h2>
  {% for cat in top_cats %}
    {% assign cat_posts = site.posts | where_exp: "p", "p.categories[0] == cat" %}
    {% assign sub_cats = "" | split: "" %}
    {% for post in cat_posts %}
      {% if post.categories[1] %}
        {% assign sub = post.categories[1] %}
      {% else %}
        {% assign sub = "uncategorized" %}
      {% endif %}
      {% unless sub_cats contains sub %}
        {% assign sub_cats = sub_cats | push: sub %}
      {% endunless %}
    {% endfor %}
    {% for sub in sub_cats %}
      {% assign sub_posts = site.posts | where_exp: "p", "p.categories[0] == cat and p.categories[1] == sub" | sort: "date" | reverse %}
      <ul class="post-list" id="posts-{{ cat | slugify }}-{{ sub | slugify }}" style="display:none;">
        {% for post in sub_posts %}
        <li>
          <div class="post-date">{{ post.date | date: "%Y-%m-%d" }}</div>
          <div class="post-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></div>
        </li>
        {% endfor %}
      </ul>
    {% endfor %}
  {% endfor %}
</div>

<script>
function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function showLevel1() {
  document.getElementById('level-1').style.display = 'block';
  document.getElementById('level-2').style.display = 'none';
  document.getElementById('level-3').style.display = 'none';
}

function showSubcats(cat) {
  document.getElementById('level-1').style.display = 'none';
  document.getElementById('level-2').style.display = 'block';
  document.getElementById('level-3').style.display = 'none';
  document.getElementById('level-2-title').textContent = cat;
  document.querySelectorAll('.subcat-group').forEach(function(el) { el.style.display = 'none'; });
  var target = document.getElementById('subcat-' + slug(cat));
  if (target) target.style.display = 'block';
}

function showPosts(cat, sub) {
  document.getElementById('level-1').style.display = 'none';
  document.getElementById('level-2').style.display = 'none';
  document.getElementById('level-3').style.display = 'block';
  document.getElementById('level-3-title').textContent = sub;
  var backLink = document.getElementById('level-3-back');
  backLink.onclick = function() { showSubcats(cat); return false; };
  document.querySelectorAll('.post-list').forEach(function(el) { el.style.display = 'none'; });
  var target = document.getElementById('posts-' + slug(cat) + '-' + slug(sub));
  if (target) target.style.display = 'block';
}
</script>
