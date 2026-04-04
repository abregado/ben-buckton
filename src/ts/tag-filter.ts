import { TagState, NavPreset, NAV_PRESETS, PostData } from './types';

export class TagFilter {
  private states = new Map<string, TagState>();
  private listeners: Array<() => void> = [];

  addListener(cb: () => void): void {
    this.listeners.push(cb);
  }

  private notify(): void {
    for (const cb of this.listeners) cb();
  }

  /** Cycle: ignored → allowed → disallowed → ignored */
  toggle(tag: string): void {
    const current = this.states.get(tag) ?? 'ignored';
    const next: TagState =
      current === 'ignored'    ? 'allowed'    :
      current === 'allowed'    ? 'disallowed' :
                                 'ignored';
    if (next === 'ignored') {
      this.states.delete(tag);
    } else {
      this.states.set(tag, next);
    }
    this.notify();
  }

  getState(tag: string): TagState {
    return this.states.get(tag) ?? 'ignored';
  }

  applyNavPreset(preset: NavPreset): void {
    this.states.clear();
    for (const tag of NAV_PRESETS[preset]) {
      this.states.set(tag, 'allowed');
    }
    this.notify();
  }

  clear(): void {
    this.states.clear();
    this.notify();
  }

  hasAnyActive(): boolean {
    return this.states.size > 0;
  }

  /** Returns true if the post should be visible under the current filter. */
  passes(post: PostData): boolean {
    let anyAllowed = false;
    let postHasAllowed = false;

    for (const [tag, state] of this.states) {
      if (state === 'allowed') {
        anyAllowed = true;
        if (post.tags.includes(tag)) postHasAllowed = true;
      }
      if (state === 'disallowed' && post.tags.includes(tag)) return false;
    }

    // If any allowed tags exist the post must carry at least one of them
    if (anyAllowed && !postHasAllowed) return false;
    return true;
  }
}
