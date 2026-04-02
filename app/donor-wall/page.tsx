"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
    ArrowLeft, Heart, Crown, Star, Award, Medal, Search,
    Users, TrendingUp, Calendar, Sparkles
} from "lucide-react";
import useUTM from "../utils/useUTM";

// API Configuration
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://api.harekrishnavidya.org/api";

interface Donor {
    _id: string;
    fullName: string;
    amount: number;
    donationDate: string;
    message?: string;
    campaign?: string;
    tier: string;
    isAnonymous: boolean;
    isVisible: boolean;
    showAmount: boolean;
    avatarColor: string;
}

// Map backend tier to frontend tier
const tierMap: Record<string, "platinum" | "gold" | "silver" | "bronze" | "supporter"> = {
    "Platinum": "platinum",
    "Gold": "gold",
    "Silver": "silver",
    "Bronze": "bronze",
    "Supporter": "supporter"
};

const tierConfig = {
    platinum: {
        icon: Crown,
        label: "Platinum",
        color: "bg-gradient-to-r from-slate-400 to-slate-300",
        textColor: "text-slate-700",
        borderColor: "border-slate-300",
        minAmount: 100000
    },
    gold: {
        icon: Star,
        label: "Gold",
        color: "bg-gradient-to-r from-yellow-400 to-amber-300",
        textColor: "text-amber-700",
        borderColor: "border-amber-300",
        minAmount: 50000
    },
    silver: {
        icon: Award,
        label: "Silver",
        color: "bg-gradient-to-r from-gray-300 to-gray-200",
        textColor: "text-gray-600",
        borderColor: "border-gray-300",
        minAmount: 15000
    },
    bronze: {
        icon: Medal,
        label: "Bronze",
        color: "bg-gradient-to-r from-orange-400 to-orange-300",
        textColor: "text-orange-700",
        borderColor: "border-orange-300",
        minAmount: 5000
    },
    supporter: {
        icon: Heart,
        label: "Supporter",
        color: "bg-gradient-to-r from-pink-400 to-rose-300",
        textColor: "text-rose-600",
        borderColor: "border-rose-300",
        minAmount: 0
    },
};

const DonorWall = () => {
    const { appendUTMToUrl } = useUTM();
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [tierFilter, setTierFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("amount");

    // Fetch donors from API
    const fetchDonors = async () => {
        try {
            setError("");
            const response = await fetch(`${API_BASE_URL}/donor-wall`);

            if (!response.ok) {
                throw new Error("Failed to fetch donors");
            }

            const result = await response.json();
            // Only show visible donors on the public wall
            const visibleDonors = (result.data || []).filter((donor: Donor) => donor.isVisible);
            setDonors(visibleDonors);
        } catch (err) {
            console.error("Error fetching donors:", err);
            setError("Failed to load donors. Please try again later.");
            setDonors([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and auto-refresh every 30 seconds
    useEffect(() => {
        fetchDonors();

        // Auto-refresh to show new donors without page reload
        const interval = setInterval(() => {
            fetchDonors();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    const filteredDonors = donors
        .filter((donor) => {
            const matchesSearch = donor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donor.campaign?.toLowerCase().includes(searchTerm.toLowerCase());

            // Map backend tier to frontend tier for filtering
            const mappedTier = tierMap[donor.tier] || donor.tier.toLowerCase();
            const matchesTier = tierFilter === "all" || mappedTier === tierFilter;

            return matchesSearch && matchesTier;
        })
        .sort((a, b) => {
            if (sortBy === "amount") return b.amount - a.amount;
            if (sortBy === "date") return new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime();
            return a.fullName.localeCompare(b.fullName);
        });

    const totalDonations = donors.reduce((sum, d) => sum + d.amount, 0);
    const uniqueDonors = donors.length;

    const formatAmount = (amount: number) => {
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
        return `₹${amount}`;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Loading State */}
            {loading && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
                        <p className="text-lg font-medium text-foreground">Loading donors...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                        <Heart className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-red-800 mb-2">Failed to Load Donors</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={fetchDonors} className="bg-red-600 hover:bg-red-700">
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
                                <span className="text-white/90 text-xs sm:text-sm font-medium">Wall of Gratitude</span>
                            </motion.div>

                            {/* Main Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6"
                            >
                                Our
                                <span className="block text-white/90">Generous</span>
                                <span className="block relative">
                                    <span className="relative z-10">Supporters</span>
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
                                Celebrating the incredible individuals who make our mission possible —
                                <span className="text-white font-semibold"> {uniqueDonors} donors</span> bringing hope to
                                <span className="text-white font-semibold"> 2,500+ children</span>.
                            </motion.p>

                            {/* Quick Stats - Inline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-wrap gap-6"
                            >
                                {[
                                    { value: formatAmount(totalDonations), label: "Raised" },
                                    { value: `${uniqueDonors}`, label: "Donors" },
                                    { value: "2,500+", label: "Lives" },
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
                                    <Link href={appendUTMToUrl("/donation#donate")}>
                                        <Heart className="w-3 h-3 mr-2 fill-[#FF7F2A] group-hover:scale-110 transition-transform" />
                                        Donate
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right Side - Top Donors Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="space-y-4">
                                {donors.slice(0, 4).map((donor, index) => {
                                    const mappedTier = tierMap[donor.tier] || donor.tier.toLowerCase() as "platinum" | "gold" | "silver" | "bronze" | "supporter";
                                    const config = tierConfig[mappedTier];
                                    const Icon = config.icon;
                                    return (
                                        <motion.div
                                            key={donor._id}
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            whileHover={{ scale: 1.02, x: -5 }}
                                            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4"
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white`} style={{ backgroundColor: donor.avatarColor }}>
                                                {donor.isAnonymous ? "?" : donor.fullName.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-semibold">{donor.isAnonymous ? "Anonymous" : donor.fullName}</div>
                                                <div className="text-white/60 text-sm">{donor.showAmount ? formatAmount(donor.amount) : "Hidden"}</div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full ${config.color} ${config.textColor} text-xs font-bold flex items-center gap-1`}>
                                                <Icon className="w-3 h-3" />
                                                {config.label}
                                            </div>
                                        </motion.div>
                                    );
                                })}
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
                                        <Crown className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-foreground">{uniqueDonors}</div>
                                        <div className="text-sm text-muted-foreground">Champions</div>
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

            {/* Tier Legend */}
            <section className="py-6 sm:py-8 border-b border-border bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-2 sm:gap-3"
                    >
                        {Object.entries(tierConfig).map(([key, config], index) => {
                            const Icon = config.icon;
                            return (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full ${config.color} ${config.textColor} font-semibold text-xs sm:text-sm shadow-md cursor-default`}
                                >
                                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span>{config.label}</span>
                                    <span className="text-[10px] sm:text-xs opacity-75">
                                        {config.minAmount > 0 ? `₹${config.minAmount.toLocaleString()}+` : "Any"}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Featured Donor of the Month */}
            <section className="relative overflow-hidden py-16 sm:py-20">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] " />

                {/* Subtle Background Orbs - Reduced animation */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-10 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-white/15 rounded-full blur-3xl" />
                </div>

                {/* Static Sparkle Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 mb-4 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                            <Crown className="w-5 h-5 text-yellow-300" />
                            <span className="text-white text-sm font-semibold">Featured Donor of the Month</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
                            Celebrating Excellence
                        </h2>
                        <p className="text-white/80 max-w-xl mx-auto">
                            Honoring those who go above and beyond in their generosity
                        </p>
                    </motion.div>

                    {/* Featured Donor Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto pt-6"
                    >
                        {/* Crown Badge - Outside the overflow container */}
                        <div className="flex justify-center mb-[-20px] relative z-30">
                            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-2.5 rounded-full shadow-lg flex items-center gap-2">
                                <Crown className="w-5 h-5" />
                                <span className="font-bold text-sm">Donor of the Month</span>
                            </div>
                        </div>

                        <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-amber-300/10 rounded-bl-full" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-tr-full" />

                            <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center pt-4">
                                {donors.length > 0 && (
                                    <>
                                        {/* Avatar Section */}
                                        <div className="flex flex-col items-center">
                                            <div className="relative">
                                                {/* Glow Ring - Static */}
                                                <div
                                                    className="absolute -inset-1 rounded-full opacity-70"
                                                    style={{
                                                        background: "conic-gradient(from 0deg, #FFD700, #FFA500, #FFD700, #FFA500, #FFD700)",
                                                    }}
                                                />
                                                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-black text-white shadow-2xl ring-4 ring-white" style={{ backgroundColor: donors[0].avatarColor }}>
                                                    {donors[0].isAnonymous ? "?" : donors[0].fullName.charAt(0)}
                                                </div>

                                                {/* Static Stars */}
                                                <Star className="absolute -top-2 -right-2 w-5 h-5 text-yellow-500 fill-yellow-500" />
                                                <Star className="absolute top-4 -right-4 w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <Star className="absolute -top-1 right-6 w-3 h-3 text-amber-400 fill-amber-400" />
                                            </div>

                                            <div className="mt-5 text-center">
                                                <h3 className="text-xl sm:text-2xl font-black text-foreground">{donors[0].isAnonymous ? "Anonymous Donor" : donors[0].fullName}</h3>
                                                <div className="flex items-center justify-center gap-1.5 mt-1">
                                                    <Crown className="w-4 h-4 text-amber-500" />
                                                    <span className="text-amber-600 font-semibold text-sm">{tierConfig[tierMap[donors[0].tier] || "supporter"].label} Champion</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Details Section */}
                                        <div className="md:col-span-2 space-y-5">
                                            {/* Amount */}
                                            <div>
                                                <div className="text-sm text-muted-foreground font-medium mb-1">Total Contribution</div>
                                                <div className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                                                    {donors[0].showAmount ? formatAmount(donors[0].amount) : "Hidden"}
                                                </div>
                                            </div>

                                            {/* Message */}
                                            {donors[0].message && (
                                                <div className="bg-muted/50 rounded-2xl p-5">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <Heart className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-muted-foreground font-medium mb-1">Their Message</div>
                                                            <p className="text-foreground italic text-base sm:text-lg">"{donors[0].message}"</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Stats Row */}
                                            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                                <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/10">
                                                    <div className="text-xl sm:text-2xl font-bold text-primary">1</div>
                                                    <div className="text-xs text-muted-foreground">Campaign</div>
                                                </div>
                                                <div className="text-center p-3 bg-accent/10 rounded-xl border border-accent/10">
                                                    <div className="text-xl sm:text-2xl font-bold text-accent">
                                                        {new Date().getMonth() - new Date(donors[0].donationDate).getMonth() + 1}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Months Active</div>
                                                </div>
                                                <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200/50">
                                                    <div className="text-xl sm:text-2xl font-bold text-amber-600">∞</div>
                                                    <div className="text-xs text-muted-foreground">Lives Changed</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
            <section className="relative overflow-hidden">
                {/* Dynamic Background similar to header */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5" />

                {/* Animated Gradient Orbs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <div className="absolute top-20 left-1/6 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-40 right-1/6 w-64 h-64 bg-accent/15 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
                </motion.div>

                {/* Geometric Pattern Overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L100 50L50 100L0 50Z' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '50px 50px'
                }} />

                <div className="relative z-10 px-4 py-12 sm:py-16">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-10"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 backdrop-blur-md rounded-full border border-primary/20"
                            >
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-primary text-sm font-medium">Our Generous Donors</span>
                            </motion.div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
                                Wall of <span className="text-primary">Champions</span>
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Every donor here has made a lasting impact on the lives of underprivileged children.
                            </p>
                        </motion.div>

                        {/* Filters - Glass Morphism Style */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mb-10"
                        >
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/60 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/40">
                                <div className="flex-1 w-full sm:max-w-md">
                                    <input
                                        type="text"
                                        placeholder="Search donors or campaigns..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full h-12 bg-white/80 border-2 border-primary/20 focus:border-primary rounded-xl px-4 text-base outline-none"
                                    />
                                </div>

                                <div className="flex gap-3 w-full sm:w-auto">

                                    {/* Tier filter */}
                                    <select
                                        value={tierFilter}
                                        onChange={(e) => setTierFilter(e.target.value)}
                                        className="w-[150px] h-12 bg-white/80 border-2 border-primary/20 rounded-xl px-3 cursor-pointer"
                                    >
                                        <option value="all">All Tiers</option>
                                        <option value="platinum">Platinum</option>
                                        <option value="gold">Gold</option>
                                        <option value="silver">Silver</option>
                                        <option value="bronze">Bronze</option>
                                        <option value="supporter">Supporter</option>
                                    </select>

                                    {/* Sort */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-[150px] h-12 bg-white/80 border-2 border-primary/20 rounded-xl px-3 cursor-pointer"
                                    >
                                        <option value="amount">Highest Amount</option>
                                        <option value="date">Most Recent</option>
                                        <option value="name">Name A-Z</option>
                                    </select>

                                </div>

                            </div>
                        </motion.div>

                        {/* Donor Grid - Enhanced Cards */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.06 }
                                }
                            }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredDonors.map((donor) => {
                                    const mappedTier = tierMap[donor.tier] || donor.tier.toLowerCase() as "platinum" | "gold" | "silver" | "bronze" | "supporter";
                                    const config = tierConfig[mappedTier];
                                    const Icon = config.icon;

                                    return (
                                        <motion.div
                                            key={donor._id}
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
                                            whileHover={{ y: -10, transition: { duration: 0.25 } }}
                                        >
                                            <Card
                                                className={`group relative overflow-hidden border-2 ${config.borderColor} hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full`}
                                            >
                                                {/* Gradient Overlay on Hover */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* Tier Badge */}
                                                <div className={`absolute top-0 right-0 px-4 py-1.5 ${config.color} ${config.textColor} text-xs font-bold rounded-bl-2xl flex items-center gap-1.5 shadow-md`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                    {config.label}
                                                </div>

                                                <CardContent className="relative z-10 p-6 pt-10">
                                                    {/* Avatar with Glow Effect */}
                                                    <motion.div
                                                        className={`w-18 h-18 mx-auto mb-5 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl ring-4 ring-white`}
                                                        style={{ width: '72px', height: '72px', backgroundColor: donor.avatarColor }}
                                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        {donor.isAnonymous ? "?" : donor.fullName.charAt(0)}
                                                    </motion.div>

                                                    {/* Name & Amount */}
                                                    <div className="text-center">
                                                        <h3 className="font-bold text-foreground text-lg mb-1.5">
                                                            {donor.isAnonymous ? "Anonymous Donor" : donor.fullName}
                                                        </h3>
                                                        <div className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                                                            {donor.showAmount ? formatAmount(donor.amount) : "Hidden"}
                                                        </div>

                                                        {/* Campaign */}
                                                        {/* {donor.campaign && (
                                                            <Badge variant="secondary" className="mb-3 text-xs bg-primary/10 text-primary border-0">
                                                                {donor.campaign}
                                                            </Badge>
                                                        )} */}

                                                        {/* Message */}
                                                        {donor.message && (
                                                            <p className="text-sm text-muted-foreground italic line-clamp-2 mb-3 px-2">
                                                                "{donor.message}"
                                                            </p>
                                                        )}

                                                        {/* Date */}
                                                        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5 w-fit mx-auto">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(donor.donationDate).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric"
                                                            })}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>

                        {filteredDonors.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <div className="w-24 h-24 mx-auto mb-6 bg-white/60 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg border border-primary/20">
                                    <Search className="w-10 h-10 text-primary/50" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-3">No donors found</h3>
                                <p className="text-muted-foreground text-lg">Try adjusting your search or filters</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
                className="px-4 pb-20 mt-20"
            >
                <motion.div
                    className="max-w-4xl mx-auto text-center     bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F]  rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
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
                            <Crown className="w-12 h-12 mx-auto text-white mb-4" />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl sm:text-3xl font-extrabold text-white mb-4"
                        >
                            Join Our Wall of Champions
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-white/90 mb-8 max-w-xl mx-auto"
                        >
                            Your name could be here too! Every donation makes a difference in the lives of underprivileged children.
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
                                href={appendUTMToUrl("/donation#donate")}
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
                                Make a Donation
                            </Link>

                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>

        </div>
    );
};

export default DonorWall;