"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../components/LanguageProvider";

export interface BlogPost {
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

interface BlogDetailClientProps {
  post: BlogPost | null;
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const { t } = useLanguage();

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            {t("blog.detail.postNotFoundTitle")}
          </h1>
          <p className="text-gray-600 mb-8">
            {t("blog.detail.postNotFoundMessage")}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft size={20} />
            {t("blog.detail.backToBlog")}
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = post.coverImage || post.uploadImage || "/default.jpg";
  const date = post.publishedAt || post.createdAt || "";
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : t("blog.detail.dateNotAvailable");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-900 hover:text-orange-500 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          {t("blog.detail.backToBlog")}
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
          <div className="flex items-center gap-2">
            <User size={18} />
            <span className="font-medium">{post.author || t("blog.detail.authorFallback")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>
              {post.readTime ? `${post.readTime}${t("blog.detail.readTimeSuffix")}` : t("blog.detail.readTimeFallback")}
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
              <p>{t("blog.detail.noContentTitle")}</p>
              <p className="mt-4 text-gray-500">
                {t("blog.detail.noContentMessage")}
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
      </div>
    </div>
  );
}
