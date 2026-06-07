import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Safely references our data/archive path
const ARCHIVE_DIRECTORY = path.join(process.cwd(), 'data/archive');

export interface ArchiveSpecimen {
  slug: string;
  category: string;
  catalogId: string;
  title: string;
  tifinagh: string;
  classification: string;
  medium: string;
  region: string;
  provenance: string;
  era: string;
  content: string;
}

/**
 * Scans all child subdirectories inside data/archive/ and returns a flat dataset array
 */
export function getAllSpecimens(): ArchiveSpecimen[] {
  const categories = ['material', 'ephemeral', 'vernacular'];
  let allSpecimens: ArchiveSpecimen[] = [];

  categories.forEach((category) => {
    const categoryPath = path.join(ARCHIVE_DIRECTORY, category);
    
    // Fallback if folders don't exist yet during compilation
    if (!fs.existsSync(categoryPath)) return;

    const fileNames = fs.readdirSync(categoryPath);

    fileNames.forEach((fileName) => {
      if (!fileName.endsWith('.md')) return;

      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Pull frontmatter YAML metadata apart from prose body strings
      const { data, content } = matter(fileContents);

      allSpecimens.push({
        slug,
        category,
        catalogId: data.catalogId || '',
        title: data.title || '',
        tifinagh: data.tifinagh || '',
        classification: data.classification || '',
        medium: data.medium || '',
        region: data.region || '',
        provenance: data.provenance || '',
        era: data.era || '',
        content,
      });
    });
  });

  return allSpecimens.sort((a, b) => a.catalogId.localeCompare(b.catalogId));
}

/**
 * Finds a specific entry given its exact classification type and dynamic slug profile
 */
export function getSpecimenBySlug(category: string, slug: string): ArchiveSpecimen | null {
  try {
    const fullPath = path.join(ARCHIVE_DIRECTORY, category, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      category,
      catalogId: data.catalogId || '',
      title: data.title || '',
      tifinagh: data.tifinagh || '',
      classification: data.classification || '',
      medium: data.medium || '',
      region: data.region || '',
      provenance: data.provenance || '',
      era: data.era || '',
      content,
    };
  } catch (error) {
    return null;
  }
}
