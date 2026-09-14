import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCurrentSession } from '@/lib/auth';
import { determineCategoryFromTags } from '@/lib/categoryMapper';
import { getAllArticles } from '@/lib/content';

function htmlToMarkdown(htmlContent: string): string {
  if (!htmlContent) return '';

  let md = htmlContent;
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<ul[^>]*>/gi, '\n');
  md = md.replace(/<\/ul>/gi, '\n');
  md = md.replace(/<[^>]+>/g, '');

  return md.trim();
}

export async function POST(req: NextRequest) {
  try {
    // Check authorization: Session cookie OR Bearer API token
    const session = getCurrentSession();
    const authHeader = req.headers.get('authorization');
    const isAppsScriptAuth = authHeader && (authHeader.startsWith('Bearer ') || authHeader.includes('omt_publish_token'));

    if (!session && !isAppsScriptAuth) {
      return NextResponse.json(
        { error: 'Please sign in to publish articles.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      slug: customSlug,
      excerpt,
      category: explicitCategory,
      authors = ['kamalram-sajeev'],
      publishedAt: inputPublishedAt,
      coverImage = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      audioNarrationUrl,
      audioDurationSeconds,
      isPremium = false,
      webzineIssue,
      readTimeMinutes = 5,
      tags = ['Kerala', 'Politics'],
      htmlContent,
      markdownContent,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Article title is required' }, { status: 400 });
    }

    const parsedTags = Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim());
    
    // Auto-derive category from tags if not explicitly provided
    const category = explicitCategory || determineCategoryFromTags(parsedTags);

    let slug = (customSlug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug || slug.length < 2) {
      const today = new Date().toISOString().slice(0, 10);
      const rand = Math.random().toString(36).substring(2, 8);
      slug = `${today}-${category || 'article'}-${rand}`;
    }

    const publishedAt = inputPublishedAt || new Date().toISOString();
    const finalBodyMarkdown = markdownContent || htmlToMarkdown(htmlContent || '');

    // Format Frontmatter + Content
    const frontmatterObj = {
      title,
      slug,
      excerpt: excerpt || title,
      category,
      authors: Array.isArray(authors) ? authors : [authors],
      publishedAt,
      coverImage,
      ...(audioNarrationUrl ? { audioNarrationUrl, audioDurationSeconds: Number(audioDurationSeconds) || 300 } : {}),
      isPremium: Boolean(isPremium),
      ...(webzineIssue ? { webzineIssue } : {}),
      readTimeMinutes: Number(readTimeMinutes) || 5,
      tags: parsedTags,
    };

    const yamlFrontmatter = Object.entries(frontmatterObj)
      .map(([key, val]) => {
        if (Array.isArray(val)) {
          return `${key}:\n` + val.map((v) => `  - "${v}"`).join('\n');
        }
        if (typeof val === 'string') {
          return `${key}: "${val.replace(/"/g, '\\"')}"`;
        }
        return `${key}: ${val}`;
      })
      .join('\n');

    const fullArticleMarkdown = `---\n${yamlFrontmatter}\n---\n\n# ${title}\n\n${finalBodyMarkdown}\n`;

    // Save article file
    const articlesDir = path.join(process.cwd(), 'content', 'articles');
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }

    const fileName = `${slug}.md`;
    const filePath = path.join(articlesDir, fileName);
    fs.writeFileSync(filePath, fullArticleMarkdown, 'utf8');

    // Link Webzine Issue Packet if assigned
    if (webzineIssue) {
      const issuePath = path.join(process.cwd(), 'content', 'issues', `${webzineIssue}.json`);
      if (fs.existsSync(issuePath)) {
        const issueData = JSON.parse(fs.readFileSync(issuePath, 'utf8'));
        if (!issueData.articleSlugs.includes(slug)) {
          issueData.articleSlugs.push(slug);
          fs.writeFileSync(issuePath, JSON.stringify(issueData, null, 2), 'utf8');
        }
      }
    }

    const isScheduled = new Date(publishedAt).getTime() > Date.now();

    return NextResponse.json({
      success: true,
      message: isScheduled
        ? `Article scheduled for ${new Date(publishedAt).toLocaleString()}`
        : 'Article published successfully!',
      article: {
        slug,
        title,
        category,
        publishedAt,
        isScheduled,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to publish article' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Please sign in to view published articles.' }, { status: 401 });
    }

    const articles = getAllArticles(true);
    return NextResponse.json({ articles });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
  }
}
