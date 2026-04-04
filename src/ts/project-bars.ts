import { ProjectData, PostData } from './types';

interface BarEntry {
  project: ProjectData;
  posts: PostData[];
  element: HTMLElement;
  topArrow: HTMLButtonElement;
  bottomArrow: HTMLButtonElement;
}

export class ProjectBars {
  private barsContainer: HTMLElement;
  private timelineEl: HTMLElement;
  private projects: ProjectData[];
  private posts: PostData[];
  private entries: BarEntry[] = [];

  constructor(
    barsContainer: HTMLElement,
    timelineEl: HTMLElement,
    projects: ProjectData[],
    posts: PostData[]
  ) {
    this.barsContainer = barsContainer;
    this.timelineEl = timelineEl;
    this.projects = projects;
    this.posts = posts;
  }

  render(): void {
    this.barsContainer.innerHTML = '';
    this.entries = [];

    let columnIndex = 0;
    for (const project of this.projects) {
      const projectPosts = this.posts.filter(p => p.project === project.slug);
      if (projectPosts.length === 0) continue;

      const bar = document.createElement('div');
      bar.className = 'project-bar';
      bar.style.setProperty('--project-color', project.color);
      bar.style.setProperty('--bar-index', String(columnIndex));
      bar.title = project.name;

      const topArrow = this.makeArrow('up', project.name);
      const bottomArrow = this.makeArrow('down', project.name);
      bar.appendChild(topArrow);
      bar.appendChild(bottomArrow);
      this.barsContainer.appendChild(bar);

      const entry: BarEntry = { project, posts: projectPosts, element: bar, topArrow, bottomArrow };
      this.entries.push(entry);
      columnIndex++;

      bar.addEventListener('mouseenter', () => this.highlightCards(project.slug, true));
      bar.addEventListener('mouseleave',  () => this.highlightCards(project.slug, false));
      topArrow.addEventListener('click',    (e) => { e.stopPropagation(); this.navigate(entry, 'up'); });
      bottomArrow.addEventListener('click', (e) => { e.stopPropagation(); this.navigate(entry, 'down'); });

      if (project.post) {
        bar.style.cursor = 'pointer';
        bar.addEventListener('click', () => {
          window.location.href = project.post!;
        });
      }
    }

    this.updatePositions();
    window.addEventListener('scroll', () => this.updateArrows(), { passive: true });
    window.addEventListener('resize', () => this.updatePositions(), { passive: true });
  }

  updatePositions(): void {
    const scrollY = window.scrollY;
    const containerTop = this.barsContainer.getBoundingClientRect().top + scrollY;

    for (const entry of this.entries) {
      const cards = this.getCardElements(entry.posts);
      if (cards.length === 0) {
        entry.element.style.display = 'none';
        continue;
      }
      entry.element.style.display = '';

      const tops    = cards.map(el => el.getBoundingClientRect().top    + scrollY);
      const bottoms = cards.map(el => el.getBoundingClientRect().bottom + scrollY);
      const barTop    = Math.min(...tops)    - containerTop;
      const barBottom = Math.max(...bottoms) - containerTop;

      entry.element.style.top    = `${barTop}px`;
      entry.element.style.height = `${barBottom - barTop}px`;
    }

    this.updateArrows();
  }

  private updateArrows(): void {
    const vpTop    = window.scrollY;
    const vpBottom = window.scrollY + window.innerHeight;

    for (const entry of this.entries) {
      if (entry.element.style.display === 'none') continue;

      const cards = this.getCardElements(entry.posts);
      if (cards.length === 0) continue;

      const barRect   = entry.element.getBoundingClientRect();
      const scrollY   = window.scrollY;
      const absBarTop = barRect.top + scrollY;

      const visTop    = Math.max(barRect.top + scrollY,    vpTop);
      const visBottom = Math.min(barRect.bottom + scrollY, vpBottom);

      if (visTop >= visBottom) continue;

      const relVisTop    = visTop    - absBarTop;
      const relVisBottom = visBottom - absBarTop;

      entry.topArrow.style.top    = `${relVisTop}px`;
      entry.bottomArrow.style.top = `${relVisBottom - 20}px`;

      const hasAbove = cards.some(el => el.getBoundingClientRect().bottom < 0);
      const hasBelow = cards.some(el => el.getBoundingClientRect().top > window.innerHeight);

      entry.topArrow.style.visibility    = hasAbove ? 'visible' : 'hidden';
      entry.bottomArrow.style.visibility = hasBelow ? 'visible' : 'hidden';
    }
  }

  private navigate(entry: BarEntry, direction: 'up' | 'down'): void {
    const cards = this.getCardElements(entry.posts);
    if (direction === 'up') {
      const above = cards.filter(el => el.getBoundingClientRect().bottom < 0);
      above.at(-1)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const below = cards.filter(el => el.getBoundingClientRect().top > window.innerHeight);
      below[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private highlightCards(slug: string, on: boolean): void {
    document.querySelectorAll<HTMLElement>('[data-post-url]').forEach(el => {
      const url  = el.dataset['postUrl'];
      const post = url ? this.posts.find(p => p.url === url) : undefined;
      if (post?.project === slug) el.classList.toggle('is-highlighted', on);
    });
  }

  private getCardElements(posts: PostData[]): HTMLElement[] {
    return posts
      .map(p => document.querySelector<HTMLElement>(`[data-post-url="${p.url}"]`))
      .filter((el): el is HTMLElement => el !== null);
  }

  private makeArrow(direction: 'up' | 'down', projectName: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = `project-bar__arrow project-bar__arrow--${direction}`;
    btn.innerHTML = direction === 'up' ? '&#9650;' : '&#9660;';
    btn.setAttribute('aria-label',
      `Go to ${direction === 'up' ? 'newer' : 'older'} ${projectName} post`);
    return btn;
  }
}
