---
layout: page
title: Projects
icon: fas fa-flask
order: 3
---

<style>
/* === EDIT HERE: thumbnail size for project cards === */
:root {
  --tl-thumb-width: 450px;   /* thumbnail width (height follows the image's native ratio) */
  --tl-thumb-ratio: 25 / 9;  /* aspect ratio used only by the empty-state placeholder */
}

.tl-intro {
  color: #6b7280;
  margin: 4px 0 28px;
  font-size: .92rem;
}

.timeline {
  position: relative;
  padding-left: 28px;
}
.timeline::before {
  content: '';
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 7px;
  width: 2px;
  background: #e5e7eb;
}

.tl-row {
  position: relative;
  margin-bottom: 24px;
}
.tl-row::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 24px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #9ca3af;
  z-index: 1;
}
.tl-row:first-child::before {
  border-color: #111827;
  background: #111827;
}

.tl-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px 20px;
  background: var(--card-bg, #fff);
  transition: border-color .15s ease, box-shadow .15s ease;
}
.tl-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 14px rgba(0,0,0,.04);
}

.tl-period-badge {
  display: block;
  width: fit-content;
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .04em;
  color: #6b7280;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 2px 9px;
  border-radius: 999px;
  margin: 6px 0 12px;
}

.tl-thumb {
  display: block;
  width: var(--tl-thumb-width);
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 0 0 12px;
}
.tl-thumb-placeholder {
  display: flex;
  width: var(--tl-thumb-width);
  max-width: 100%;
  aspect-ratio: var(--tl-thumb-ratio);
  border-radius: 8px;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: .68rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  border: 1px dashed #d1d5db;
}

.tl-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: #111827;
  line-height: 1.3;
}
.tl-goal {
  font-size: .92rem;
  line-height: 1.6;
  margin: 0 0 12px;
  color: #374151;
}
.tl-goal .hl,
.tl-section .hl {
  font-weight: 600;
  color: #111827;
}

.tl-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;
}
.tl-tech-pill {
  font-size: .72rem;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 999px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}

.tl-details {
  margin-top: 12px;
  border-top: 1px solid #f3f4f6;
  padding-top: 10px;
}
.tl-details summary {
  font-size: .82rem;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: #6b7280;
  cursor: pointer;
  list-style: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
}
.tl-details summary::-webkit-details-marker { display: none; }
.tl-details summary::marker { content: ''; }
.tl-details summary::after {
  content: '▸';
  font-size: .8em;
  transition: transform .2s ease;
  display: inline-block;
}
.tl-details[open] summary::after { transform: rotate(90deg); }
.tl-details summary:hover { color: #111827; }

.tl-section { margin-top: 14px; }
.tl-section h4 {
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #6b7280;
  margin: 0 0 6px;
}
.tl-section ul {
  margin: 0;
  padding-left: 18px;
  font-size: .9rem;
  line-height: 1.55;
  color: #374151;
}
.tl-section li { margin-bottom: 4px; }

@media (max-width: 640px) {
  .timeline { padding-left: 22px; }
  .timeline::before { left: 5px; }
  .tl-row::before { left: -22px; width: 12px; height: 12px; top: 22px; }
}

@media (prefers-color-scheme: dark) {
  .tl-intro { color: #9ca3af; }
  .timeline::before { background: #374151; }
  .tl-row::before { background: #111827; border-color: #6b7280; }
  .tl-row:first-child::before { background: #f3f4f6; border-color: #f3f4f6; }
  .tl-card { background: #111827; border-color: #374151; }
  .tl-card:hover { border-color: #4b5563; }
  .tl-period-badge { background: #1f2937; border-color: #374151; color: #9ca3af; }
  .tl-thumb-placeholder { background: linear-gradient(135deg, #1f2937, #111827); border-color: #374151; color: #6b7280; }
  .tl-title, .tl-goal .hl, .tl-section .hl { color: #f3f4f6; }
  .tl-goal { color: #d1d5db; }
  .tl-tech-pill { background: #1f2937; border-color: #374151; color: #9ca3af; }
  .tl-details { border-color: #1f2937; }
  .tl-details summary { color: #9ca3af; }
  .tl-details summary:hover { color: #f3f4f6; }
  .tl-section h4 { color: #9ca3af; }
  .tl-section ul { color: #d1d5db; }
}
</style>

<p class="tl-intro">Selected research and engineering projects, in reverse chronological order.</p>

<div class="timeline">
  {% for proj in site.data.research_projects %}
  <div class="tl-row">
    <div class="tl-card">
      {% unless proj.hide_thumb %}
        {% if proj.thumbnail and proj.thumbnail != "" %}
          <img class="tl-thumb" src="{{ proj.thumbnail | relative_url }}" alt="{{ proj.title }}">
        {% else %}
          <div class="tl-thumb-placeholder">Thumbnail coming soon</div>
        {% endif %}
      {% endunless %}

      <span class="tl-period-badge">{{ proj.period }}</span>

      <h3 class="tl-title">{{ proj.title }}</h3>
      <p class="tl-goal">{{ proj.goal }}</p>

      {% if proj.tech and proj.tech.size > 0 %}
      <div class="tl-tech">
        {% for t in proj.tech %}
        <span class="tl-tech-pill">{{ t }}</span>
        {% endfor %}
      </div>
      {% endif %}

      {% assign role_size = proj.role | default: empty | size %}
      {% assign results_size = proj.results | default: empty | size %}
      {% if role_size > 0 or results_size > 0 %}
      <details class="tl-details">
        <summary>Details</summary>

        {% if role_size > 0 %}
        <div class="tl-section">
          <h4>Role</h4>
          <ul>
            {% for r in proj.role %}<li>{{ r }}</li>{% endfor %}
          </ul>
        </div>
        {% endif %}

        {% if results_size > 0 %}
        <div class="tl-section">
          <h4>Results</h4>
          <ul>
            {% for r in proj.results %}<li>{{ r }}</li>{% endfor %}
          </ul>
        </div>
        {% endif %}
      </details>
      {% endif %}
    </div>
  </div>
  {% endfor %}
</div>
