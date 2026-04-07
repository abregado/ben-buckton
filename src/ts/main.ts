import { SiteData } from './types';
import { TagFilter } from './tag-filter';
import { Timeline } from './timeline';
import { initRelatedPosts } from './post-related';

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
    syncTagButtons();
  });

  // ── Style selector ───────────────────────────────────────────────────────
  document.querySelectorAll<HTMLElement>('.top-nav__style-btn').forEach(btn => {
    const theme = btn.dataset['themeSelect']!;
    if (theme === document.documentElement.dataset['theme']) {
      btn.classList.add('is-active');
    }
    btn.addEventListener('click', () => {
      const current = document.documentElement.dataset['theme'];
      document.querySelectorAll('.top-nav__style-btn').forEach(b => b.classList.remove('is-active'));
      if (current === theme) {
        delete document.documentElement.dataset['theme'];
        localStorage.setItem('site-theme', 'none');
      } else {
        document.documentElement.dataset['theme'] = theme;
        localStorage.setItem('site-theme', theme);
        btn.classList.add('is-active');
      }
    });
  });

  // ── Related posts (post pages only) ──────────────────────────────────────
  if (document.getElementById('related-posts')) {
    initRelatedPosts(data);
  }
}

// Restore theme immediately — default to inkwell on first visit
const _savedTheme = localStorage.getItem('site-theme') ?? 'inkwell';
if (_savedTheme !== 'none') {
  document.documentElement.dataset['theme'] = _savedTheme;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
