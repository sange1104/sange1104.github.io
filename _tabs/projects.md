---
layout: page
title: Projects
icon: fas fa-briefcase
order: 1
--- 

<style>
.proj-card {
  display:grid;
  grid-template-columns:1.4fr 2fr;
  gap:14px;
  align-items:center;
  border:1px solid #e5e7eb;
  border-radius:12px;
  padding:12px 14px;
  margin:12px 0;
  background:var(--card-bg,#fff);
}
.proj-thumb {
  width:100%;
  border-radius:8px;
  object-fit:cover;
}
.proj-title {
  font-size:1.05rem;
  font-weight:700;
  margin:0 0 3px;
  line-height:1.25;
}
.proj-title a {
  color:inherit;
  text-decoration:none;
  transition:color .2s ease;
}
.proj-title a:hover {
  color:#2563eb;
  text-decoration:underline;
}
.proj-authors .me {
  font-weight: 700; 
}
.proj-authors {
  color:#6b7280;
  margin:0 0 4px;
  line-height:1.3;
} 
.proj-venue {
  color:#3b82f6;
  margin:0;
  line-height:1.2;
  text-decoration:none;
}
@media(max-width:820px){
  .proj-card{grid-template-columns:1fr}
}
@media(prefers-color-scheme:dark){
  .proj-card{border-color:#374151;background:#111827}
  .proj-authors{color:#9ca3af}
  .proj-venue{color:#60a5fa;}
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