import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { Project } from '../types';

// Sanity Client Configuration
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID, 
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-01-01', // use current date (YYYY-MM-DD) to target the latest API version
});

// Image Helper
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Mock Data for Fallback
const MOCK_PROJECTS: Project[] = [
  {
    _id: '1',
    title: 'Oceanic Depths',
    slug: { current: 'oceanic-depths' },
    heroImage: {
      _type: 'image',
      asset: {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop'
      },
      alt: 'Deep blue underwater scene with light rays'
    },
    shortDescription: 'A deep dive into marine conservation through interactive data visualization, highlighting the fragile beauty of our oceans.',
    tags: ['Web Design', 'Development'],
    isProtected: false,
    fullDetails: []
  },
  {
    _id: '2',
    title: 'Liquid Finance',
    slug: { current: 'liquid-finance' },
    heroImage: {
      _type: 'image',
      asset: {
        url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop'
      },
      alt: 'Abstract fluid liquid art'
    },
    shortDescription: 'Fintech dashboard with real-time fluid animations representing market flow, making complex data feel organic and approachable.',
    tags: ['UI/UX', 'Product Design'],
    isProtected: false,
    fullDetails: []
  },
  {
    _id: '3',
    title: 'Azure Architecture',
    slug: { current: 'azure-arch' },
    heroImage: {
      _type: 'image',
      asset: {
        url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop'
      },
      alt: 'Minimalist white architecture against a blue sky'
    },
    shortDescription: 'Minimalist architectural portfolio for a coastal design firm, emphasizing open spaces and natural light.',
    tags: ['Brand Identity', 'Web Design'],
    isProtected: false,
    fullDetails: []
  },
  {
    _id: '4',
    title: 'Tidal Waves',
    slug: { current: 'tidal-waves' },
    heroImage: {
      _type: 'image',
      asset: {
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2026&auto=format&fit=crop'
      },
      alt: 'Close up texture of ocean waves'
    },
    shortDescription: 'An experimental WebGL experience exploring wave physics and user interaction in a digital sea.',
    tags: ['Creative Coding', 'WebGL'],
    isProtected: true,
    fullDetails: []
  },
  {
    _id: '5',
    title: 'Coral & Stone',
    slug: { current: 'coral-stone' },
    heroImage: {
      _type: 'image',
      asset: {
        url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070&auto=format&fit=crop'
      },
      alt: 'Texture of wet stone'
    },
    shortDescription: 'E-commerce platform for sustainable jewelry, featuring macro photography and seamless purchasing flows.',
    tags: ['E-commerce', 'Strategy'],
    isProtected: false,
    fullDetails: []
  },
];

export const getProjects = async (): Promise<Project[]> => {
  // Check if Sanity is configured
  if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
    console.log('Sanity Project ID not found in environment variables. Using mock data.');
    await new Promise((resolve) => setTimeout(resolve, 800));
    return MOCK_PROJECTS;
  }

  const query = `*[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    heroImage {
      ...,
      asset->{
        url
      }
    },
    shortDescription,
    tags,
    isProtected
  }`;

  try {
    const projects = await client.fetch(query);
    return projects;
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return MOCK_PROJECTS;
  }
};

export const getProject = async (slug: string): Promise<Project | null> => {
  // Check if Sanity is configured
  if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
    const project = MOCK_PROJECTS.find(p => p.slug.current === slug);
    return project || null;
  }

  const query = `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    heroImage {
      ...,
      asset->{
        url
      }
    },
    shortDescription,
    tags,
    isProtected,
    fullDetails
  }`;

  try {
    const project = await client.fetch(query, { slug });
    return project || null;
  } catch (error) {
    console.error(`Error fetching project ${slug} from Sanity:`, error);
    return MOCK_PROJECTS.find(p => p.slug.current === slug) || null;
  }
};
