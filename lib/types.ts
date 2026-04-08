export type Locale = "en" | "ar";

export interface ProjectItem {
  name: string;
  cat: string;
  desc: string;
  stack: string;
  live?: string;
  github?: string;
}

/** Merged from GitHub API + optional manual rows in messages */
export interface ContributedRepo {
  id: number;
  full_name: string;
  name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  source: "api" | "manual";
}

/** Add third-party or org repos the API won’t return under your user */
export interface ContributedExtraRepo {
  full_name: string;
  description: string;
  html_url: string;
  language?: string;
  fork?: boolean;
  stargazers_count?: number;
  pushed_at?: string;
}

export interface Messages {
  nav: Record<string, string>;
  hero: Record<string, string>;
  about: Record<string, string>;
  skills: {
    section_title: string;
    show_more: string;
    show_less: string;
    categories: { title: string; items: string[] }[];
  };
  experience: {
    section_title: string;
    jobs: {
      role: string;
      company: string;
      meta: string;
      period: string;
      bullets: string[];
    }[];
  };
  projects: {
    section_title: string;
    filter_all: string;
    filter_mobile: string;
    filter_web: string;
    filter_brand?: string;
    live: string;
    code: string;
    stores?: string;
    items: ProjectItem[];
  };
  contributed: {
    section_title: string;
    subtitle: string;
    fork_badge: string;
    stars_label: string;
    extra: ContributedExtraRepo[];
  };
  education: {
    section_title: string;
    degrees: { title: string; school: string }[];
  };
  contact: {
    section_title: string;
    subtitle: string;
    email_label: string;
    phone_label: string;
    linkedin_label: string;
    github_label: string;
    location_label: string;
    email_href: string;
    email_text: string;
    phone_href: string;
    phone_text: string;
    linkedin_href: string;
    github_href: string;
    location: string;
    open_to: string;
  };
  footer: {
    built_by: string;
    github: string;
    linkedin: string;
    email: string;
  };
  controls: {
    download_cv: string;
  };
}
