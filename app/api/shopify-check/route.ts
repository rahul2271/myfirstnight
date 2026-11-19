import { NextResponse } from 'next/server';

// Diagnostics: why isn't my journal / lookbook showing?  /api/shopify-check?secret=REVALIDATE_SECRET
async function run(query: string) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_GRAPHQL_API_VERSION || '2024-01';
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token! },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  });
  return res.json();
}

export async function GET(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || new URL(req.url).searchParams.get('secret') !== secret) return NextResponse.json({ ok: false }, { status: 401 });

  const blogs = await run(`{ blogs(first: 10) { edges { node { handle title articles(first: 3) { edges { node { title handle } } } } } } }`);
  const lookbook = await run(`{ metaobjects(type: "lookbook_chapter", first: 5) { edges { node { id handle } } } }`);
  const reviews = await run(`{ metaobjects(type: "review", first: 5) { edges { node { id } } } }`);

  return NextResponse.json({
    journal: {
      errors: blogs.errors?.map((e: any) => e.message) || null,
      blogs: (blogs.data?.blogs?.edges || []).map((e: any) => ({ handle: e.node.handle, articles: e.node.articles.edges.length })),
      hint: 'If errors mention access/scope, enable "Read content" (unauthenticated_read_content) on your Storefront API token.',
    },
    lookbook: {
      errors: lookbook.errors?.map((e: any) => e.message) || null,
      chapters: lookbook.data?.metaobjects?.edges?.length ?? 0,
      hint: 'Chapters need the metaobject type handle "lookbook_chapter", status Active, entries Published, and Storefront access ON (also add "Read metaobjects" scope).',
    },
    reviews: { errors: reviews.errors?.map((e: any) => e.message) || null, count: reviews.data?.metaobjects?.edges?.length ?? 0 },
  });
}
