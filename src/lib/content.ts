import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  authors: string[];
  authorNames?: string;
  publishedAt: string;
  coverImage: string;
  audioNarrationUrl?: string;
  audioDurationSeconds?: number;
  isPremium?: boolean;
  webzineIssue?: string;
  readTimeMinutes?: number;
  tags?: string[];
  isScheduled?: boolean;
}

export interface Article extends ArticleFrontmatter {
  content: string;
  contentHtml?: string;
}

export interface IssuePacket {
  id: string;
  title: string;
  issueNumber: number;
  theme: string;
  publishedAt: string;
  coverImage: string;
  isPremium: boolean;
  featuredArticleSlug: string;
  articleSlugs: string[];
}

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  color: string;
}

export interface Podcast {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  audioUrl: string;
  durationSeconds: number;
  speaker: string;
  coverImage: string;
}

export interface SeriesEpisode {
  episodeNumber: number;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
}

export interface Series {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  coverImage: string;
  authorId: string;
  authorName?: string;
  category?: string;
  totalEpisodes: number;
  episodes: SeriesEpisode[];
}

export interface Video {
  id: string;
  title: string;
  excerpt: string;
  youtubeId: string;
  playlist?: string;
  category: string;
  publishedAt: string;
  duration: string;
  speaker?: string;
  coverImage?: string;
  isFeatured?: boolean;
}

export interface PageContent {
  slug: string;
  title: string;
  subtitle?: string;
  publishedAt?: string;
  content: string;
  contentHtml?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  englishName?: string;
  role: string;
  bio: string;
  avatar: string;
  department: string;
}

// ARTICLES
export function getAllArticles(includeScheduled: boolean = false): Article[] {
  const articlesDir = path.join(contentDirectory, 'articles');
  if (!fs.existsSync(articlesDir)) return [];

  // Load authors dictionary once
  const authorsDir = path.join(contentDirectory, 'authors');
  const authorsMap: Record<string, string> = {};
  if (fs.existsSync(authorsDir)) {
    const authorFiles = fs.readdirSync(authorsDir).filter((f) => f.endsWith('.json'));
    for (const f of authorFiles) {
      try {
        const aObj = JSON.parse(fs.readFileSync(path.join(authorsDir, f), 'utf8'));
        if (aObj.id && aObj.name) {
          authorsMap[aObj.id] = aObj.name;
        }
      } catch {}
    }
  }

  const now = new Date().getTime();
  const fileNames = fs.readdirSync(articlesDir);
  const articles = fileNames
    .filter((file) => file.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(articlesDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const pubTime = new Date(data.publishedAt || Date.now()).getTime();
      const isScheduled = pubTime > now;

      const authorIds = Array.isArray(data.authors)
        ? data.authors
        : data.authors
        ? [data.authors]
        : [];
      
      const authorNamesList = authorIds.map(
        (id: string) => authorsMap[id] || id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      );
      const authorNames = authorNamesList.length > 0 ? authorNamesList.join(', ') : 'Editorial Desk';

      return {
        ...(data as ArticleFrontmatter),
        authors: authorIds,
        authorNames,
        slug: data.slug || fileName.replace(/\.md$/, ''),
        content,
        isScheduled,
      };
    })
    .filter((article) => includeScheduled || !article.isScheduled)
    .sort((a, b) => (new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));

  return articles;
}

export async function getArticleBySlug(slug: string, includeScheduled: boolean = false): Promise<Article | null> {
  const articles = getAllArticles(includeScheduled);
  const article = articles.find((a) => a.slug === slug);
  if (!article) return null;

  const processedContent = await remark().use(html).process(article.content);
  const contentHtml = processedContent.toString();

  return {
    ...article,
    contentHtml,
  };
}

export function getArticlesByCategory(categorySlug: string, includeScheduled: boolean = false): Article[] {
  const articles = getAllArticles(includeScheduled);
  return articles.filter((a) => a.category.toLowerCase() === categorySlug.toLowerCase());
}

export function getArticlesByTag(tag: string, includeScheduled: boolean = false): Article[] {
  const articles = getAllArticles(includeScheduled);
  const cleanTag = tag.toLowerCase().trim();
  return articles.filter((a) => a.tags?.some((t) => t.toLowerCase() === cleanTag));
}

export function getRelatedArticles(article: Article, limit: number = 3): Article[] {
  const allArticles = getAllArticles(false).filter((a) => a.slug !== article.slug);
  
  // Prioritize articles from the same webzine issue packet
  const sameIssue = article.webzineIssue 
    ? allArticles.filter((a) => a.webzineIssue === article.webzineIssue)
    : [];
  
  // Next prioritize same category
  const sameCategory = allArticles.filter((a) => a.category === article.category && !sameIssue.some((si) => si.slug === a.slug));
  
  // Fallback to latest remaining
  const remaining = allArticles.filter((a) => !sameIssue.some((si) => si.slug === a.slug) && !sameCategory.some((sc) => sc.slug === a.slug));
  
  return [...sameIssue, ...sameCategory, ...remaining].slice(0, limit);
}

// ISSUES
export function getAllIssues(): IssuePacket[] {
  const issuesDir = path.join(contentDirectory, 'issues');
  if (!fs.existsSync(issuesDir)) return [];

  const fileNames = fs.readdirSync(issuesDir);
  return fileNames
    .filter((file) => file.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(issuesDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as IssuePacket;
    })
    .sort((a, b) => b.issueNumber - a.issueNumber);
}

export function getIssueById(id: string): IssuePacket | null {
  const issues = getAllIssues();
  return issues.find((i) => i.id === id) || null;
}

// AUTHORS
export function getAllAuthors(): Author[] {
  const authorsDir = path.join(contentDirectory, 'authors');
  if (!fs.existsSync(authorsDir)) return [];

  const fileNames = fs.readdirSync(authorsDir);
  return fileNames
    .filter((file) => file.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(authorsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as Author;
    });
}

export function getAuthorById(id: string): Author | null {
  const authors = getAllAuthors();
  return authors.find((a) => a.id === id) || null;
}

// CATEGORIES
export function getAllCategories(): Category[] {
  const categoriesDir = path.join(contentDirectory, 'categories');
  if (!fs.existsSync(categoriesDir)) return [];

  const fileNames = fs.readdirSync(categoriesDir);
  return fileNames
    .filter((file) => file.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(categoriesDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as Category;
    });
}

// PODCASTS
export function getAllPodcasts(): Podcast[] {
  const podcastsDir = path.join(contentDirectory, 'podcasts');
  if (!fs.existsSync(podcastsDir)) return [];

  const fileNames = fs.readdirSync(podcastsDir);
  return fileNames
    .filter((file) => file.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(podcastsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as Podcast;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// SERIES
export function getAllSeries(): Series[] {
  const seriesDir = path.join(contentDirectory, 'series');
  if (!fs.existsSync(seriesDir)) return [];

  const fileNames = fs.readdirSync(seriesDir);
  return fileNames
    .filter((file) => file.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(seriesDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as Series;
    });
}

export function getSeriesBySlug(slug: string): Series | null {
  const allSeries = getAllSeries();
  return allSeries.find((s) => s.slug === slug) || null;
}

// VIDEOS
export function getAllVideos(): Video[] {
  const filePath = path.join(contentDirectory, 'videos.json');
  if (!fs.existsSync(filePath)) return [];
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as Video[];
  } catch {
    return [];
  }
}

export function getVideoById(id: string): Video | null {
  const videos = getAllVideos();
  return videos.find((v) => v.id === id) || null;
}

// TAGS
export function getAllTags(includeScheduled: boolean = false): string[] {
  const articles = getAllArticles(includeScheduled);
  const tagSet = new Set<string>();
  for (const a of articles) {
    if (a.tags && Array.isArray(a.tags)) {
      for (const t of a.tags) {
        if (t.trim()) tagSet.add(t.trim());
      }
    }
  }
  return Array.from(tagSet);
}

// STATIC PAGES
export async function getPageContent(slug: string): Promise<PageContent | null> {
  const filePath = path.join(contentDirectory, 'pages', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const pageData = JSON.parse(fileContents) as PageContent;
    const processedContent = await remark().use(html).process(pageData.content);
    return {
      ...pageData,
      contentHtml: processedContent.toString(),
    };
  } catch {
    return null;
  }
}

export function getAllPages(): string[] {
  const pagesDir = path.join(contentDirectory, 'pages');
  if (!fs.existsSync(pagesDir)) return [];
  return fs.readdirSync(pagesDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

// TEAM
export function getTeamMembers(): TeamMember[] {
  const filePath = path.join(contentDirectory, 'team.json');
  if (!fs.existsSync(filePath)) return [];
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as TeamMember[];
  } catch {
    return [];
  }
}
