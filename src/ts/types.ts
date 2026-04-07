export type TagState = 'allowed' | 'disallowed' | 'ignored';

export interface PostData {
  title: string;
  date: string;       // "YYYY-MM-DD"
  tags: string[];     // tags[0] is the post "type" (drives color, icon, label)
  clickable: boolean;
  url: string;
  project?: string;
  image?: string;
  excerpt: string;
  featured?: boolean;    // always render as tile on timeline (not chip)
  external_url?: string; // external link shown as icon on chip
}

export interface ProjectData {
  slug: string;
  name: string;
  color: string;
  start: string;      // "YYYY-MM-DD"
  end?: string;       // "YYYY-MM-DD" — omit/null means ongoing
  repo?: string;
  post?: string;      // URL of the project overview page
  description?: string;
}

export interface SiteData {
  posts: PostData[];
  projects: ProjectData[];
}

// Nav preset → tags to set as "allowed"
export type NavPreset = 'games' | 'job' | 'life' | 'meetup';

export const NAV_PRESETS: Record<NavPreset, string[]> = {
  games:  ['games'],
  job:    ['job'],
  life:   ['life'],
  meetup: ['meetup'],
};

export const MONTH_ABBREVS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
