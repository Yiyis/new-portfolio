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

export const getProjects = async (): Promise<Project[]> => {
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
    role,
    year,
    isProtected,
    externalUrl
  }`;

  try {
    const projects = await client.fetch(query);
    return projects;
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return [];
  }
};

export const getProject = async (slug: string): Promise<Project | null> => {
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
    role,
    year,
    isProtected,
    projectDetails,
    externalUrl
  }`;

  try {
    const project = await client.fetch(query, { slug });
    return project || null;
  } catch (error) {
    console.error(`Error fetching project ${slug} from Sanity:`, error);
    return null;
  }
};
