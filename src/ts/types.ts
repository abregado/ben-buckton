export type TagState = 'allowed' | 'disallowed' | 'ignored';

export type PostType =
  | 'microblog'
  | 'gamejam'
  | 'game-update'
  | 'laser-update'
  | 'physical-game'
  | 'github-project'
  | 'meetup'
  | 'life-event'
  | 'recipe'
  | 'job';

export interface PostData {
  title: string;
  date: string;       // "YYYY-MM-DD"
  type: PostType;
  tags: string[];
  clickable: boolean;
  url: string;
  project?: string;
  image?: string;
  excerpt: string;
}

export interface ProjectData {
  slug: string;
  name: string;
  color: string;
  start: string;      // "YYYY-MM-DD"
  end?: string;       // "YYYY-MM-DD" — omit/null means ongoing
  repo?: string;
}

export interface SiteData {
  posts: PostData[];
  projects: ProjectData[];
}

// Nav preset → tags to set as "allowed"
export type NavPreset = 'beliefs' | 'games' | 'cooking' | 'meetup' | 'life';

export const NAV_PRESETS: Record<NavPreset, string[]> = {
  beliefs: ['beliefs'],
  games:   ['games'],
  cooking: ['cooking'],
  meetup:  ['meetup'],
  life:    ['life'],
};

export const POST_TYPE_LABELS: Record<PostType, string> = {
  'microblog':      'Microblog',
  'gamejam':        'Game Jam',
  'game-update':    'Game Update',
  'laser-update':   'Laser Project',
  'physical-game':  'Physical Game',
  'github-project': 'GitHub Project',
  'meetup':         'Meetup',
  'life-event':     'Life Event',
  'recipe':         'Recipe',
  'job':            'Job',
};

export const MONTH_ABBREVS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
