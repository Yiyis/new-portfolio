export interface SanityImage {
  _type: 'image';
  asset: {
    _ref?: string;
    _type?: 'reference';
    url?: string; // For mock/frontend convenience
  };
  alt?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  heroImage: SanityImage;
  shortDescription: string;
  tags: string[];
  isProtected: boolean;
  accessKey?: string;
  projectDetails?: any[]; // Portable Text array
  role: string;
  year: number;
  externalUrl?: string;
  nextProject?: {
    title: string;
    slug: { current: string };
  };
  prevProject?: {
    title: string;
    slug: { current: string };
  };
}

export interface SiteSettings {
  title: string;
  description: string;
  email: string;
  socials: {
    platform: string;
    url: string;
  }[];
}