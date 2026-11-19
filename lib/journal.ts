import { shopifyFetch } from './shopify';

// Everything here comes straight from Shopify (Online Store → Blog posts).
// Set NEXT_PUBLIC_JOURNAL_BLOG_HANDLE to show only one blog; leave empty to show all blogs.
export type Article = {
  slug: string; title: string; excerpt: string; date: string; tags: string[];
  author: string; readMinutes: number; cover?: { url: string; alt: string };
  html: string; // Shopify article body (trusted, from your own admin)
  blog: string;
  seoTitle?: string; seoDescription?: string;
};

const FIELDS = `
  id title handle excerpt contentHtml content publishedAt tags
  image { url altText }
  authorV2 { name }
  seo { title description }
`;

const query = `
  query journal {
    blogs(first: 10) {
      edges { node { handle title articles(first: 50, sortKey: PUBLISHED_AT, reverse: true) { edges { node { ${FIELDS} } } } } }
    }
  }
`;

const only = process.env.NEXT_PUBLIC_JOURNAL_BLOG_HANDLE?.trim();

const map = (n: any, blog: string): Article => {
  const words = (n.content || '').split(/\s+/).filter(Boolean).length;
  return {
    slug: n.handle,
    title: n.title,
    excerpt: n.excerpt || (n.content || '').replace(/\s+/g, ' ').slice(0, 180),
    date: n.publishedAt,
    tags: n.tags || [],
    author: n.authorV2?.name || 'MyFirstNight',
    readMinutes: Math.max(1, Math.round(words / 200)),
    cover: n.image ? { url: n.image.url, alt: n.image.altText || n.title } : undefined,
    html: n.contentHtml || '',
    blog: blog,
    seoTitle: n.seo?.title || undefined,
    seoDescription: n.seo?.description || undefined,
  };
};

export async function getArticles(limit = 50): Promise<Article[]> {
  try {
    // short revalidate so new posts appear within a minute
    const { body } = await shopifyFetch<any>({ query, revalidate: 60 });
    const blogs = (body?.data?.blogs?.edges || []).map((e: any) => e.node).filter((b: any) => !only || b.handle === only);
    const seen = new Set<string>();
    return blogs
      .flatMap((b: any) => (b.articles?.edges || []).map((e: any) => map(e.node, b.handle)))
      .filter((a: Article) => (seen.has(a.slug) ? false : (seen.add(a.slug), true)))
      .sort((a: Article, b: Article) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  return (await getArticles(200)).find((a) => a.slug === slug) || null;
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
