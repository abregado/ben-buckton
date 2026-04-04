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
    typeLabel.textContent = POST_TYPE_LABELS[post.type as PostType] ?? post.type;

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

    const topBorder = document.createElement('div');
    topBorder.className = 'card-top-border';

    wrap.appendChild(topBorder);
    wrap.appendChild(this.createCornerSvg());
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

  private createCornerSvg(): SVGSVGElement {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg') as SVGSVGElement;
    svg.setAttribute('viewBox', '0 0 98.263939 98.263947');
    svg.classList.add('card-corner');
    svg.setAttribute('aria-hidden', 'true');

    const g = document.createElementNS(ns, 'g');
    g.setAttribute('transform', 'translate(-47.107807,-82.438896)');

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M 135.89506,82.438896 a 30.454462,40.483273 0 0 0 -10.12703,2.392102 H 60.173071 V 123.65809 H 87.2231 v 26.86606 h 26.46195 a 30.454462,40.483273 0 0 0 22.21001,12.88086 30.454462,40.483273 0 0 0 9.47643,-2.01228 V 84.456344 a 30.454462,40.483273 0 0 0 -9.47643,-2.017448 z m 5.79655,5.704044 v 44.71562 l -1.65623,2.57658 v -28.70677 c 0,0 -1.65606,-13.984724 -16.56126,-13.800709 -14.90521,0.184016 -56.860615,9.384439 -56.860615,9.384439 l 0.183968,-12.144994 z m -26.67279,18.51153 c 0.46131,0.006 0.98721,0.13224 1.57768,0.37827 0.78729,0.32804 1.60741,0.8366 2.46032,1.52549 0.8529,0.68888 1.64044,1.55786 2.36213,2.60759 0.72169,1.01692 1.26283,2.19797 1.62367,3.54294 0.32804,0.91851 0.72155,2.09956 1.18081,3.54294 0.49206,1.41057 0.96805,3.01822 1.4273,4.82244 0.49206,1.77141 0.93495,3.67382 1.3286,5.70766 0.39365,2.00105 0.68891,4.06788 0.88573,6.20014 l -0.0496,0.54105 c -0.0328,0.36084 -0.16363,0.78745 -0.39325,1.27951 -0.22964,0.45926 -0.62366,0.86906 -1.18133,1.2299 -0.55766,0.36085 -1.36098,0.54157 -2.4107,0.54157 -1.04973,0 -1.91923,-0.19701 -2.60811,-0.59066 -0.68889,-0.39365 -1.23003,-0.85283 -1.62368,-1.37769 -0.36084,-0.55767 -0.62352,-1.03365 -0.78754,-1.42731 l -0.19689,-0.59014 c -0.0833,-0.36519 -0.14539,-0.66998 -0.22118,-1.01389 -0.0593,-0.006 -0.11289,-0.0138 -0.1726,-0.0196 -1.34496,-0.13122 -2.7225,-0.21318 -4.13308,-0.24598 -1.12738,-0.0268 -2.21996,0.004 -3.28145,0.0873 -0.0604,0.57747 -0.11761,1.13093 -0.21187,1.97921 l -0.19689,0.54157 c -0.0984,0.32804 -0.31172,0.72154 -0.63976,1.1808 -0.32804,0.42646 -0.82031,0.78739 -1.47639,1.08263 -0.62327,0.26243 -1.47597,0.3281 -2.5585,0.19688 -1.21375,-0.16402 -2.14892,-0.49237 -2.805,-0.98443 -0.65608,-0.52486 -1.13154,-1.0823 -1.42678,-1.67277 -0.26243,-0.62327 -0.41006,-1.14813 -0.44287,-1.57458 l -0.0491,-0.63975 c 0.0656,-2.52591 0.42652,-5.10079 1.08262,-7.72511 0.68888,-2.62432 1.45961,-5.28168 2.31252,-7.97161 1.08253,-2.85395 2.08286,-5.03532 3.00137,-6.5443 0.91851,-1.54179 1.788,-2.62459 2.6081,-3.24787 0.8201,-0.65608 1.59084,-1.0333 2.31252,-1.13171 0.7545,-0.13121 1.50894,-0.19689 2.26343,-0.19689 0.13942,-0.0246 0.286,-0.0356 0.43977,-0.0336 z m -0.34107,11.54813 c -0.19682,0.68889 -0.47579,1.50901 -0.83664,2.46032 -0.32804,0.91851 -0.65588,1.85316 -0.98392,2.80448 -0.32804,0.95131 -0.59072,1.82082 -0.78754,2.60811 -0.0496,0.26935 -0.0914,0.4781 -0.13798,0.72295 1.40918,-0.21917 2.84909,-0.3468 4.32067,-0.37879 0.22743,-0.01 0.4624,-0.0119 0.69504,-0.0165 -0.42037,-1.67292 -0.80254,-3.14299 -1.13791,-4.36253 -0.36085,-1.34496 -0.73807,-2.62425 -1.13172,-3.83801 z');

    g.appendChild(path);
    svg.appendChild(g);
    return svg;
  }

  private tagColorVar(type: string): string {
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
