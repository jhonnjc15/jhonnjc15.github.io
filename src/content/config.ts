import { defineCollection, z } from "astro:content";

// Blog collection schema
const blogCollection = defineCollection({
  schema: z
    .object({
      id: z.string().optional(),
      title: z.string(),
      subtitle: z.string().optional(),
      date: z.date().optional(),
      image: z.string().optional(),
      author: z.string().optional(),
      categories: z.array(z.string()).default(["others"]),
      draft: z.boolean().optional(),
      featured: z.boolean().optional(),
    })
    .passthrough(),
});

// Pages collection schema
const pagesCollection = defineCollection({
  schema: z
    .object({
      id: z.string().optional(),
      title: z.string(),
      meta_title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      layout: z.string().optional(),
      draft: z.boolean().optional(),
    })
    .passthrough(),
});

const aboutSectionImage = z
  .object({
    src: z.string(),
    alt: z.string().optional(),
  })
  .optional();

const aboutSection = z.object({
  title: z.string(),
  description: z.string(),
  image: aboutSectionImage,
});

const aboutCollection = defineCollection({
  schema: z
    .object({
      whoWeAre: aboutSection,
      vision: aboutSection.extend({
        quote: z.string().optional(),
      }),
      mission: aboutSection,
      culture: aboutSection,
      openFrontiers: aboutSection,
      labImpact: aboutSection,
      pocketLab: aboutSection,
    })
    .passthrough(),
});

const faqItem = z.object({
  title: z.string(),
  content: z.string(),
});

const productsCollection = defineCollection({
  schema: z
    .object({
      id_product: z.number().optional(),
      category: z.string().optional(),
      id_category: z.number().optional(),
      name: z.string().optional(),
      title: z.string(),
      page_title: z.string().optional(),
      meta_title: z.string().optional(),
      description: z.string().optional(),
      feature_1: z.string().optional(),
      feature_2: z.string().optional(),
      feature_3: z.string().optional(),
      image: z.string().optional(),
      video: z.string().optional(),
      draft: z.boolean().optional(),
      featured: z.boolean().optional(),
      product_list: z
        .object({
          title: z.string(),
          description: z.string().optional(),
          product_detail_button: z
            .object({
              label: z.string(),
              link: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      faq: z
        .object({
          title: z.string(),
          description: z.string().optional(),
          faq_list: z.array(faqItem).optional(),
        })
        .optional(),
    })
    .passthrough(),
});

// Export collections
export const collections = {
  blog: blogCollection,
  pages: pagesCollection,
  products: productsCollection,
  about: aboutCollection,
};
