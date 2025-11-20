export const filterByLocale = <T extends { slug: string }>(
  entries: T[],
  locale: string,
) => entries.filter((entry) => entry.slug.startsWith(`${locale}/`));
