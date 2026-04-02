"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
    ArrowLeft, Heart, Play, Search, Video, Calendar,
    Eye, Clock, Filter, X, Users, Sparkles, LayoutGrid,
    Megaphone, MessageSquareHeart, Film, Bell
} from "lucide-react";

// API Configuration
// const API_BASE_URL = "http://localhost:5000/api";

const API_BASE_URL = "https://api.harekrishnavidya.org/api";
interface VideoItem {
    _id: string;
    videoTitle: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: string;
    viewCount: number;
    publishDate: string;
    category: string;
    featured: boolean;
}

// Map backend categories to frontend categories
const categoryMap: Record<string, "event" | "campaign" | "testimonial" | "documentary" | "update"> = {
    "Events": "event",
    "Campaigns": "campaign",
    "Testimonials": "testimonial",
    "Documentaries": "documentary",
    "Updates": "update"
};

const categoryConfig = {
    event: { label: "Event", color: "bg-blue-500" },
    campaign: { label: "Campaign", color: "bg-primary" },
    testimonial: { label: "Testimonial", color: "bg-green-500" },
    documentary: { label: "Documentary", color: "bg-purple-500" },
    update: { label: "Update", color: "bg-amber-500" },
};

const VideoGallery = () => {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("date");
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    // Fetch videos from API
    const fetchVideos = async () => {
        try {
            setError("");
            const response = await fetch(`${API_BASE_URL}/video-gallery`);

            if (!response.ok) {
                throw new Error("Failed to fetch videos");
            }

            const result = await response.json();
            setVideos(result.data || []);
        } catch (err) {
            console.error("Error fetching videos:", err);
            setError("Failed to load videos. Please try again later.");
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and auto-refresh every 30 seconds
    useEffect(() => {
        fetchVideos();

        // Auto-refresh to show new videos without page reload
        const interval = setInterval(() => {
            fetchVideos();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Helper function to get video thumbnail (prioritize YouTube/Vimeo over stored thumbnailUrl)
    const getVideoThumbnail = (video: VideoItem): string => {
        const url = (video.videoUrl || "").trim();
        // YouTube: always use YouTube thumbnail (watch, shorts, embed, youtu.be)
        const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^&?#]+)/);
        if (ytMatch) {
            return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
        }
        // Vimeo: use stored thumbnail or placeholder (no simple thumbnail URL like YouTube)
        if (/vimeo\.com/i.test(url)) {
            return video.thumbnailUrl || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600";
        }
        // Direct video / other: use stored thumbnailUrl if valid
        if (video.thumbnailUrl && video.thumbnailUrl.startsWith("http")) {
            return video.thumbnailUrl;
        }
        return "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600";
    };

    const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

    // Helper to get embed/playable URL (YouTube, Vimeo → embed, or full URL for direct files)
    const getVideoEmbedUrl = (videoUrl: string): string => {
        const trimmed = (videoUrl || "").trim();
        if (!trimmed) return "";
        // YouTube: watch, shorts, embed, youtu.be
        const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^&?#]+)/);
        if (ytMatch) {
            return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
        }
        // Vimeo: vimeo.com/ID or player.vimeo.com/video/ID
        const vimeoMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
        }
        // Direct video URL
        if (trimmed.startsWith("http")) return trimmed;
        return `${API_ORIGIN}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
    };

    const isEmbeddableUrl = (url: string) => /youtube\.com|youtu\.be|vimeo\.com/i.test(url || "");

    const filteredVideos = videos
        .filter((video) => {
            const matchesSearch = video.videoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()));

            // Map backend category to frontend category for filtering
            const mappedCategory = categoryMap[video.category] || video.category.toLowerCase();
            const matchesCategory = categoryFilter === "all" || mappedCategory === categoryFilter;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === "date") return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
            if (sortBy === "views") return b.viewCount - a.viewCount;
            return a.videoTitle.localeCompare(b.videoTitle);
        });

    const featuredVideos = videos.filter(v => v.featured);

    const formatViews = (views: number) => {
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Loading State */}
            {loading && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
                        <p className="text-lg font-medium text-foreground">Loading videos...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                        <Video className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-red-800 mb-2">Failed to Load Videos</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={fetchVideos} className="bg-red-600 hover:bg-red-700">
                            Try Again
                        </Button>
                    </div>
                </div>
            )}


            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Dynamic Background with Gradient Mesh */}
                <div className="absolute inset-0     bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] " />

                {/* Animated Gradient Orbs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/30 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-3xl" />
                </motion.div>

                {/* Geometric Pattern Overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L100 50L50 100L0 50Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '50px 50px'
                }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="text-left">
                            {/* Floating Badge */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20"
                            >
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                <span className="text-white/90 text-xs sm:text-sm font-medium">Watch Stories of Impact</span>
                            </motion.div>

                            {/* Main Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6"
                            >
                                Our
                                <span className="block text-white/90">Video</span>
                                <span className="block relative">
                                    <span className="relative z-10">Gallery</span>
                                    <motion.span
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                        className="absolute bottom-2 left-0 right-0 h-4 sm:h-5 bg-primary/40 -z-0 origin-left"
                                    />
                                </span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-lg sm:text-xl text-white/80 mb-8 max-w-md leading-relaxed"
                            >
                                Experience the transformative journey —
                                <span className="text-white font-semibold"> {loading ? "..." : `${videos.length}+`} videos</span> showcasing
                                <span className="text-white font-semibold"> real stories</span> of hope and change.
                            </motion.p>

                            {/* Quick Stats - Inline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-wrap gap-6"
                            >
                                {[
                                    { value: loading ? "..." : `${videos.length}+`, label: "Videos" },
                                    { value: loading ? "..." : `${videos.reduce((acc, v) => acc + v.viewCount, 0) > 1000 ? Math.floor(videos.reduce((acc, v) => acc + v.viewCount, 0) / 1000) + 'K+' : videos.reduce((acc, v) => acc + v.viewCount, 0)}`, label: "Views" },
                                    { value: loading ? "..." : `${videos.length}+`, label: "Stories" },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <div className="text-3xl sm:text-4xl font-black text-white">{stat.value}</div>
                                        <div className="text-sm text-white/60 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTA Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="mt-10"
                            >
                                <Button
                                    size="sm"
                                    className="bg-white text-[#FF7F2A] hover:bg-white/90 shadow-2xl shadow-orange-950/20 text-lg h-14 px-6 rounded-2xl font-bold group"
                                    asChild
                                >
                                    <Link href={"/donation#donate"}>
                                        <Heart className="w-3 h-3 mr-2 fill-[#FF7F2A] group-hover:scale-110 transition-transform" />
                                        Donate
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right Side - Video Thumbnail Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="grid grid-cols-3 gap-3">
                                {!loading && videos.slice(0, 6).map((video, index) => (
                                    <motion.div
                                        key={video._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        whileHover={{ scale: 1.05, zIndex: 10 }}
                                        className={`relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer ${index === 1 ? 'row-span-2 h-64' : 'h-28'
                                            } ${index === 4 ? 'col-span-2' : ''}`}
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        <img
                                            src={getVideoThumbnail(video)}
                                            alt={video.videoTitle}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <div className="w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center">
                                                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Floating Stats Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Video className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-foreground">{loading ? "..." : `${videos.length}+`}</div>
                                        <div className="text-sm text-muted-foreground">Impact Stories</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Decorative Ring */}
                            <div className="absolute -top-8 -right-8 w-32 h-32 border-4 border-white/20 rounded-full" />
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-white/60 text-xs uppercase tracking-widest">Scroll to explore</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
                        >
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Category Filter Buttons */}
            <section className="py-6 sm:py-8 border-b border-border bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-2 sm:gap-3"
                    >
                        {[
                            { id: "all", label: "All Videos", icon: LayoutGrid, count: videos.length },
                            { id: "event", label: "Events", icon: Calendar, count: videos.filter(v => categoryMap[v.category] === "event").length },
                            { id: "campaign", label: "Campaigns", icon: Megaphone, count: videos.filter(v => categoryMap[v.category] === "campaign").length },
                            { id: "testimonial", label: "Testimonials", icon: MessageSquareHeart, count: videos.filter(v => categoryMap[v.category] === "testimonial").length },
                            { id: "documentary", label: "Documentaries", icon: Film, count: videos.filter(v => categoryMap[v.category] === "documentary").length },
                            { id: "update", label: "Updates", icon: Bell, count: videos.filter(v => categoryMap[v.category] === "update").length },
                        ].map((filter, index) => (
                            <motion.button
                                key={filter.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCategoryFilter(filter.id)}
                                className={`
                  flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium
                  transition-all duration-300 shadow-sm
                  ${categoryFilter === filter.id
                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                        : "bg-white text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border"
                                    }
                `}
                            >
                                <filter.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">{filter.label}</span>
                                <span className="sm:hidden">{filter.id === "all" ? "All" : filter.label.split(" ")[0]}</span>
                                <span className={`
                  px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold
                  ${categoryFilter === filter.id
                                        ? "bg-white/20 text-white"
                                        : "bg-muted text-muted-foreground"
                                    }
                `}>
                                    {filter.count}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Featured Videos */}
            {featuredVideos.length > 0 && categoryFilter === "all" && (
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="px-4 py-12"
                >
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"
                        >
                            <Play className="w-6 h-6 text-primary" />
                            Featured Videos
                        </motion.h2>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.15 }
                                }
                            }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            {featuredVideos.map((video) => (
                                <motion.div
                                    key={video._id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                            transition: {
                                                type: "spring",
                                                stiffness: 100,
                                                damping: 15,
                                            }
                                        }
                                    }}
                                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                >
                                    <Card
                                        className="group cursor-pointer bg-white border-border hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-md hover:shadow-2xl h-full"
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        <div className="relative aspect-video overflow-hidden">
                                            <motion.img
                                                src={getVideoThumbnail(video)}
                                                alt={video.videoTitle}
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.08 }}
                                                transition={{ duration: 0.4 }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            {/* Play Button */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <motion.div
                                                    className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-2xl"
                                                    whileHover={{ scale: 1.15, backgroundColor: "hsl(var(--primary))" }}
                                                    whileTap={{ scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                                                </motion.div>
                                            </div>

                                            {/* Duration */}
                                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-white text-sm font-medium flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {video.duration}
                                            </div>

                                            {/* Category Badge */}
                                            <Badge className={`absolute top-3 left-3 ${categoryConfig[categoryMap[video.category] || "event"].color}`}>
                                                {categoryConfig[categoryMap[video.category] || "event"].label}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-5">
                                            <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                {video.videoTitle}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{video.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {formatViews(video.viewCount)} views
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(video.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>
            )}

            {/* Filters */}
            <section className="px-4 pb-8">
                <div className="max-w-7xl mx-auto mt-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-3 w-full">

                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search videos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border rounded-md px-3 py-2 sm:max-w-md w-full"
                            />

                            {/* Category */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="border rounded-md px-3 py-2 w-full sm:w-[160px] cursor-pointer"
                            >
                                <option value="all">All Categories</option>
                                <option value="event">Events</option>
                                <option value="campaign">Campaigns</option>
                                <option value="testimonial">Testimonials</option>
                                <option value="documentary">Documentaries</option>
                                <option value="update">Updates</option>
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border rounded-md px-3 py-2 w-full sm:w-[160px] cursor-pointer"
                            >
                                <option value="date">Most Recent</option>
                                <option value="views">Most Viewed</option>
                                <option value="title">Title A-Z</option>
                            </select>

                        </div>

                    </div>
                </div>
            </section>

            {/* Video Grid */}
            <section className="px-4 pb-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.08 }
                            }
                        }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredVideos.map((video, index) => (
                                <motion.div
                                    key={video._id}
                                    layout
                                    variants={{
                                        hidden: { opacity: 0, y: 40, scale: 0.95 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                            transition: {
                                                type: "spring",
                                                stiffness: 100,
                                                damping: 15,
                                            }
                                        }
                                    }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                >
                                    <Card
                                        className="group cursor-pointer bg-white border-border hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl h-full"
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        <div className="relative aspect-video overflow-hidden">
                                            <motion.img
                                                src={getVideoThumbnail(video)}
                                                alt={video.videoTitle}
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.4 }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                            {/* Play Button */}
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                            >
                                                <motion.div
                                                    className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center shadow-2xl"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                                </motion.div>
                                            </motion.div>

                                            {/* Duration */}
                                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-white text-xs font-medium">
                                                {video.duration}
                                            </div>

                                            {/* Category */}
                                            <Badge className={`absolute top-2 left-2 text-xs ${categoryConfig[categoryMap[video.category] || "event"].color}`}>
                                                {categoryConfig[categoryMap[video.category] || "event"].label}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                                                {video.videoTitle}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {formatViews(video.viewCount)}
                                                </span>
                                                <span>{new Date(video.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredVideos.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                <Video className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">No videos found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </section>



            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
                className="px-4 pb-20"
            >
                <motion.div
                    className="max-w-4xl mx-auto text-center    bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F]  rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '24px 24px'
                        }}></div>
                    </div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                            <Video className="w-12 h-12 mx-auto text-white mb-4" />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl sm:text-3xl font-extrabold text-white mb-4"
                        >
                            Be Part of Our Story
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-white/90 mb-8 max-w-xl mx-auto"
                        >
                            Your support helps us create more success stories. Join us in transforming lives through education.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/donation#donate"
                                className="
    h-11 sm:h-12
    px-4 sm:px-5
    inline-flex items-center justify-center
    text-sm sm:text-base
    font-semibold
    rounded-lg
    bg-white
    text-orange-600
    shadow-lg
    transition-all duration-300
    hover:scale-105
    hover:bg-white/95
    cursor-pointer
    whitespace-nowrap
    w-fit
  "
                            >
                                <Heart className="w-5 h-5 mr-2" />
                                Support Our Mission
                            </Link>

                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Video Player Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                                {isEmbeddableUrl(selectedVideo.videoUrl) ? (
                                    <iframe
                                        src={getVideoEmbedUrl(selectedVideo.videoUrl)}
                                        title={selectedVideo.videoTitle}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <video
                                        src={getVideoEmbedUrl(selectedVideo.videoUrl)}
                                        controls
                                        autoPlay
                                        playsInline
                                        className="w-full h-full"
                                    />
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="text-white text-lg font-bold">{selectedVideo.videoTitle}</h3>
                                <p className="text-white/70 text-sm mt-1 line-clamp-2">{selectedVideo.description}</p>
                                <a
                                    href={selectedVideo.videoUrl.startsWith("http") ? selectedVideo.videoUrl : getVideoEmbedUrl(selectedVideo.videoUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-3 text-primary hover:text-primary/90 text-sm font-medium"
                                >
                                    Open in new tab
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default VideoGallery;