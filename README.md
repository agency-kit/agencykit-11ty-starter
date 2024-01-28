<p align="center">

  <img src="/public/agencykit-11ty-starter.png">

  <h1 align="center">AgencyKit-11ty-Starter</h1>

</p>

---

## Jump in

Leverage the combined efficiency and power of [11ty](https://www.11ty.dev/) as your SSG and Notion-as-a-CMS, powered by [NotionCMS](https://www.agencykit.so/notion-cms/guide/).

Grab your Notion database ID and API key from an existing integration (if you don't know how check [here](https://www.agencykit.so/notion-cms/quickstart/#create-notion-integration)), slap it into your `.env` file and you are ready to build your site quickly from Notion content.

This starter automatically generates a collection for each group of pages in your Notion database hierarchy (see the [sample database structure](https://cooked-shovel-3c3.notion.site/NotionCMS-Quickstart-Database-Template-719f1f9d1547465d96bcd7e80333c831?pvs=4)).

No configuration besides the `.env` is required to get started, but this is also a great jumping off point for more advanced workflows using NotionCMS plugins and custom 11ty templating and pagination.

## Usage

1. Set up your Notion database ID and Auth key in `.env`. Don't forget to set `draftMode` true if you haven't published anything.

2. Run 11ty.

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
