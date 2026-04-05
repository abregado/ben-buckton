import { PostData, PostType, POST_TYPE_LABELS, MONTH_ABBREVS } from './types';
import { TagFilter } from './tag-filter';

export class Timeline {
  private showDividers = true;
  private container: HTMLElement;
  private posts: PostData[];
  private filter: TagFilter;

  constructor(container: HTMLElement, posts: PostData[], filter: TagFilter) {
    this.container = container;
    // Jekyll outputs posts newest-first, but guard with an explicit sort.
    // Job posts sort by their end date (or first day of current month if ongoing).
    this.posts = [...posts].sort(
      (a, b) => new Date(this.effectiveDate(b)).getTime() - new Date(this.effectiveDate(a)).getTime()
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
    // Job posts group by their effective date (end, or first day of current month if ongoing).
    const byYear = new Map<number, Map<number, PostData[]>>();
    for (const post of visible) {
      const [y, m] = this.effectiveDate(post).split('-').map(Number) as [number, number];
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
          cardsCol.appendChild(isFirst ? this.renderTile(post) : this.renderChip(post));
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
    card.appendChild(this.createIcon());
    return this.wrapCard(post, card);
  }

  private renderTile(post: PostData): HTMLElement {
    const card = this.createCardElement(post, 'tile');

    const body = document.createElement('div');
    body.className = 'tile__body';

    const typeLabel = document.createElement('span');
    typeLabel.className = 'tile__type-label';
    typeLabel.textContent = (post.type && (POST_TYPE_LABELS[post.type as PostType] ?? post.type)) || '';

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

    card.appendChild(this.createIcon());
    return this.wrapCard(post, card);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private wrapCard(post: PostData, card: HTMLElement): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'post-card-wrap';
    wrap.dataset['tags'] = post.tags.join(' ');
    wrap.style.setProperty('--tag-color', this.tagColorVar(post.type));
    if (post.type) {
      wrap.style.setProperty('--edge-img', `url('/assets/edges/${post.type}.svg')`);
    }

    const topBorder = document.createElement('div');
    topBorder.className = 'card-top-border';

    wrap.appendChild(topBorder);
    wrap.appendChild(this.createCornerEl());
    wrap.appendChild(card);
    return wrap;
  }

  private createCardElement(post: PostData, variant: 'chip' | 'tile'): HTMLElement {
    const tag = post.clickable ? 'a' : 'div';
    const el = document.createElement(tag) as HTMLElement;
    el.className = `post-card ${variant} post-type--${post.type}`;
    el.dataset['postUrl'] = post.url;

    if (post.clickable && el instanceof HTMLAnchorElement) {
      el.href = post.url;
    }
    return el;
  }

  private createCornerEl(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'card-corner';
    div.setAttribute('aria-hidden', 'true');
    return div;
  }

  private effectiveDate(post: PostData): string {
    if (post.type === 'job') {
      if (post.end) return post.end;
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    }
    return post.date;
  }

  private tagColorVar(type: string | null | undefined): string {
    if (!type) return 'var(--c-default, #666)';
    const slug = type === 'github-project' ? 'github' : type;
    return `var(--c-${slug})`;
  }

  private createIcon(): HTMLElement {
    const icon = document.createElement('div');
    icon.className = 'post-icon';
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }
}
