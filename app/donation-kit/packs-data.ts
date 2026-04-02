// packs-data.ts

export interface DonationPack {
  slug: string;
  title: string;
  price: number;
  image: string;
  description: string;
  items: string[];
}

export const donationPacks: DonationPack[] = [
  {
    slug: "education-support-kit",
    title: "Education Support Kit",
    price: 650,
    image: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76d",
    description:
      "Our Education Support Kit provides all essential stationery and learning materials.",
    items: [
      "3-5 Recycled Notebooks",
      "2 Blue Pens & 2 Pencils",
      "Eraser & Sharpener",
      "1 Geometry Box",
      "School Bag",
    ],
  },

  {
    slug: "aikya-vidya-center-kit",
    title: "aikya-vidya-center-kit",
    price: 750,
    image:
      "https://images.unsplash.com/photo-1604909052846-df55f38c3d29",
    description:
      "Complete nutritious grocery pack for a family including grains and essentials.",
    items: [
      "Rice - 10Kg",
      "Wheat Flour - 5Kg",
      "Dal - 5Kg",
      "Cooking Oil - 1L",
      "Salt & Spices",
    ],
  },

  {
    slug: "nutritious-meal-kit",
    title: "Winter Warmth Kit",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947",
    description:
      "Provide warm clothing essentials to protect families during winter.",
    items: ["Woolen Blanket", "Socks", "Cap", "Sweater"],
  },
];
