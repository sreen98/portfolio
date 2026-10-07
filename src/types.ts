// Shapes of the content in src/data/resume.ts.

export interface Profile {
  name: string;
  role: string;
  focus: string;
  status: string;
  notice: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  instagram: string;
  medium: string;
  resume: string;
  summary: string;
}

export interface Photo {
  src: string;
  alt: string;
  /** CSS object-position for the crop. */
  position: string;
}

export interface Stat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface Product {
  name: string;
  tagline: string;
  points: string[];
}

export interface Job {
  company: string;
  title: string;
  location: string;
  period: string;
  blurb: string;
  products: Product[];
}

export interface Link {
  label: string;
  href: string;
}

export interface Project {
  name: string;
  kind: string;
  description: string;
  /** Secondary line shown under the description. */
  note?: string;
  tags: string[];
  links: Link[];
  icon?: string;
  /** Browser screenshot. */
  web?: string;
  /** Phone screenshot. */
  phone?: string;
  /** Address shown in the browser frame. */
  url?: string;
  modules?: string[];
  stats?: { value: string; label: string }[];
}

export interface Place {
  name: string;
  note: string;
  lat: number;
  lon: number;
}

export interface GlobeData {
  home: Place;
  places: Place[];
}

export interface TravelStop {
  country: string;
  /** ISO country code shown on the postcard. */
  code: string;
  photo: string;
  position: string;
}

export interface Article {
  title: string;
  date: string;
  platform: string;
  cover: string;
  coverAlt: string;
  href: string;
  blurb: string;
}

export interface Life {
  travel: TravelStop[];
  cricket: { photo: string; role: string };
  gym: { text: string };
  /** At least one article; the first is featured. */
  writing: [Article, ...Article[]];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  score: string;
}
