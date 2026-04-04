import { SiteData, NavPreset } from './types';
import { TagFilter } from './tag-filter';
import { Timeline } from './timeline';
import { ProjectBars } from './project-bars';

declare global {
  interface Window { __SITE_DATA__: SiteData; }
}

function init(): void {
  const data = window.__SITE_DATA__;
  if (!data) return;

  const filter = new TagFilter();

  // ── Timeline ──────────────────────────────────────────────────────────────
  const timelineEl = document.getElementById('timeline');
  let timeline: Timeline | null = null;
  if (timelineEl) {
    timeline = new Timeline(timelineEl, data.posts, filter);
    timeline.render();
  }

  // ── Divider toggle ────────────────────────────────────────────────────────
  const dividerToggle = document.getElementById('divider-toggle');
  dividerToggle?.addEventListener('click', () => {
    timeline?.toggleDividers();
    const pressed = dividerToggle.getAttribute('aria-pressed') === 'true';
    dividerToggle.setAttribute('aria-pressed', String(!pressed));
  });

  // ── Tag filter UI ─────────────────────────────────────────────────────────
  const tagFilterEl = document.getElementById('tag-filter-tags');
  if (tagFilterEl) {
    const allTags = [...new Set(data.posts.flatMap(p => p.tags))].sort();

    for (const tag of allTags) {
      const btn = document.createElement('button');
      btn.className = 'tag-btn';
      btn.textContent = tag;
      btn.dataset['tag'] = tag;
      btn.dataset['state'] = 'ignored';
      btn.addEventListener('click', () => {
        filter.toggle(tag);
        syncTagButtons();
      });
      tagFilterEl.appendChild(btn);
    }
  }

  function syncTagButtons(): void {
    document.querySelectorAll<HTMLElement>('.tag-btn').forEach(btn => {
      const tag = btn.dataset['tag']!;
      btn.dataset['state'] = filter.getState(tag);
    });
  }

  // ── Clear filters ─────────────────────────────────────────────────────────
  document.getElementById('tag-filter-clear')?.addEventListener('click', () => {
    filter.clear();
    clearNavActive();
    syncTagButtons();
  });

  // ── Nav preset buttons ────────────────────────────────────────────────────
  document.querySelectorAll<HTMLElement>('.top-nav__filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset['preset'] as NavPreset | undefined;
      if (!preset) return;

      const isActive = btn.getAttribute('aria-pressed') === 'true';
      clearNavActive();

      if (isActive) {
        filter.clear();
      } else {
        filter.applyNavPreset(preset);
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('is-active');
      }
      syncTagButtons();
    });
  });

  function clearNavActive(): void {
    document.querySelectorAll<HTMLElement>('.top-nav__filter-btn').forEach(b => {
      b.setAttribute('aria-pressed', 'false');
      b.classList.remove('is-active');
    });
  }

  // ── Project bars ──────────────────────────────────────────────────────────
  const projectBarsEl = document.getElementById('project-bars');
  if (projectBarsEl && timelineEl && data.projects?.length > 0) {
    const projectBars = new ProjectBars(projectBarsEl, timelineEl, data.projects, data.posts);
    projectBars.render();

    // Re-position bars after each filter change (timeline re-renders first)
    filter.addListener(() => {
      requestAnimationFrame(() => projectBars.updatePositions());
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
