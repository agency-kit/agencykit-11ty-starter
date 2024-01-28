import NotionCMS, {Head, Linker, Images} from "@agency-kit/notion-cms";
import dotenv from 'dotenv';

dotenv.config();

const notion = new NotionCMS({
  // Sample db, see here: https://cooked-shovel-3c3.notion.site/NotionCMS-Quickstart-Database-Template-719f1f9d1547465d96bcd7e80333c831?pvs=4
  databaseId: process.env.NOTION_DB_ID, // Demo using b29a7fb3-f35f-49ad-b9ee-2b759cab961c and just add your API Key
  notionAPIKey: process.env.NOTION_API,
  localCacheDirectory: `${process.cwd()}/lc/`, // Defaults to tucked in node_modules, but put it anywhere
  draftMode: true, // turn off for PROD
  // rootAlias: '/home' // if your db is structured with a single root page, this converts it's name, '/home' -> '/'.
  refreshTimeout: '1 hour',
  plugins: [
    // add metaTitle and metaDescription to your DB. Access them at meta.title and meta.description: https://www.agencykit.so/notion-cms/plugins/core-plugins/head-seo/
    Head(),
    // automatically converts links in Notion to links to the right paths: https://www.agencykit.so/notion-cms/plugins/core-plugins/linker/
    Linker(),
    // automatically downloads and caches Notion images: https://www.agencykit.so/notion-cms/plugins/core-plugins/images/
    Images(),
    // Custom NotionCMS plugin: see https://www.agencykit.so/notion-cms/plugins/building-a-plugin/
    {
      // Add a 'Layout' property to your database. Any layout name string maps to your custom layout in layouts/your-layout-name.njk
      // Default is base.njk if no custom layout is specified.
      name: 'layouts',
      hook: 'during-tree',
      exec: pageContent => {
        let layoutString = pageContent?.otherProps?.Layout?.rich_text[0]?.text?.content || "base"
        // Slugify
        layoutString.toLowerCase()
          .replace(/[^\w-]+/g, '')
          .replace(/ +/g, '-');
        Object.assign(pageContent, { Layout: `layouts/${layoutString}.njk` })
        return pageContent
      }
    }],
});

export default async function (config) {
  await notion.pull();

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

  config.addCollection('combined', () => Array.from(pageCollection).flatMap(page => page));

  config.addCollection('nav', () => Array.from(navCollection).flatMap(page => page));

  // TODO: Add collections by tags

  return {
    templateFormats: ['md', 'njk'],
    dir: {
      input: "src",
      data: "../_data",
      includes: "../_includes"
    }
  }
}
