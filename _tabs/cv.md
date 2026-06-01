---
layout: page
title: CV
icon: fas fa-id-card
order: 5
---

<style>
.cv-pdf-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #111827;
  color: #fff !important;
  border-radius: 999px;
  padding: 10px 20px;
  font-size: .95rem;
  font-weight: 600;
  text-decoration: none !important;
  transition: background .15s ease, transform .15s ease;
}
.cv-pdf-btn:hover {
  background: #000;
  transform: translateY(-1px);
}
@media(prefers-color-scheme:dark){
  .cv-pdf-btn { background: #f3f4f6; color: #111827 !important; }
  .cv-pdf-btn:hover { background: #fff; }
}
</style>

<a class="cv-pdf-btn" href="{{ '/assets/cv.pdf' | relative_url }}" target="_blank" rel="noopener">
  <i class="fas fa-download"></i> Download CV (PDF)
</a>
