---
layout: page
title: Publications
icon: fas fa-file-alt
order: 2
---

<style>
.proj-card {
  display:grid;
  grid-template-columns:185px 1fr;
  gap:14px;
  align-items:center;
  border:1px solid #e5e7eb;
  border-radius:10px;
  padding:11px 13px;
  margin:10px 0;
  background:var(--card-bg,#fff);
}
.proj-thumb {
  display:block;
  width:185px;
  max-width:100%;
  height:auto;
  border-radius:7px;
}
.proj-title {
  font-size:1.1rem;
  font-weight:700;
  margin:0 0 3px;
  line-height:1.3;
}
.proj-title a {
  color:inherit;
  text-decoration:none;
  transition:color .2s ease;
}
.proj-title a:hover {
  color:#111827;
  text-decoration:underline;
}
.proj-authors .me { font-weight: 700; }
.proj-authors {
  color:#6b7280;
  margin:0 0 3px;
  line-height:1.3;
}
.proj-venue {
  color:#6b7280;
  margin:0;
  line-height:1.2;
  text-decoration:none;
  font-style: italic;
}

@media(max-width:820px){
  .proj-card{grid-template-columns:1fr}
}
@media(prefers-color-scheme:dark){
  .proj-card{border-color:#374151;background:#111827}
  .proj-authors{color:#9ca3af}
  .proj-venue{color:#9ca3af;}
}
</style>

{% for p in site.data.projects %}
<div class="proj-card">
  <img class="proj-thumb" src="{{ p.image | relative_url }}" alt="{{ p.title }}">
  <div>
    <p class="proj-title">
      <a href="{{ p.url | relative_url }}" target="_blank" rel="noopener">{{ p.title }}</a>
    </p>
    {% assign myname = "Lee, S." %}
    {% assign highlighted_authors = p.authors | replace: myname, '<span class="me">Lee, S.</span>' %}
    <p class="proj-authors">{{ highlighted_authors }}</p>
    <p class="proj-venue">{{ p.venue }}</p>
  </div>
</div>
{% endfor %}
