"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

// Types
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  uploadImage?: string; // Changed from StaticImageData to string
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

// Blog Post Card Component
const BlogPostCard = ({
  post,
  onClick,
  isFeatured = false,
  className = "",
}: {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
  isFeatured?: boolean;
  className?: string;
}) => {
  if (isFeatured) {
    return (
      <article
        onClick={() => onClick(post)}
        className={`flex flex-col lg:flex-row h-full bg-white rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group ${className}`}
      >
        {/* Image */}
        <div className="relative w-full lg:w-1/2 h-64 lg:h-full">
          {post.uploadImage && (
            <Image
              src={post.uploadImage}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col justify-center w-full lg:w-1/2">
          <h3 className="font-bold text-2xl lg:text-3xl text-blue-900 mb-4 group-hover:text-orange-500 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-base mb-4 line-clamp-4">
            {post.excerpt}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-1" />
            <span>{post.createdAt?.split("T")[0]}</span>
          </div>
        </div>
      </article>
    );
  }


  // Regular card layout
  return (
    <article
      onClick={() => onClick(post)}
      className={`bg-white rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group ${className}`}
    >
      <div className="relative h-[450px] overflow-hidden">
        {post.uploadImage && (
          <Image
            src={post.uploadImage}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl text-blue-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{post.createdAt?.split("T")[0]}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

// Main Blog Component
const BlogSystem: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://api.harekrishnavidya.org/api/blogs/");
        const data = await res.json();
        console.log(data);
        setBlogPosts(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const openPost = (post: BlogPost) => {
    router.push(`/blog/${post.slug}`);
  };

  // split first 2 blogs
  const featuredPost = blogPosts[0];
  const rightSideCard = blogPosts[1];
  const regularPosts = blogPosts.slice(2); // rest after the first two

  console.log(featuredPost);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-5xl font-bold text-blue-900 mb-6">
            Spiritual <span className="text-orange-500">Insights</span>
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Discover ancient wisdom for modern living through festivals,
            philosophy, service, and spiritual practices that transform hearts
            and minds.
          </p>
        </div>

        {/* Featured Post */}
        {/* Featured + Right Card Section */}
        {featuredPost && rightSideCard && (
          <section className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured blog spans 2 columns */}
            <div className="lg:col-span-2 h-[500px]">
              <BlogPostCard
                post={featuredPost}
                onClick={openPost}
                isFeatured={true}
              />
            </div>

            {/* Right-side blog (normal layout) */}
            <div className="lg:col-span-1">
              <BlogPostCard post={rightSideCard} onClick={openPost} />
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-900">
              Latest Articles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <BlogPostCard key={post._id} post={post} onClick={openPost} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogSystem;
