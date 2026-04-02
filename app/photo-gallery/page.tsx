"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Heart, X, ChevronLeft, ChevronRight, ZoomIn,
  Camera, Calendar, MapPin, Image, Sparkles, Users, BookOpen,
  GraduationCap, PartyPopper, HandHeart, Target, LayoutGrid
} from "lucide-react";

// API Configuration
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://api.harekrishnavidya.org/api";

interface Photo {
  _id: string;
  imageUrl: string;
  imageTitle: string;
  description: string;
  category: string;
  publishDate: string;
  featured: boolean;
  viewCount: number;
}

// Map backend categories to frontend categories
const categoryMap: Record<string, "education" | "event" | "celebration" | "volunteer" | "campaign"> = {
  "Education": "education",
  "Events": "event",
  "Celebrations": "celebration",
  "Volunteers": "volunteer",
  "Campaigns": "campaign",
  "Festivals": "celebration",
  "Community Service": "volunteer",
  "Temple Activities": "event",
  "Other": "event"
};

const categoryConfig = {
  education: { label: "Education", color: "bg-green-500" },
  event: { label: "Event", color: "bg-blue-500" },
  celebration: { label: "Celebration", color: "bg-purple-500" },
  volunteer: { label: "Volunteer", color: "bg-amber-500" },
  campaign: { label: "Campaign", color: "bg-primary" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  }),
};

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Fetch photos from API
  const fetchPhotos = async () => {
    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/photo-gallery`);

      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }

      const result = await response.json();
      setPhotos(result.data || []);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Failed to load photos. Please try again later.");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    fetchPhotos();

    // Auto-refresh to show new photos without page reload
    const interval = setInterval(() => {
      fetchPhotos();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredPhotos = activeFilter === "all"
    ? photos
    : photos.filter(photo => {
      const mappedCategory = categoryMap[photo.category] || photo.category.toLowerCase();
      return mappedCategory === activeFilter;
    });

  const handlePrevious = () => {
    if (selectedPhoto === null) return;
    setSelectedPhoto(selectedPhoto === 0 ? filteredPhotos.length - 1 : selectedPhoto - 1);
  };

  const handleNext = () => {
    if (selectedPhoto === null) return;
    setSelectedPhoto(selectedPhoto === filteredPhotos.length - 1 ? 0 : selectedPhoto + 1);
  };

  const getMasonryClass = (index: number) => {
    const pattern = [
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
    ];
    return pattern[index % pattern.length];
  };

  const filterButtons = [
    { id: "all", label: "All Photos", icon: LayoutGrid, count: photos.length },
    { id: "education", label: "Education", icon: GraduationCap, count: photos.filter(p => categoryMap[p.category] === "education").length },
    { id: "event", label: "Events", icon: Calendar, count: photos.filter(p => categoryMap[p.category] === "event").length },
    { id: "celebration", label: "Celebrations", icon: PartyPopper, count: photos.filter(p => categoryMap[p.category] === "celebration").length },
    { id: "volunteer", label: "Volunteers", icon: HandHeart, count: photos.filter(p => categoryMap[p.category] === "volunteer").length },
    { id: "campaign", label: "Campaigns", icon: Target, count: photos.filter(p => categoryMap[p.category] === "campaign").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
            <p className="text-lg font-medium text-foreground">Loading photos...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <Camera className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Failed to Load Photos</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPhotos} className="bg-red-600 hover:bg-red-700">
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
                <span className="text-white/90 text-xs sm:text-sm font-medium">Capturing Stories of Impact</span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6"
              >
                Our
                <span className="block text-white/90">Photo</span>
                <span className="block relative">
                  <span className="relative z-10">Gallery</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute bottom-2 left-0 right-0 h-4 sm:h-5 bg-accent/40 -z-0 origin-left"
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
                Every frame captures a moment of transformation —
                <span className="text-white font-semibold"> 2,500+ children</span> finding hope across
                <span className="text-white font-semibold"> 108 villages</span>.
              </motion.p>

              {/* Quick Stats - Inline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-6"
              >
                {[
                  { value: `${photos.length}+`, label: "Photos" },
                  { value: "100+", label: "Events" },
                  { value: "5+", label: "Years" },
                ].map((stat, index) => (
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

            {/* Right Side - Photo Mosaic Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-3 gap-3 auto-rows-[100px] xl:auto-rows-[120px]">
                {photos.slice(0, 6).map((photo, index) => (
                  <motion.div
                    key={photo._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    className={`relative rounded-2xl overflow-hidden shadow-2xl h-full w-full ${index === 1 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                      }`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.imageTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-foreground">{photos.length}+</div>
                    <div className="text-sm text-muted-foreground">Memories Captured</div>
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

      {/* Filter Section */}
      <section className="py-6 sm:py-8 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {filterButtons.map((filter, index) => (
              <motion.button
                key={filter.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium
                  transition-all duration-300 shadow-sm
                  ${activeFilter === filter.id
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
                  ${activeFilter === filter.id
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

      {/* Photo Grid */}
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-3 sm:gap-4 grid-flow-dense"
            >
              {filteredPhotos.map((photo, index) => {
                const mappedCategory = categoryMap[photo.category] || photo.category.toLowerCase() as "education" | "event" | "celebration" | "volunteer" | "campaign";
                return (
                  <motion.div
                    key={photo._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 ${getMasonryClass(index)}`}
                    onClick={() => setSelectedPhoto(index)}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.imageTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <Badge className={`absolute top-2 left-2 ${categoryConfig[mappedCategory].color} text-white text-[10px] sm:text-xs shadow-lg`}>
                      {categoryConfig[mappedCategory].label}
                    </Badge>

                    {/* Zoom Icon */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Photo Details */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1">{photo.imageTitle}</h3>
                      <p className="text-white/80 text-xs sm:text-sm line-clamp-1 mt-0.5">{photo.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-white/60 text-[10px] sm:text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(photo.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          {photo.viewCount} views
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.button>

            {/* Previous Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.button>

            {/* Next Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.button>

            {/* Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-6xl max-h-[85vh] w-full mx-4 sm:mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedPhoto}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={filteredPhotos[selectedPhoto].imageUrl}
                alt={filteredPhotos[selectedPhoto].imageTitle}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />

              {/* Photo Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 sm:mt-6 text-center"
              >
                <Badge className={`${categoryConfig[categoryMap[filteredPhotos[selectedPhoto].category] || "event"].color} text-white mb-2`}>
                  {categoryConfig[categoryMap[filteredPhotos[selectedPhoto].category] || "event"].label}
                </Badge>
                <h2 className="text-white text-lg sm:text-2xl font-bold">{filteredPhotos[selectedPhoto].imageTitle}</h2>
                <p className="text-white/70 text-sm sm:text-base mt-1 max-w-2xl mx-auto">{filteredPhotos[selectedPhoto].description}</p>
                <div className="flex items-center justify-center gap-4 mt-3 text-white/50 text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(filteredPhotos[selectedPhoto].publishDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    {filteredPhotos[selectedPhoto].viewCount} views
                  </span>
                </div>
                <p className="text-white/40 text-xs mt-3">{selectedPhoto + 1} / {filteredPhotos.length}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;