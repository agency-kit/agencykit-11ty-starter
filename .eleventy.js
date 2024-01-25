import NotionCMS from "@agency-kit/notion-cms";

const notion = new NotionCMS({
  // big detector version
  databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad', 
  // Simple Jacob's blog version.
  // databaseId: '41b200f0-495f-44bd-956d-d4830c826d5d', 
  notionAPIKey: process.env.NOTION_API,
  localCacheDirectory: `${process.cwd()}/lc/`,
  draftMode: true,
  refreshTimeout: '1 hour',
  // rootAlias: '/home-page'
});

export default async function (config) {
  await notion.fetch();

  const pageCollection = new Set();
  const navCollection = new Set();

  notion.walk(node => {
    // for quickly building all pages in the db, we collect them all.
    pageCollection.add(node);
    // If the collection has been added, skip it.
    if (Object.keys(config.collections).some(key => key === node.slug)) return;
    // We want only the current path's pages
    const pages = notion.filterSubPages(node.path);
    // We only want collections when there are items in it ie not a leaf node, for individual collections
    if (pages.length >= 1) {
      navCollection.add(node);
      config.addCollection(node.slug, () => pages);
    }
  })

  config.addCollection('combined', () => Array.from(pageCollection).flatMap(page=>page));

  config.addCollection('nav', () => Array.from(navCollection).flatMap(page=>page));

  // TODO: Add collections by tags?

  return {
    templateFormats: ['md', 'njk'],
    dir: {
      input: "src",
      includes: "../_includes"
    }
  }
}
