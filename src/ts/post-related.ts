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
    chips.appendChild(renderChip(post));
  }
  container.appendChild(chips);
}

function tagColorVar(type: string): string {
  const slug = type === 'github-project' ? 'github' : type;
  return `var(--c-${slug})`;
}

function renderChip(post: PostData): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'post-card-wrap';
  wrap.style.setProperty('--tag-color', tagColorVar(post.type));
  wrap.style.setProperty('--edge-img', `url('/assets/edges/${post.type}.svg')`);

  const topBorder = document.createElement('div');
  topBorder.className = 'card-top-border';

  const corner = document.createElement('div');
  corner.className = 'card-corner';
  corner.setAttribute('aria-hidden', 'true');

  const tag = post.clickable ? 'a' : 'div';
  const card = document.createElement(tag) as HTMLElement;
  card.className = `post-card chip post-type--${post.type}`;
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
  return wrap;
}
