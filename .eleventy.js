const NotionCMS = require('@agency-kit/notion-cms')

require("dotenv").config();

const notion = new NotionCMS({
  databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
  notionAPIKey: process.env.NOTION_API
})


module.exports = function (config) {
  config.addPassthroughCopy({ public: './' })

  config.setBrowserSyncConfig({
    files: ['dist/**/*'],
  })

  config.addCollection("pages", async function () {
    let collection = await notion.fetch()
    const posts = collection.siteData
    return Object.values(posts)
  })

  // Get all posts
  config.addCollection("posts", async function () {
    let collection = await notion.fetch()
    const posts = collection.siteData['/posts']
    const filteredPosts = Object.entries(posts).filter(([key, value]) => {
      if (key.startsWith('/')) return true
    }).map(e => e[1])
    return filteredPosts;
  });

  return {
    templateFormats: ['md', 'njk', 'jpg', 'png', 'gif'],
  }
}
