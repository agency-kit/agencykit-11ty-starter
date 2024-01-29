<p align="center">
  <img src="/public/agencykit-11ty-starter.png">
  <h1>AgencyKit-11ty-Starter</h1>
</p>

Leverage the combined efficiency and power of [11ty](https://www.11ty.dev/) as your SSG and Notion-as-a-CMS, powered by [NotionCMS](https://www.agencykit.so/notion-cms/guide/).

No configuration besides setting 2 variables in `.env` is required to get started, but this is also a great jumping off point for more advanced workflows using NotionCMS plugins and custom 11ty templating and pagination.

## Usage

1. Set up your Notion database ID and API key in `.env`.

   ```
   NOTION_API=your_secret_here
   NOTION_DB_ID=your_db_id_here
   ```
   
   If you've never used Notion API before, you have to set up an integration and get an API key (steps [here](https://www.agencykit.so/notion-cms/quickstart/#create-notion-integration)).

   Then you have to set up a NotionCMS-compatible database to hold your content (you can copy [this one to start](https://cooked-shovel-3c3.notion.site/NotionCMS-Quickstart-Database-Template-719f1f9d1547465d96bcd7e80333c831?pvs=4)) and get to writing.
  
   Don't forget to set `draftMode` true if you haven't published anything. See full list of NotionCMS options [here](https://www.agencykit.so/notion-cms/guide/api/).

3. Run 11ty.

   ```npm run --serve```

## Features

- Build large sites from Notion data with a single command
- Automatic collections straight from Notion
- All (non-draft) pages in Notion built by default thanks to 11ty pagination
- Tag based collections [coming soon]
- Very fast builds thanks to NotionCMS caching
- Notion image caching
- Supercharged SEO thanks to NotionCMS SEO core plugin and extendable to your exact SEO needs. Plus, if you're using 11ty for SSG, you're ahead of the pack already!

This is just an overview of why 11ty + NotionCMS is so powerful.

For full list of 11ty features:

[11ty](https://www.11ty.dev/docs/)

[NotionCMS](https://www.agencykit.so/notion-cms/guide/#core-features)

Minimal styling thanks to [modern normalize](https://github.com/sindresorhus/modern-normalize) and [Sakura](https://github.com/oxalorg/sakura).
