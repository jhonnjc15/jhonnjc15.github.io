import { slugify } from "./textConverter";

type ProductSlugSource = {
  id_product?: number;
  name?: string;
  title?: string;
};

export const getProductSlug = (product: ProductSlugSource) => {
  const base = product.name ?? product.title ?? (product.id_product ? String(product.id_product) : "");
  return slugify(base) ?? base;
};
