import { PostData, ProjectData, MONTH_ABBREVS } from './types';
import { TagFilter } from './tag-filter';

export class Timeline {
  private showDividers = true;
  private container: HTMLElement;
  private posts: PostData[];
  private projects: ProjectData[];
  private filter: TagFilter;
  private baseurl: string;

  constructor(container: HTMLElement, posts: PostData[], projects: ProjectData[], filter: TagFilter, baseurl = '') {
    this.container = container;
    this.projects = projects;
    this.baseurl = baseurl;
    this.posts = [...posts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    this.filter = filter;
    this.filter.addListener(() => this.render());
  }

  toggleDividers(): void {
    this.showDividers = !this.showDividers;
    this.container.classList.toggle('timeline--no-dividers', !this.showDividers);
  }

  render(): void {
    this.container.innerHTML = '';

    const visible = this.posts.filter(p => this.filter.passes(p));

    if (visible.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'timeline__empty';
      empty.textContent = 'No posts match the current filters.';
      this.container.appendChild(empty);
      return;
    }

    // Group newest-first by year → month.
    const byYear = new Map<number, Map<number, PostData[]>>();
    for (const post of visible) {
      const [y, m] = post.date.split('-').map(Number) as [number, number];
      if (!byYear.has(y)) byYear.set(y, new Map());
      const byMonth = byYear.get(y)!;
      if (!byMonth.has(m)) byMonth.set(m, []);
      byMonth.get(m)!.push(post);
    }

    const years = [...byYear.keys()].sort((a, b) => b - a);
    let isFirst = true;

    for (const year of years) {
      const yearEl = document.createElement('div');
      yearEl.className = 'timeline__year-divider';
      yearEl.textContent = String(year);
      this.container.appendChild(yearEl);

      const months = [...byYear.get(year)!.keys()].sort((a, b) => b - a);
      for (const month of months) {
        const section = document.createElement('div');
        section.className = 'timeline__month-section';

        const labelCol = document.createElement('div');
        labelCol.className = 'timeline__month-label';
        const labelSpan = document.createElement('span');
        labelSpan.textContent = MONTH_ABBREVS[month - 1]!;
        labelCol.appendChild(labelSpan);

        const cardsCol = document.createElement('div');
        cardsCol.className = 'timeline__month-cards';

        for (const post of byYear.get(year)!.get(month)!) {
          cardsCol.appendChild((isFirst || post.featured) ? this.renderTile(post) : this.renderChip(post));
          isFirst = false;
        }

        section.appendChild(labelCol);
        section.appendChild(cardsCol);
        this.container.appendChild(section);
      }
    }
  }

  // ── Card renderers ────────────────────────────────────────────────────────

  private renderChip(post: PostData): HTMLElement {
    const card = this.createCardElement(post, 'chip');

    const title = document.createElement('span');
    title.className = 'chip__title post-title';
    title.textContent = post.title;

    card.appendChild(title);

    if (post.external_url) {
      card.classList.add('chip--has-external');
    }

    const wrap = this.wrapCard(post, card);

    if (post.external_url) {
      const extLink = document.createElement('a');
      extLink.className = 'chip__external-link';
      extLink.href = post.external_url;
      extLink.target = '_blank';
      extLink.rel = 'noopener noreferrer';
      extLink.setAttribute('aria-label', 'Open external link');
      extLink.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"/></svg>';
      wrap.appendChild(extLink);
    }

    return wrap;
  }

  private renderTile(post: PostData): HTMLElement {
    const card = this.createCardElement(post, 'tile');

    const body = document.createElement('div');
    body.className = 'tile__body';

    const typeLabel = document.createElement('span');
    typeLabel.className = 'tile__type-label';
    const rawType = post.tags[0] ?? '';
    typeLabel.textContent = rawType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const title = document.createElement('h2');
    title.className = 'tile__title post-title';
    title.textContent = post.title;

    body.appendChild(typeLabel);
    body.appendChild(title);

    if (post.excerpt) {
      const excerpt = document.createElement('p');
      excerpt.className = 'tile__excerpt post-excerpt';
      excerpt.textContent = post.excerpt;
      body.appendChild(excerpt);
    }

    card.appendChild(body);

    if (post.image) {
      const img = document.createElement('img');
      img.className = 'tile__image';
      img.src = post.image;
      img.alt = post.title;
      img.loading = 'lazy';
      card.appendChild(img);
    }

    return this.wrapCard(post, card);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private wrapCard(post: PostData, card: HTMLElement): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'post-card-wrap';
    wrap.dataset['tags'] = post.tags.join(' ');
    wrap.style.setProperty('--tag-color', this.tagColorVar(post.tags[0]));
    if (post.tags[0]) {
      wrap.style.setProperty('--edge-img', `url('${this.baseurl}/assets/edges/${post.tags[0]}.svg')`);
    }

    const topBorder = document.createElement('div');
    topBorder.className = 'card-top-border';

    wrap.appendChild(topBorder);
    wrap.appendChild(this.createCornerEl());
    wrap.appendChild(card);
    return wrap;
  }

  private createCardElement(post: PostData, variant: 'chip' | 'tile'): HTMLElement {
    const href = this.resolveHref(post);
    const tag = href ? 'a' : 'div';
    const el = document.createElement(tag) as HTMLElement;
    el.className = `post-card ${variant} post-type--${post.tags[0]}`;
    el.dataset['postUrl'] = post.url;

    if (href && el instanceof HTMLAnchorElement) {
      el.href = href;
    }
    return el;
  }

  private resolveHref(post: PostData): string | null {
    if (!post.clickable) return null;
    if (post.project_link && post.project) {
      const project = this.projects.find(p => p.slug === post.project);
      if (project?.post) return this.baseurl + project.post;
    }
    return post.url;
  }

  private createCornerEl(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'card-corner';
    div.setAttribute('aria-hidden', 'true');
    return div;
  }

  private tagColorVar(type: string | null | undefined): string {
    if (!type) return 'var(--c-default, #666)';
    return `var(--c-${type})`;
  }

}
