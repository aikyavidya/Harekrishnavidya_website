import { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  uploadImage?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  categories?: string[];
  publishedAt?: string;
  isPublished?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  readTime?: number;
  views?: number;
  likes?: number;
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

// Optional: Generate SEO metadata
export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetch(
    `https://api.harekrishnavidya.org/api/blogs/slug/${slug}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const post: BlogPost = await res.json();

  return {
    title: `${post.metaTitle || post.title} | ISKCON Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.tags?.join(", "),
    authors: post.author ? [{ name: post.author }] : [],
    openGraph: {
      title: post.ogTitle || post.title,
      description: post.ogDescription || post.excerpt,
      images: post.ogImage ? [{ url: post.ogImage }] : [],
    },
  };
}

// Content renderer (unchanged)

// Main component
export default async function BlogDetail({ params }: BlogPageProps) {
  const { slug } = await params;
  const res = await fetch(
    `https://api.harekrishnavidya.org/api/blogs/slug/${slug}`,
    { cache: "no-store" }
  );
  //console.log(res)

  if (!res.ok) {
    return <BlogDetailClient post={null} />;
  }

  const post: BlogPost = await res.json();

  return <BlogDetailClient post={post} />;
}
