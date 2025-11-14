import { getCollection, type CollectionEntry } from "astro:content";
import siteConfig from "@config/config.json";

export type LocaleRouteMap = Record<string, Record<string, Record<string, string>>>;

const blogFolder = siteConfig.settings?.blog_folder ?? "blog";
let cachedRouteMap: LocaleRouteMap | null = null;
let loadingPromise: Promise<LocaleRouteMap> | null = null;

type SupportedCollection = CollectionEntry<"blog"> | CollectionEntry<"pages">;

type CollectionName = "blog" | "pages";

const collectionBuilders: Record<CollectionName, () => Promise<SupportedCollection[]>> = {
  blog: () => getCollection("blog") as Promise<CollectionEntry<"blog">[]>,
  pages: () => getCollection("pages") as Promise<CollectionEntry<"pages">[]>,
};

function getEntryLocale(entry: SupportedCollection): string | undefined {
  const [locale] = entry.id.split("/");
  return locale;
}

function getEntryPath(collection: CollectionName, entry: SupportedCollection): string {
  const [, ...slugParts] = entry.slug.split('/');
  const normalizedSlug = slugParts.join('/') || entry.slug;

  if (collection === "blog") {
    return `${blogFolder}/${normalizedSlug}`;
  }

  return normalizedSlug;
}

function ensureLocaleMap(map: LocaleRouteMap, locale: string, path: string) {
  if (!map[locale]) {
    map[locale] = {};
  }

  if (!map[locale][path]) {
    map[locale][path] = {};
  }
}

async function buildRouteMap(): Promise<LocaleRouteMap> {
  const entriesByKey = new Map<string, Array<{ locale: string; path: string }>>();

  await Promise.all(
    (Object.keys(collectionBuilders) as CollectionName[]).map(async (collectionName) => {
      const entries = await collectionBuilders[collectionName]();

      entries.forEach((entry) => {
        const translationKey = entry.data.translationKey as string | undefined;
        if (!translationKey) {
          return;
        }

        const locale = getEntryLocale(entry);
        if (!locale) {
          return;
        }

        const path = getEntryPath(collectionName, entry);
        const existing = entriesByKey.get(translationKey) ?? [];
        existing.push({ locale, path });
        entriesByKey.set(translationKey, existing);
      });
    })
  );

  const routeMap: LocaleRouteMap = {};

  entriesByKey.forEach((entries) => {
    if (entries.length < 2) {
      return;
    }

    entries.forEach(({ locale: sourceLocale, path: sourcePath }) => {
      ensureLocaleMap(routeMap, sourceLocale, sourcePath);

      entries
        .filter(({ locale }) => locale !== sourceLocale)
        .forEach(({ locale: targetLocale, path: targetPath }) => {
          routeMap[sourceLocale][sourcePath][targetLocale] = targetPath;
        });
    });
  });

  return routeMap;
}

export async function getLocalizedRouteMap(): Promise<LocaleRouteMap> {
  if (cachedRouteMap) {
    return cachedRouteMap;
  }

  if (!loadingPromise) {
    loadingPromise = buildRouteMap().then((map) => {
      cachedRouteMap = map;
      loadingPromise = null;
      return map;
    });
  }

  return loadingPromise;
}
