import { PostData, PostType, POST_TYPE_LABELS, MONTH_ABBREVS } from './types';
import { TagFilter } from './tag-filter';

export class Timeline {
  private showDividers = true;
  private container: HTMLElement;
  private posts: PostData[];
  private filter: TagFilter;

  constructor(container: HTMLElement, posts: PostData[], filter: TagFilter) {
    this.container = container;
    // Jekyll outputs posts newest-first, but guard with an explicit sort
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

    // Group newest-first by year → month
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
    const el = this.createCardElement(post, 'chip');

    const icon = this.createIcon();
    const title = document.createElement('span');
    title.className = 'chip__title';
    title.textContent = post.title;

    el.appendChild(title);
    el.appendChild(icon);
    return el;
  }

  private renderTile(post: PostData): HTMLElement {
    const el = this.createCardElement(post, 'tile');

    const body = document.createElement('div');
    body.className = 'tile__body';

    const typeLabel = document.createElement('span');
    typeLabel.className = 'tile__type-label';
    typeLabel.textContent = POST_TYPE_LABELS[post.type as PostType] ?? post.type;

    const title = document.createElement('h2');
    title.className = 'tile__title';
    title.textContent = post.title;

    body.appendChild(typeLabel);
    body.appendChild(title);

    if (post.excerpt) {
      const excerpt = document.createElement('p');
      excerpt.className = 'tile__excerpt';
      excerpt.textContent = post.excerpt;
      body.appendChild(excerpt);
    }

    el.appendChild(body);

    if (post.image) {
      const img = document.createElement('img');
      img.className = 'tile__image';
      img.src = post.image;
      img.alt = post.title;
      img.loading = 'lazy';
      el.appendChild(img);
    }

    el.appendChild(this.createIcon());
    return el;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private createCardElement(post: PostData, variant: 'chip' | 'tile'): HTMLElement {
    const tag = post.clickable ? 'a' : 'div';
    const el = document.createElement(tag) as HTMLElement;
    el.className = `${variant} post-type--${post.type}`;
    el.dataset['postUrl'] = post.url;

    if (post.clickable && el instanceof HTMLAnchorElement) {
      el.href = post.url;
    }
    return el;
  }

  private createIcon(): HTMLElement {
    const icon = document.createElement('div');
    icon.className = 'post-icon';
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }
}
