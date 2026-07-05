
"use client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../components/LanguageProvider";

const Donationkit = () => {
  const { t } = useLanguage();
  type Pack = {
    _id?: string;
    title: string;
    price: number;
    total: number;
    quantity: number;
    img: string;
    description: string;
    included: string[];
    highlight: string;
    slug?: string;
  };

  type ApiTestimonial = {
    _id?: string;
    fullName?: string;
    testimonialText?: string;
    rating?: number;
    date?: string;
    location?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type TestimonialCard = {
    name: string;
    role: string;
    text: string;
    img: string;
  };

  const avatarDataUri = (name: string) => {
    const initials = (name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="100%" height="100%" rx="48" fill="#FF7F2A"/><text x="50%" y="54%" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#FFFFFF" font-weight="700">${initials || "U"}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const localizedFallbackTestimonials: TestimonialCard[] = [
    {
      name: t("donationKit.testimonials.priyaName"),
      role: t("donationKit.testimonials.priyaRole"),
      text: t("donationKit.testimonials.priyaQuote"),
      img: avatarDataUri(t("donationKit.testimonials.priyaName")),
    },
    {
      name: t("donationKit.testimonials.rajeshName"),
      role: t("donationKit.testimonials.rajeshRole"),
      text: t("donationKit.testimonials.rajeshQuote"),
      img: avatarDataUri(t("donationKit.testimonials.rajeshName")),
    },
    {
      name: t("donationKit.testimonials.anitaName"),
      role: t("donationKit.testimonials.anitaRole"),
      text: t("donationKit.testimonials.anitaQuote"),
      img: avatarDataUri(t("donationKit.testimonials.anitaName")),
    },
    {
      name: t("donationKit.testimonials.vikramName"),
      role: t("donationKit.testimonials.vikramRole"),
      text: t("donationKit.testimonials.vikramQuote"),
      img: avatarDataUri(t("donationKit.testimonials.vikramName")),
    },
  ];
  const [isGuidanceDialogOpen, setIsGuidanceDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [packsError, setPacksError] = useState<string | null>(null);
  const validatePhone = (value: string) => {
    const phoneRegex = /^[6-9]\d{9}$/; // 10 digits, starts 6–9
    if (!phoneRegex.test(value)) {
      setPhoneError(t("donationKit.validation.invalidPhone"));
    } else {
      setPhoneError("");
    }
  };

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [testimonials, setTestimonials] =
    useState<TestimonialCard[]>(localizedFallbackTestimonials);

  // Guidance form state
  const [guidanceName, setGuidanceName] = useState("");
  const [guidanceEmail, setGuidanceEmail] = useState("");
  const [guidanceCity, setGuidanceCity] = useState("");
  const [guidanceQuestion, setGuidanceQuestion] = useState("");
  const [guidanceLoading, setGuidanceLoading] = useState(false);
  const [guidanceError, setGuidanceError] = useState<string | null>(null);
  const [guidanceSuccess, setGuidanceSuccess] = useState<string | null>(null);

  // Fetch donation kits from API
  useEffect(() => {
    const loadDonationKits = async () => {
      try {
        setLoading(true);
        setPacksError(null);
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.harekrishnavidya.org";

        const normalizeImageUrl = (rawUrl: string, baseUrl: string): string => {
          const trimmed = (rawUrl || "").trim();
          if (!trimmed) return trimmed;
          if (/^data:/i.test(trimmed)) return trimmed;

          let baseOrigin = baseUrl;
          let baseHost: string | null = null;
          let baseProtocol: string | null = null;
          try {
            const base = new URL(baseUrl);
            baseOrigin = base.origin;
            baseHost = base.hostname;
            baseProtocol = base.protocol;
          } catch {
            // keep baseUrl as-is if it's not a valid URL
          }

          // If stored as absolute localhost URL (often from local dashboard uploads),
          // rewrite to current API base origin so it works on live.
          if (/^https?:\/\//i.test(trimmed)) {
            try {
              const u = new URL(trimmed);
              if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
                return `${baseOrigin}${u.pathname}${u.search}`;
              }
              // Fix mixed-content / protocol mismatch (e.g. http image on https site)
              if (baseHost && baseProtocol && u.hostname === baseHost && u.protocol !== baseProtocol) {
                return `${baseOrigin}${u.pathname}${u.search}`;
              }
              return trimmed;
            } catch {
              return trimmed;
            }
          }

          // Relative path -> make it absolute from API origin
          const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
          // Prefer /api/uploads so it works behind proxies forwarding only /api/*
          const normalizedPath = path.startsWith("/uploads/") ? `/api${path}` : path;
          return `${baseOrigin}${normalizedPath}`;
        };
        const res = await fetch(`${API_BASE_URL}/api/donation-kits?active=true`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(t("donationKit.failedToFetch"));
        }

        const data = await res.json();

        // Transform backend data to match frontend Pack structure
        if (data.success && data.data && data.data.length > 0) {
          const transformedPacks = data.data.map((kit: { _id?: string; title: string; price: number; quantity?: number; img: string; description: string; included?: string[]; highlight: string; slug?: string }) => ({
            _id: kit._id,
            title: kit.title,
            price: kit.price,
            quantity: kit.quantity || 1,
            total: kit.price * (kit.quantity || 1),
            img: normalizeImageUrl(kit.img, API_BASE_URL),
            description: kit.description,
            included: kit.included || [],
            highlight: kit.highlight,
            slug: kit.slug,
          }));
          setPacks(transformedPacks);
        } else {
          // No kits in dashboard/API
          setPacks([]);
        }
      } catch (error) {
        console.error("Error loading donation kits:", error);
        setPacks([]);
        setPacksError(t("donationKit.unableToLoad"));
      } finally {
        setLoading(false);
      }
    };

    loadDonationKits();
  }, []);

  // Fetch testimonials from CMS API (fallback to staticTestimonials)
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://api.harekrishnavidya.org";

        const res = await fetch(`${API_BASE_URL}/api/testimonials`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = (await res.json()) as unknown;
        const list = Array.isArray(data) ? (data as ApiTestimonial[]) : [];

        const mapped: TestimonialCard[] = list
          .map((tItem, idx) => {
            const name = (tItem?.fullName || "").trim() || t("donationKit.testimonials.donorPrefix") + (idx + 1);
            const text = (tItem?.testimonialText || "").trim();
            const role = (tItem?.location || "").trim() || t("donationKit.testimonials.donorRoleDefault");

            return {
              name,
              role,
              text,
              img: avatarDataUri(name),
            };
          })
          .filter((tItem) => tItem.text.length > 0);

        setTestimonials(mapped.length > 0 ? mapped : localizedFallbackTestimonials);
      } catch (error) {
        console.error("Error loading testimonials:", error);
        setTestimonials(localizedFallbackTestimonials);
      }
    };

    loadTestimonials();
  }, []);

  const increment = (index: number): void => {
    setPacks((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            quantity: item.quantity + 1,
            total: item.price * (item.quantity + 1),
          }
          : item
      )
    );
  };

  // Decrease Quantity
  const decrement = (index: number): void => {
    setPacks((prev) =>
      prev.map((item, i) =>
        i === index && item.quantity > 1
          ? {
            ...item,
            quantity: item.quantity - 1,
            total: item.price * (item.quantity - 1),
          }
          : item
      )
    );
  };

  const localizedFeatures = [
    {
      title: t("donationKit.features.directImpact.title"),
      description: t("donationKit.features.directImpact.desc"),
      icon: <span className="text-5xl">🎯</span>,
      bg: "bg-gradient-to-r from-orange-400 to-orange-600",
    },

    {
      title: t("donationKit.features.communitySupport.title"),
      description: t("donationKit.features.communitySupport.desc"),
      icon: <span className="text-5xl">👥</span>,
      bg: "bg-gradient-to-r from-orange-400 to-orange-600",
    },

    {
      title: t("donationKit.features.transformLives.title"),
      description: t("donationKit.features.transformLives.desc"),
      icon: <span className="text-5xl">✓</span>,
      bg: "bg-gradient-to-r from-orange-400 to-orange-600",
    },

    {
      title: t("donationKit.features.transparency.title"),
      description: t("donationKit.features.transparency.desc"),
      icon: <span className="text-5xl">📈</span>,
      bg: "bg-gradient-to-r from-orange-400 to-orange-600",
    },
  ];

  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-warm-bg via-background to-primary/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-6 md:py-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-white shadow-lg rounded-full border-2 border-primary/20">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary" />
                <p className="text-primary text-xs sm:text-sm font-bold uppercase tracking-wide">{t("donationKit.hero.badge")}</p>
              </div>
              <h1 className="text-3xl text-[#32241B] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 text-foreground leading-[1.1]">
                {t("donationKit.hero.headingPart1")}
                <span className="block mt-1 sm:mt-2">
                  <span className="text-gradient bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] bg-clip-text text-transparent">
                    {t("donationKit.hero.headingPart2")}
                  </span>
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-10 leading-relaxed max-w-xl">
                {t("donationKit.hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                <Link href="/donation-kit/general-support">
                  <div
                    className="h-11 sm:h-12
                              px-5 sm:px-7
                              flex items-center justify-center
                              text-sm sm:text-base
                              font-semibold
                              bg-gradient-to-r from-orange-600 to-orange-600
                              hover:from-orange-700 hover:to-red-700
                              text-white
                              rounded-lg
                              shadow-lg
                              transition-all
                              hover:scale-105
                              cursor-pointer
                              whitespace-nowrap"
                  // onMouseEnter={() => setHovered(true)}
                  // onMouseLeave={() => setHovered(false)}
                  >
                    {t("donationKit.hero.donateNowButton")}
                    {/* <Heart
                      className={`w-5 h-5 transition-colors duration-300 ${hovered ? "fill-white text-white" : "fill-transparent text-white"
                        }`}
                    /> */}
                  </div>
                </Link>

                <div
                  className=" h-11 sm:h-12
                              px-5 sm:px-7
                              flex items-center justify-center
                              text-sm sm:text-base
                              font-semibold
                              border-2 border-orange-600
                              text-orange-600
                              rounded-lg
                              hover:bg-orange-50
                              transition-all
                              hover:scale-105
                              cursor-pointer
                              whitespace-nowrap">
                  {t("donationKit.hero.learnMoreButton")}
                </div>

              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-6 border-t-2 border-border">
                <div>
                  <div className="text-2xl sm:text-4xl font-extrabold text-primary mb-0.5 sm:mb-1">{t("donationKit.hero.studentsCount")}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">{t("donationKit.hero.studentsEmpowered")}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-4xl font-extrabold text-primary mb-0.5 sm:mb-1">{t("donationKit.hero.villagesCount")}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">{t("donationKit.hero.villagesReached")}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-4xl font-extrabold text-primary mb-0.5 sm:mb-1">{t("donationKit.hero.dailySupportCount")}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">{t("donationKit.hero.dailySupport")}</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-fade-in hidden lg:block" style={{ animationDelay: '200ms' }}>
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>

                {/* Main Image */}
                <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt={t("donationKit.hero.alt.childrenLearning")}
                    width={1000}
                    height={500}
                    className="w-full h-[500px] object-cover rounded-lg"
                  />

                  {/* Floating Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-primary/10 animate-slide-up">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white fill-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold text-foreground">{t("donationKit.hero.studentsCount")}</div>
                        <div className="text-sm text-muted-foreground font-medium">{t("donationKit.hero.childrenEmpowered")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
      {/* Why Donate With Us? */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center bg-white border border-orange-200 rounded-full px-8 py-4 mb-4 text-orange-600 font-semibold text-sm shadow-sm">
            <span className="text-xl mr-2">💝</span>
            {t("donationKit.why.badge").replace("💝 ", "")}
          </div>

          <h2 className="text-[56px] text-[#2D1B0F] sl font-extrabold mb-4 text-gray-900">
            {t("donationKit.why.heading")}
          </h2>
          <p className="text-[#847062] text-base sm:text-lg">
            {t("donationKit.why.descPart1")}<br />
            {t("donationKit.why.descPart2")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-7xl mx-auto">
          {localizedFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-10 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className={`flex-shrink-0 w-20 h-20 rounded-lg flex items-center justify-center ${feature.bg}`}
              >
                {feature.icon}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

      </section>
      {/* The best way */}
      <section className=" py-12 px-4 sm:py-20">

        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl bg-gradient-to-br from-[#FF7F2A] to-[#F1872B] 
      shadow-2xl p-10 sm:p-16 text-center text-white">

            <div className="flex justify-center ">
              <span className="text-6xl opacity-80 leading-none">“</span>
            </div>

            <p className="text-2xl sm:text-4xl font-semibold leading-snug">
              &quot;{t("donationKit.quote.text")}&quot;
            </p>

            <div className="mt-8 flex flex-col items-center">
              <div className="h-[2px] w-20 bg-white/60 mb-3"></div>
              <p className="text-lg font-medium tracking-wide">{t("donationKit.quote.author")}</p>
            </div>
          </div>
        </div>
      </section>
      {/* Shape Young Minds for a Better India */}
      <section className="py-16 sm:py-20 px-3 sm:px-6 
    bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] 
    relative overflow-hidden">

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djRoOHYtNGgtOHptLTQgNHY0aDR2LTRoLTR6bTAgMGgtNHY0aDR2LTR6bTAgMHYtNGg0di00aC00djR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t("donationKit.shapeMinds.heading")}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t("donationKit.shapeMinds.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg font-semibold shadow-lg bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/donation-kit/general-support">{t("donationKit.shapeMinds.becomeMonthlyDonor")}</Link>
              {/* Become a Monthly Donor */}
            </Button>
            <Button size="lg" variant="outline" className="text-lg font-semibold bg-white/10 text-white border-2 border-white hover:bg-white hover:text-primary">
              {t("donationKit.shapeMinds.volunteerWithUs")}
            </Button>
          </div>
        </div>
      </section>
      {/* Donation Kits Section */}
      <section className="relative py-20 sm:py-28 px-4 bg-gradient-to-br from-orange-50/50 via-background to-red-50/30 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251, 146, 60, 0.4) 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm shadow-2xl rounded-full border-2 border-primary/20 animate-fade-in">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary animate-pulse" />
              <p className="text-primary text-sm sm:text-base font-bold uppercase tracking-wider">{t("donationKit.listing.badge")}</p>
            </div>

            <h2 className="text-4xl text-[#2D1B0F] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 sm:mb-8 text-foreground leading-[1.1] animate-fade-in" style={{ animationDelay: '100ms' }}>
              {t("donationKit.listing.headingPart1")}
              <span className="block mt-2 sm:mt-3">
                <span className="text-gradient bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] bg-clip-text text-transparent">

                  {t("donationKit.listing.headingPart2")}
                </span>
              </span>
            </h2>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {t("donationKit.listing.description")}
            </p>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="h-1 w-12 sm:w-20 bg-gradient-to-r from-transparent via-primary to-primary rounded-full"></div>
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <div className="h-1 w-12 sm:w-20 bg-gradient-to-r from-primary via-primary to-transparent rounded-full"></div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Cards Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">{t("donationKit.loading")}</p>
              </div>
            ) : packsError ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">{packsError}</p>
              </div>
            ) : packs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">{t("donationKit.noKitsAvailable")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {packs.map((pack, i) => (
                  <div
                    key={pack._id || i}
                    className="bg-white rounded-lg border-2 border-primary/40 shadow-lg overflow-hidden border"
                  >
                    {/* Image */}
                    <div className="relative h-52 w-full">
                      <img src={pack.img} className="w-full h-full object-cover" alt="pack" />
                      <span className="absolute top-4 left-4 bg-primary text-white font-extrabold text-sm px-8 py-4 rounded-full shadow">
                        ₹{pack.price}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col gap-4">
                      <h3 className="text-3xl text-[#2D1B0F] font-extrabold hover:text-primary">{pack.title}</h3>

                      <p className="text-[#847062] text-base leading-relaxed">{pack.description}</p>

                      {/* Included Items */}
                      <div className="border-2 border-primary/40 rounded-lg p-4 bg-primary/5">
                        <p className="font-semibold mb-2">{t("donationKit.listing.whatsIncluded")}</p>
                        <ul className="text-sm text-[#847062] space-y-3">
                          {pack.included.map((item, idx) => (
                            <li key={idx}>
                              <span className="text-primary">•</span> {item}
                            </li>
                          ))}
                        </ul>
                        <button className="text-primary text-sm font-semibold mt-2">{t("donationKit.listing.viewAll")}</button>
                      </div>

                      {/* Highlight */}
                      <div className="border-2 border-primary/40 rounded-lg p-5 flex items-start gap-3 bg-primary/5">
                        <span className="text-black-600 text-lg">✔</span>
                        <p className="text-black-700 text-sm font-bold">{pack.highlight}</p>
                      </div>

                      {/* Quantity Section */}
                      <div className="border-2 rounded-lg p-4 bg-white">
                        <p className="text-sm font-bold mb-2">{t("donationKit.listing.numberOfPacks")}</p>

                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => decrement(i)}
                            className="w-8 h-8 rounded-full  border-2 border-primary flex items-center justify-center text-lg"
                          >
                            <span className="text-primary">-</span>
                          </button>

                          <span className="text-orange-600 text-xl font-bold">{pack.quantity}</span>
                          <button
                            onClick={() => increment(i)}
                            className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-lg"
                          >
                            <span className="text-primary">+</span>
                          </button>
                        </div>

                        {/* Total */}
                        <p className="mt-3 font-semibold text-gray-800">{t("donationKit.listing.totalPrefix")}<span className="text-primary font-extrabold">₹{pack.total}</span></p>
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center gap-4 mt-2">
                        <Link
                          href={`/donation-kit/${pack.slug || pack.title.toLowerCase().replace(/\s+/g, '-')}?quantity=${pack.quantity}&total=${pack.total}`}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg shadow text-center"
                        >
                          {t("donationKit.listing.donateNowButton")}
                        </Link>
                        <Link
                          href={`/donation-kit/${pack.slug || pack.title.toLowerCase().replace(/\s+/g, '-')}?quantity=${pack.quantity}&total=${pack.total}`}
                          className="flex-1 border border-orange-500 text-orange-600 font-semibold py-2 rounded-lg hover:bg-orange-50 text-center"
                        >
                          {t("donationKit.listing.detailsButton")}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Bottom Call to Action */}
          <div className="mt-16 sm:mt-20 text-center animate-fade-in" style={{ animationDelay: '700ms' }}>
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-6 sm:px-10 py-5 sm:py-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm rounded-lg sm:rounded-lg border-2 border-primary/20 shadow-xl">
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-xl font-bold text-foreground mb-1">
                  {t("donationKit.guidance.bannerHeading")}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t("donationKit.guidance.bannerDescription")}
                </p>
              </div>
              <div
                className="whitespace-nowrap text-white p-3 cursor-pointer text-sm font-bold rounded-lg bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => setIsGuidanceDialogOpen(true)}
              >
                {t("donationKit.guidance.getGuidanceButton")}
              </div>

            </div>
          </div>
        </div>
        {isGuidanceDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white w-[85%] max-w-[350px] rounded-xl shadow-xl p-3 relative animate-fade-in">

              {/* Close */}
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xs"
                onClick={() => setIsGuidanceDialogOpen(false)}
              >
                ✕
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-1">
                <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full">
                  <span className="text-orange-500 text-base">❤️</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-base font-bold text-center leading-tight mb-1">
                {t("donationKit.guidance.dialogHeading")}
              </h2>

              <p className="text-center text-gray-600 text-[11px] mb-3 leading-tight">
                {t("donationKit.guidance.dialogDescription")}
              </p>

              {/* Form */}
              <form
                className="space-y-2.5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setGuidanceError(null);
                  setGuidanceSuccess(null);

                  // Basic front-end validation
                  if (!guidanceName || !guidanceEmail || !phone || !guidanceCity) {
                    setGuidanceError(t("donationKit.validation.fillRequiredFields"));
                    return;
                  }
                  if (phoneError) {
                    setGuidanceError(t("donationKit.validation.validPhoneRequired"));
                    return;
                  }

                  try {
                    setGuidanceLoading(true);
                    // Prefer explicit env override; otherwise use production API
                    const API_BASE_URL =
                      process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.harekrishnavidya.org";

                    const res = await fetch(`${API_BASE_URL}/api/guidance`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: guidanceName,
                        email: guidanceEmail,
                        phone,
                        city: guidanceCity,
                        question: guidanceQuestion,
                      }),
                    });

                    const result = await res.json();

                    if (!res.ok || !result.success) {
                      setGuidanceError(
                        result?.error || t("donationKit.validation.somethingWentWrong")
                      );
                      return;
                    }

                    setGuidanceSuccess(
                      result?.message ||
                      t("donationKit.validation.thankYou")
                    );

                    // Reset fields
                    setGuidanceName("");
                    setGuidanceEmail("");
                    setGuidanceCity("");
                    setGuidanceQuestion("");
                    setPhone("");
                    setPhoneError("");
                  } catch (error) {
                    console.error("Error submitting guidance form:", error);
                    setGuidanceError(t("donationKit.validation.somethingWentWrong"));
                  } finally {
                    setGuidanceLoading(false);
                  }
                }}
              >

                <div>
                  <label className="text-[10px] font-semibold">{t("donationKit.guidance.fullNameLabel")}</label>
                  <input
                    type="text"
                    placeholder={t("donationKit.guidance.fullNamePlaceholder")}
                    value={guidanceName}
                    onChange={(e) => setGuidanceName(e.target.value)}
                    className="w-full mt-1 p-1.5 border rounded-lg text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold">{t("donationKit.guidance.emailLabel")}</label>
                  <input
                    type="email"
                    placeholder={t("donationKit.guidance.emailPlaceholder")}
                    value={guidanceEmail}
                    onChange={(e) => setGuidanceEmail(e.target.value)}
                    className="w-full mt-1 p-1.5 border rounded-lg text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold">{t("donationKit.guidance.phoneLabel")}</label>

                  <input
                    type="text"
                    placeholder={t("donationKit.guidance.phonePlaceholder")}
                    value={phone}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // remove non-digits

                      if (value.length > 10) value = value.slice(0, 10); // limit to 10 digits

                      setPhone(value);
                      validatePhone(value);
                    }}
                    maxLength={10} // extra safety
                    className={`w-full mt-1 p-1.5 border rounded-lg text-[11px] ${phoneError ? "border-red-500" : ""
                      }`}
                  />

                  {phoneError && (
                    <p className="text-[9px] text-red-500 mt-0.5">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-semibold">{t("donationKit.guidance.cityLabel")}</label>
                  <input
                    type="text"
                    placeholder={t("donationKit.guidance.cityPlaceholder")}
                    value={guidanceCity}
                    onChange={(e) => setGuidanceCity(e.target.value)}
                    className="w-full mt-1 p-1.5 border rounded-lg text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold">
                    {t("donationKit.guidance.questionLabel")}
                  </label>
                  <textarea
                    rows={1}
                    placeholder={t("donationKit.guidance.questionPlaceholder")}
                    value={guidanceQuestion}
                    onChange={(e) => setGuidanceQuestion(e.target.value)}
                    className="w-full mt-1 p-1.5 border rounded-lg text-[11px] resize-none"
                  />
                </div>

                <p className="text-[9px] bg-orange-50 text-orange-600 p-1.5 rounded-lg leading-tight">
                  {t("donationKit.guidance.responseNote")}
                </p>

                {guidanceError && (
                  <p className="text-[9px] text-red-500 mt-0.5">{guidanceError}</p>
                )}
                {guidanceSuccess && (
                  <p className="text-[9px] text-green-600 mt-0.5">
                    {guidanceSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={guidanceLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-1.5 rounded-lg text-xs font-semibold shadow-md"
                >
                  {guidanceLoading ? t("donationKit.guidance.submitting") : t("donationKit.guidance.submit")}
                </button>
              </form>
            </div>
          </div>
        )}

      </section>
      {/* What They Are Talking About Us */}
      <section className="py-16 bg-[#FBF8F5]">
        {/* Title */}
        <div className="text-center mb-12 px-4">
          <h2 className="text-4xl md:text-5xl font-black text-[#32241B]">
            {t("donationKit.testimonials.heading")}
          </h2>
          <p className="text-[#847062] mt-3 text-base md:text-sm">
            {t("donationKit.testimonials.description")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white border-2 border-primary/40 rounded-lg p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all"
            >
              {/* Profile */}
              <div className="flex items-center gap-3">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={48}
                  height={48}
                  unoptimized
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="leading-tight">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 text-sm leading-snug italic">
                “{item.text}”
              </p>

              {/* Quote Icon */}
              <div className="text-right text-orange-300 text-lg font-bold -mt-1">
                ”
              </div>
            </div>
          ))}
        </div>

      </section>
      {/* Building Futures with */}
      <section className="relative py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-accent/5 to-background overflow-hidden">

        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-16 -left-24 w-56 h-56 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-16 -right-24 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-float delay-200"></div>
          <div className="absolute inset-1/2 w-72 h-72 sm:w-[28rem] sm:h-[28rem] -translate-x-1/2 -translate-y-1/2 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff6b35'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E')",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-5 px-5 py-2.5 bg-white shadow-md rounded-full border border-primary/20">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary" />
              <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide">
                {t("donationKit.impact.badge")}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#2D1B0F]">
              {t("donationKit.impact.headingPart1")}
              <span className="block bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] bg-clip-text text-transparent">
                {t("donationKit.impact.headingPart2")}
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("donationKit.impact.description")}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              { number: t("donationKit.impact.stat1Value"), label: t("donationKit.impact.stat1Label"), icon: "📚", gradient: "from-orange-500 to-red-500" },
              { number: t("donationKit.impact.stat2Value"), label: t("donationKit.impact.stat2Label"), icon: "🌍", gradient: "from-blue-500 to-cyan-500" },
              { number: t("donationKit.impact.stat3Value"), label: t("donationKit.impact.stat3Label"), icon: "👨‍🏫", gradient: "from-purple-500 to-pink-500" },
              { number: t("donationKit.impact.stat4Value"), label: t("donationKit.impact.stat4Label"), icon: "⏰", gradient: "from-rose-500 to-pink-500" }
            ].map((stat, index) => (
              <div key={index} className="group relative hover:scale-105 transition-transform duration-300">
                <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-white text-center">

                  {/* Icon */}
                  <div className="relative mb-5 flex justify-center">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-md`}>
                      {stat.icon}
                    </div>
                  </div>

                  {/* Number */}
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">
                    {stat.number}
                  </div>

                  {/* Label */}
                  <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>

                  {/* Accent Line */}
                  <div className={`mt-4 h-1 w-16 mx-auto bg-gradient-to-r ${stat.gradient} rounded-full group-hover:w-full transition-all duration-300`} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-14 sm:mt-20">
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6">
              {t("donationKit.impact.footerText")}
            </p>

            <Link href="/donation-kit/general-support">
              <button
                className="
      inline-flex items-center gap-2
      h-11 sm:h-12
      px-4 sm:px-5
      rounded-lg
      bg-primary
      text-white
      font-semibold
      text-sm sm:text-base
      shadow-lg
      transition-all duration-300
      hover:scale-105
      border-2 border-primary
      whitespace-nowrap
    "
              >
                {t("donationKit.impact.startButton")}
                <Heart className="w-4 h-4 fill-white" />
              </button>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Donationkit;
