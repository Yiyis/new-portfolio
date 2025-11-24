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
  // We can type fullDetails properly if we add a PortableText renderer later, 
  // for now we'll keep it as any or simple array for the mock.
  fullDetails?: any[]; 
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