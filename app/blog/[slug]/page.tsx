import Image from "next/image";
import { Metadata } from "next";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The requested blog post could not be found.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const post: BlogPost = await res.json();

  const mainImage = post.coverImage || post.uploadImage || "/default.jpg";
  const date = post.publishedAt || post.createdAt || "";
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "Date not available";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-900 hover:text-orange-500 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </Link>

        {/* Category */}
        {/* <div className="mb-4">
          <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
            {Array.isArray(post.categories) && post.categories.length > 0
              ? post.categories[0]
              : "Uncategorized"}
          </span>
        </div> */}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
          <div className="flex items-center gap-2">
            <User size={18} />
            <span className="font-medium">{post.author || "ISKCON"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>
              {post.readTime ? `${post.readTime} min read` : "5 min read"}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <Image
            src={mainImage}
            alt={post.title}
            className="w-[850px] h-[600px] object-cover"
            width={850}
            height={600}
          />
        </div>

        {/* Excerpt */}
        <div className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-orange-500 pl-6">
          {post.excerpt}
        </div>

        <div className="mb-8 rounded-xl overflow-hidden shadow-lg"></div>

        {/* Content */}
        <div className="prose prose-lg max-w-4xl mx-auto">
          {/* Convert content to HTML and render */}
          {post.content && post.content.trim() !== "" ? (
            <div
              className="text-lg text-gray-600 leading-relaxed [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>li]:mb-2 [&>strong]:font-bold [&>strong]:text-gray-900 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-[#0B3954] [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mb-3"
              dangerouslySetInnerHTML={{
                __html: decodeURIComponent(
                  post.content
                    .replace(/\\u003C/g, "<")
                    .replace(/\\u003E/g, ">")
                    .replace(/\\r\\n/g, "")
                ),
              }}
            />
          ) : (
            <div className="text-lg text-gray-600 leading-relaxed">
              <p>Content not available for this blog post.</p>
              <p className="mt-4 text-gray-500">
                This blog post is currently being prepared. Please check back
                later for the full content.
              </p>
            </div>
          )}
        </div>

        {/* OG Image if present */}
        {post.ogImage && (
          <div className="mt-8">
            <Image
              src={post.ogImage}
              alt={`${post.title} visual`}
              className="w-[850px] h-[650px] object-cover rounded-lg"
              width={850}
              height={650}
            />
          </div>
        )}

        {/* Tags */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full `}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
