import NotionCMS, {Head, Linker, Images} from "@agency-kit/notion-cms";
import dotenv from 'dotenv';

dotenv.config();

const notion = new NotionCMS({
  // Sample db, see here: https://cooked-shovel-3c3.notion.site/NotionCMS-Quickstart-Database-Template-719f1f9d1547465d96bcd7e80333c831?pvs=4
  // Add your own DB_ID or use one of these to see how it works:
  // Starter demo: b29a7fb3-f35f-49ad-b9ee-2b759cab961c
  // Big Detector demo (large blog): e4fcd5b3-1d6a-4afd-b951-10d56ce436ad
  databaseId: process.env.NOTION_DB_ID,
  notionAPIKey: process.env.NOTION_API,
  localCacheDirectory: `${process.cwd()}/lc/`, // Defaults to tucked in node_modules, but put it anywhere
  draftMode: true, // turn off for PROD
   // if your db is structured with a single root page, this converts it's name, '/home' -> '/'.
  rootAlias: '/home',
   // setting a timout here disables optimized fetching and reverts to the cache until refresh expires
  // refreshTimeout: '1 hour',
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
    // guarantee unique collection names, even if a page's slug is not unique
    // for manual collection usage, you may want to remove this as it makes accessing the collection by the slug difficult.
    // Just make sure you don't use identical page names in your db 😉
    const collectionName = `${node.slug}-${simpleHash(node.id)}`;
    node.collectionName = collectionName;
    // for quickly building all pages in the db, we collect them all.
    pageCollection.add(node);
    // We want only the current path's pages
    const pages = notion.filterSubPages(node.path);
    // We only want collections when there are items in it ie not a leaf node, for individual collections
    if (pages.length) {
      navCollection.add(node);
      config.addCollection(collectionName, () => pages);
    }
  });

  config.addCollection('combined', () => Array.from(pageCollection).flatMap(page => page));

  // Any page with children (sub-pages) should show up in the nav collection.
  config.addCollection('nav', () => Array.from(navCollection).flatMap(page => page));

  // TODO: Add collections by tags

  config.addNunjucksFilter("removeEleventyProps", function (value) {
    const eleventyProps = [
      "outputPath", "date", "inputPath", "fileSlug", "filePathStem",
      "outputFileExtension", "templateSyntax"
    ];
    let cleanObject = Object.assign({}, value);
    eleventyProps.forEach(prop => {delete cleanObject[prop];});
    return cleanObject;
  });

  config.addPassthroughCopy({ "public": "/" });

  config.setServerOptions({
    port: 3000
  });

  return {
    templateFormats: ['md', 'njk'],
    dir: {
      input: "src"
    }
  }
}

function simpleHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 6);
}
