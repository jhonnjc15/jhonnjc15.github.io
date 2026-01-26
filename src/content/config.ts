import { defineCollection, z } from "astro:content";

// Blog collection schema
const blogCollection = defineCollection({
  schema: z
    .object({
      id: z.string().optional(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      date: z.date().optional(),
      image: z.string().optional(),
      author: z.string().optional(),
      categories: z.array(z.string()).default(["others"]),
      draft: z.boolean().optional(),
      featured: z.boolean().optional(),
      translationKey: z.string().optional(),
      time_to_read: z.string().optional(),
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
      translationKey: z.string().optional(),
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
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string(),
  image: aboutSectionImage,
});

const aboutButton = z.object({
  label: z.string(),
  link: z.string().optional(),
  enable: z.boolean().optional(),
  outline: z.boolean().optional(),
});

const counterItem = z.object({
  name: z.string(),
  number: z.number(),
  messurment: z.string().optional(),
  color: z.string().optional(),
});

const galleryImage = z.union([
  z.string(),
  z.object({
    src: z.string(),
    alt: z.string().optional(),
    size: z
      .enum(["tall", "wide", "square", "medium", "feature", "portrait", "landscape", "statement"])
      .optional(),
    rows: z.number().optional(),
  }),
]);

const gallerySection = z.object({
  title: z.string(),
  description: z.string().optional(),
  images: z.array(galleryImage),
});

const featureItem = z.object({
  title: z.string(),
  content: z.string(),
});

const quickPrompt = z.object({
  label: z.string(),
  message: z.string(),
});

const confirmBlock = z.object({
  title: z.string(),
  message: z.string(),
  confirm: z.string(),
  cancel: z.string(),
});

const localizedContent = defineCollection({
  schema: z.object({
    translationKey: z.string().optional(),
  }).passthrough(),
});

const featuresSection = z.object({
  title: z.string(),
  button: aboutButton.optional(),
  features_list: z.array(featureItem),
});

const memberItem = z.object({
  name: z.string(),
  field: z.string(),
  image: z.string().optional(),
});

const membersSection = z.object({
  title: z.string(),
  description: z.string(),
  member_list: z.array(memberItem),
});

// About collection schema
const aboutCollection = defineCollection({
  schema: z
    .object({
      id: z.string().optional(),
      title: z.string().optional(),
      meta_title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      translationKey: z.string().optional(),
      page_title: z.string().optional(),
      buttons: z.array(aboutButton).optional(),
      whoWeAre: aboutSection,
      vision: aboutSection.extend({
        quote: z.string().optional(),
        statement: z.string().optional(),
      }),
      mission: aboutSection,
      culture: aboutSection,
      openFrontiers: aboutSection,
      labImpact: aboutSection,
      pocketLab: aboutSection,
      counter: z.array(counterItem).optional(),
      gallery: gallerySection.optional(),
      features: featuresSection.optional(),
      members: membersSection.optional(),
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
        name: z.string().optional(),
        title: z.string().optional(),
      page_title: z.string().optional(),
      meta_title: z.string().optional(),
      description: z.string().optional(),
      features: z.array(z.string()).optional(),
      price: z.number().optional(),
      price_note: z.string().optional(),
      video: z.string().optional(),
      youtube_videos: z.array(z.string()).optional(),
      blog_articles: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
      pdf_guides: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
      related_products: z.array(z.number()).optional(),
      purchase_context: z.string().optional(),
      available: z.boolean().optional(),
      image: z.string().optional(),
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
  about: aboutCollection,
  products: productsCollection,
  homepage: localizedContent,
  contact: localizedContent,
  layout: localizedContent,
};
