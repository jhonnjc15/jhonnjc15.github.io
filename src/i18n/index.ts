import { getEntryBySlug } from "astro:content";

const LANG = {
	ENGLISH: 'en',
	SPANISH: 'es',
};

const fallbackLocale = LANG.SPANISH;

async function getLocaleEntry(locale: string) {
  let entry = await getEntryBySlug("i18n", locale);
  if (!entry && locale !== fallbackLocale) {
    entry = await getEntryBySlug("i18n", fallbackLocale);
  }
  return entry?.data ?? {};
}

export async function getTranslations(lang: string) {
  const locale = LANG[lang as keyof typeof LANG] || fallbackLocale;
  return getLocaleEntry(locale);
}

export const getI18N = async ({
	currentLocale = 'es',
}: {
	currentLocale: string | undefined;
}) => {
  const spanish = await getLocaleEntry(fallbackLocale);
	if (currentLocale === LANG.ENGLISH) {
    const english = await getLocaleEntry(LANG.ENGLISH);
    return { ...spanish, ...english };
  }
	return spanish;
};
