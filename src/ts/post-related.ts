import { PostData, SiteData } from './types';

declare global {
  interface Window {
    __CURRENT_POST_URL__: string;
    __CURRENT_PROJECT__?: string;
  }
}

export function initRelatedPosts(data: SiteData): void {
  const container = document.getElementById('related-posts');
  if (!container) return;

  const currentUrl = window.__CURRENT_POST_URL__;
  const currentPost = data.posts.find(p => p.url === currentUrl);

  let related: PostData[];
  let heading: string;

  if (currentPost) {
    if (currentPost.project) {
      related = data.posts.filter(
        p => p.project === currentPost.project && p.url !== currentUrl
      );
      heading = 'Other posts in this project';
    } else if (currentPost.tags[0] === 'quote') {
      related = data.posts
        .filter(p => p.url !== currentUrl && p.tags[0] === 'quote')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      heading = 'Other quotes';
    } else {
      const tags = new Set(currentPost.tags);
      related = data.posts
        .filter(p => p.url !== currentUrl && p.tags.some(t => tags.has(t)))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6);
      heading = 'Related posts';
    }
  } else if (window.__CURRENT_PROJECT__) {
    // Project overview pages are not in site.posts — match by project slug
    related = data.posts.filter(p => p.project === window.__CURRENT_PROJECT__);
    heading = 'Posts in this project';
  } else {
    return;
  }

  if (related.length === 0) return;

  const h = document.createElement('h3');
  h.className = 'related-posts__heading';
  h.textContent = heading;
  container.appendChild(h);

  const chips = document.createElement('div');
  chips.className = 'related-posts__chips';
  for (const post of related) {
    chips.appendChild(post.tags[0] === 'quote'
      ? renderQuoteCard(post, data.baseurl ?? '')
      : renderChip(post, data.baseurl ?? ''));
  }
  container.appendChild(chips);
}

function tagColorVar(tag: string | undefined): string {
  if (!tag) return 'var(--c-default, #666)';
  return `var(--c-${tag})`;
}

function renderQuoteCard(post: PostData, baseurl: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'post-card-wrap post-card-wrap--quote';
  wrap.style.setProperty('--tag-color', tagColorVar(post.tags[0]));
  if (post.tags[0]) {
    wrap.style.setProperty('--edge-img', `url('${baseurl}/assets/edges/${post.tags[0]}.svg')`);
  }
  wrap.dataset['tags'] = post.tags.join(' ');

  const corner = document.createElement('div');
  corner.className = 'card-corner';
  corner.setAttribute('aria-hidden', 'true');

  const tag = post.clickable ? 'a' : 'div';
  const card = document.createElement(tag) as HTMLElement;
  card.className = `post-card quote-card post-type--${post.tags[0]}`;
  card.dataset['postUrl'] = post.url;
  if (post.clickable && card instanceof HTMLAnchorElement) {
    card.href = post.url;
  }

  if (post.excerpt) {
    const text = document.createElement('p');
    text.className = 'quote__text';
    text.textContent = post.excerpt;
    card.appendChild(text);
  }

  wrap.appendChild(corner);
  wrap.appendChild(card);

  if (post.external_url) {
    wrap.appendChild(buildInfoBtn(post));
  }

  return wrap;
}

function buildInfoBtn(post: PostData): HTMLElement {
  const btn = document.createElement('a');
  btn.className = 'quote__info-btn';
  btn.href = post.external_url!;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Source');
  btn.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 10.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z"/></svg>';
  return btn;
}

function renderChip(post: PostData, baseurl: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'post-card-wrap';
  wrap.style.setProperty('--tag-color', tagColorVar(post.tags[0]));
  if (post.tags[0]) {
    wrap.style.setProperty('--edge-img', `url('${baseurl}/assets/edges/${post.tags[0]}.svg')`);
  }

  const topBorder = document.createElement('div');
  topBorder.className = 'card-top-border';

  const corner = document.createElement('div');
  corner.className = 'card-corner';
  corner.setAttribute('aria-hidden', 'true');

  const tag = post.clickable ? 'a' : 'div';
  const card = document.createElement(tag) as HTMLElement;
  card.className = `post-card chip post-type--${post.tags[0]}`;
  card.dataset['postUrl'] = post.url;
  if (post.clickable && card instanceof HTMLAnchorElement) {
    card.href = post.url;
  }

  const title = document.createElement('span');
  title.className = 'chip__title post-title';
  title.textContent = post.title;
  card.appendChild(title);

  wrap.appendChild(topBorder);
  wrap.appendChild(corner);
  wrap.appendChild(card);

  if (post.external_url) {
    const row = document.createElement('div');
    row.className = 'chip-row';
    row.appendChild(wrap);
    row.appendChild(buildExtBtn(post));
    return row;
  }

  return wrap;
}

function buildExtBtn(post: PostData): HTMLElement {
  let domain = post.external_url!;
  try { domain = new URL(post.external_url!).hostname.replace(/^www\./, ''); } catch { /* keep raw */ }

  const btn = document.createElement('a');
  btn.className = 'chip__ext-btn';
  btn.href = post.external_url!;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', `Go to ${domain}`);
  btn.style.setProperty('--tag-color', tagColorVar(post.tags[0]));

  const icon = document.createElement('span');
  icon.className = 'chip__ext-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"/></svg>';

  const labelWrap = document.createElement('span');
  labelWrap.className = 'chip__ext-label-wrap';
  const label = document.createElement('span');
  label.className = 'chip__ext-label';
  label.textContent = domain;
  labelWrap.appendChild(label);

  btn.appendChild(icon);
  btn.appendChild(labelWrap);
  return btn;
}
