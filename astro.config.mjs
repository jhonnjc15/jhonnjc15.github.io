import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import config from "./src/config/config.json";
import mdx from '@astrojs/mdx';
import AutoImport from 'astro-auto-import';


const SITE_URL = process.env.SITE_URL ?? "http://localhost:4321";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: "never"
  },
  scopedStyleStrategy: "where",
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop'
    }
  },
  site: SITE_URL,
  base: "/",  
  //trailingSlash: config.site.trailing_slash ? "always" : "never",
  integrations: [
    react({
      include: ['**/react/*']
    }),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    AutoImport({
      imports: [
        "@shortcodes/Button",
        "@shortcodes/Accordion",
        "@shortcodes/Notice",
        "@shortcodes/Video",
        "@shortcodes/Youtube",
        "@shortcodes/Blockquote",
        "@shortcodes/Badge",
        "@shortcodes/ContentBlock",
        "@shortcodes/Changelog",
      ],
    }),
    mdx()
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
    }
  },
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
