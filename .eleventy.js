const NotionCMS = require('@agency-kit/notion-cms')

require("dotenv").config();

const notion = new NotionCMS({
  databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
  notionAPIKey: process.env.NOTION_API
})

const filterPosts = 
  posts => Object.entries(posts)
    .filter(([key, value]) => key.startsWith('/'))
    .map(e => e[1])

module.exports = function (config) {

  config.addCollection("pages", async function () {
    let collection = await notion.fetch()
    const posts = collection.siteData
    return Object.values(posts)
  })

  config.addCollection("posts", async function () {
    let collection = await notion.fetch()
    const posts = collection.siteData['/posts']
    return filterPosts(posts);
  });

  config.addCollection("team", async function() {
    let collection = await notion.fetch()
    const team = collection.siteData['/team']
    return filterPosts(team)
  })

  return {
    templateFormats: ['md', 'njk', 'jpg', 'png', 'gif'],
    dir: {
      input: "src",
      includes: "../_includes"
    }
  }
}
