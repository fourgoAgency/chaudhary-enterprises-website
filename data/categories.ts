import type { Category } from "@/lib/types";

// All departments the business supplies. Only categories that have products are shown on the site.
// Order matches navigation, home tiles and shop filters.
export const categories: Category[] = [
  {
    slug: "health-household",
    name: "Health & Household",
    description: "Everyday wellness and household essentials for retail and online sellers.",
  },
  {
    slug: "beauty-personal-care",
    name: "Beauty & Personal Care",
    description: "Skin, hair and personal care lines supplied by the case.",
  },
  {
    slug: "grocery-gourmet-food",
    name: "Grocery & Gourmet Food",
    description: "Pantry staples, teas, sauces and specialty foods supplied in bulk.",
  },
  {
    slug: "kitchen-dining",
    name: "Kitchen & Dining",
    description: "Cookware, utensils and tableware for retail and online sellers.",
  },
  {
    slug: "home-kitchen",
    name: "Home & Kitchen",
    description: "Storage, organization and home goods at wholesale prices.",
  },
  {
    slug: "tools-home-improvement",
    name: "Tools & Home Improvement",
    description: "Hand tools, hardware and home-improvement supplies.",
  },
  {
    slug: "automotive",
    name: "Automotive",
    description: "Car care, accessories and maintenance products.",
  },
  {
    slug: "industrial-scientific",
    name: "Industrial & Scientific",
    description: "Lab, safety and industrial consumables for business buyers.",
  },
  {
    slug: "sports-outdoors",
    name: "Sports & Outdoors",
    description: "Fitness, training and outdoor gear in case quantities.",
  },
  {
    slug: "electronics",
    name: "Electronics",
    description: "Cables, chargers and everyday electronic accessories.",
  },
  {
    slug: "musical-instruments",
    name: "Musical Instruments",
    description: "Instrument accessories and consumables for music retailers.",
  },
  {
    slug: "arts-crafts-sewing",
    name: "Arts, Crafts & Sewing",
    description: "Craft, art and sewing supplies for hobby retailers.",
  },
  {
    slug: "office-products",
    name: "Office Products",
    description: "Stationery, filing and office essentials in bulk.",
  },
  {
    slug: "toys-games",
    name: "Toys & Games",
    description: "Games, puzzles and toys for seasonal and year-round sales.",
  },
  {
    slug: "baby",
    name: "Baby",
    description: "Baby care and feeding essentials from approved supply channels.",
  },
];
