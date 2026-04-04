export type Locale = "en" | "ar";

export interface ProjectItem {
  name: string;
  cat: string;
  desc: string;
  stack: string;
  live?: string;
  github?: string;
}

export interface Messages {
  nav: Record<string, string>;
  hero: Record<string, string>;
  about: Record<string, string>;
  skills: {
    section_title: string;
    categories: { title: string; items: string[] }[];
  };
  experience: {
    section_title: string;
    current: string;
    jobs: {
      role: string;
      company: string;
      meta: string;
      bullets: string[];
    }[];
  };
  projects: {
    section_title: string;
    filter_all: string;
    filter_mobile: string;
    filter_web: string;
    filter_brand: string;
    live: string;
    code: string;
    stores?: string;
    items: ProjectItem[];
  };
  education: {
    section_title: string;
    degrees: { title: string; school: string }[];
  };
  contact: {
    section_title: string;
    subtitle: string;
    email_label: string;
    linkedin_label: string;
    github_label: string;
    location_label: string;
    email_href: string;
    email_text: string;
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
