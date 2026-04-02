"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  goalAmount: number;
  raisedAmount: number;
  category: string;
  deadline: string;
  supporters: number;
  featured: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.harekrishnavidya.org";

const getBackendApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};



const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(
          getBackendApiUrl("/api/campaign-management"),
          { cache: "no-store" }
        );

        const response = await res.json();

        // Map backend data structure to frontend Campaign interface
        if (response.success && response.data) {
          const mappedCampaigns: Campaign[] = response.data.map((campaign: any) => ({
            id: campaign._id,
            title: campaign.basicInfo?.title || '',
            description: campaign.basicInfo?.shortDescription || campaign.basicInfo?.subtitle || '',
            image: campaign.basicInfo?.coverImage || 'https://via.placeholder.com/400x300?text=No+Image',
            goalAmount: campaign.funds?.targetAmount || 0,
            raisedAmount: campaign.funds?.raisedAmount || 0,
            category: campaign.basicInfo?.category || 'General',
            deadline: campaign.basicInfo?.deadline || new Date().toISOString(),
            supporters: campaign.donorWall?.recentDonors?.length || 0,
            featured: campaign.basicInfo?.isFeatured || false,
          }));
          setCampaigns(mappedCampaigns);
        }
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);


  const calculateProgress = (raised: number, goal: number) =>
    Math.min((raised / goal) * 100, 100);

  const calculateDaysLeft = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  };

  const featuredCampaigns = campaigns.filter(c => c.featured);
  const otherCampaigns = campaigns.filter(c => !c.featured);


  if (loading) return <p className="text-center mt-10">Loading campaigns...</p>;
  if (!campaigns.length)
    return <p className="text-center mt-10">No campaigns found</p>;


  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.08) 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }}></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-3 mb-8 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-xl shadow-2xl rounded-full border-2 border-primary/30 animate-fade-in hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-primary text-sm sm:text-base font-bold uppercase tracking-wider">Live Campaigns</p>
            </div>

            <h1 className="text-5xl text-[#2D1B0F]  sm:text-7xl md:text-8xl font-extrabold mb-8 text-foreground leading-[1.05] animate-fade-in tracking-tight" style={{ animationDelay: '100ms' }}>
              Donate to a
              <span className="block mt-3">
                <span className="text-gradient bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] bg-clip-text text-transparent">
                  Specific Cause
                </span>
              </span>
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-[#847062]  max-w-4xl mx-auto leading-relaxed animate-fade-in font-medium" style={{ animationDelay: '200ms' }}>
              Support focused initiatives that create <span className="text-primary font-semibold">measurable impact</span>. Track progress in real-time and see exactly how your contribution <br /> helps.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-12 sm:py-16 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* ---------- Featured ---------- */}
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B0F]">
              Featured Campaigns
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {featuredCampaigns.map(campaign => (
              <Card
                key={campaign.id}
                className="group hover:shadow-lg transition-all duration-500 hover:-translate-y-2 border-2 border-primary/30 overflow-hidden"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    width={400}
                    height={288}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute top-5 left-5 flex gap-2">
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white font-bold px-4 py-1.5">
                      {campaign.category}
                    </Badge>
                    <Badge className="bg-yellow-400 text-black font-bold px-3 py-1.5 animate-pulse">
                      ⭐ Featured
                    </Badge>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white text-2xl font-bold">
                            {calculateProgress(
                              campaign.raisedAmount,
                              campaign.goalAmount
                            ).toFixed(0)}
                            %
                          </div>
                          <div className="text-white/80 text-xs">Funded</div>
                        </div>
                      </div>
                      <Progress
                        value={calculateProgress(
                          campaign.raisedAmount,
                          campaign.goalAmount
                        )}
                        className="h-2 bg-white/20"
                      />
                    </div>
                  </div>
                </div>

                <CardContent className="p-7">
                  <h3 className="text-2xl font-extrabold text-[#2D1B0F] mb-3">
                    {campaign.title}
                  </h3>

                  <p className="text-sm text-[#847062] mb-5 line-clamp-2">
                    {campaign.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl p-4 border-2 border-primary/40">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary mb-1" />
                        <span className="text-sm text-[#847062]">Supporters:</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {campaign.supporters}
                      </div>
                    </div>
                    <div className="rounded-xl p-4 border-2 border-primary/40">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary mb-1" />
                        <span className="text-sm text-[#847062]">Days Left:</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {calculateDaysLeft(campaign.deadline)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-primary">
                        ₹{(campaign.raisedAmount / 100000).toFixed(2)}L raised
                      </span>

                      <span className="font-semibold text-[#847062]">
                        of ₹{(campaign.goalAmount / 100000).toFixed(2)}L
                      </span>
                    </div>
                  </div>

                  <Link href={`/build-school?id=${campaign.id}`}>
                    <div className="w-full h-12 mt-4 text-white bg-gradient-to-br from-[#F96D2F] to-[#F1872B] rounded-xl flex items-center justify-center font-bold cursor-pointer">
                      View Campaign & Donate
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ---------- Other Campaigns ---------- */}
          {otherCampaigns.length > 0 && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B0F]">
                  More Campaigns
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherCampaigns.map(campaign => (

                  <Card
                    key={campaign.id}
                    className="group hover:shadow-lg transition-all duration-500 hover:-translate-y-2 border-2 border-border overflow-hidden"
                  >
                    {/* IMAGE + PROGRESS */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={campaign.image}
                        alt={campaign.title}
                        width={400}
                        height={224}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-3 py-1.5">
                        {campaign.category}
                      </Badge>

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/20">
                          <Progress
                            value={calculateProgress(
                              campaign.raisedAmount,
                              campaign.goalAmount
                            )}
                            className="h-1.5 bg-white/30 mb-2"
                          />

                          <div className="flex justify-between text-white text-xs">
                            <span className="font-bold">
                              {calculateProgress(
                                campaign.raisedAmount,
                                campaign.goalAmount
                              ).toFixed(0)}
                              % funded
                            </span>

                            <span className="font-semibold">
                              {calculateDaysLeft(campaign.deadline)} days left
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary">
                        {campaign.title}
                      </h3>

                      {/* <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {campaign.description}
                      </p> */}

                      {/* STATS */}
                      <div className="flex justify-between mb-4">
                        <div className="border-2 border-primary/40 p-2 rounded-xl">
                          <div className="text-xs text-muted-foreground">Raised</div>
                          <div className="font-bold text-primary ">
                            ₹{((campaign.raisedAmount || 0) / 100000).toFixed(1)}L
                          </div>
                        </div>

                        <div className="border-2 border-primary/40 p-2 rounded-xl">
                          <div className="text-xs text-muted-foreground">Supporters</div>
                          <div className="font-bold">{campaign.supporters}</div>
                        </div>
                      </div>

                      <Link href={`/build-school?id=${campaign.id}`}>
                        <div className="w-full h-11 bg-primary text-white rounded-xl flex items-center justify-center font-bold">
                          View Campaign
                        </div>
                      </Link>
                    </CardContent>
                  </Card>

                ))}
              </div>
            </>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-3 sm:px-6 
    bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] 
    relative overflow-hidden">

        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        </div>
        <div className="absolute top-10 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-6 animate-bounce">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Can&apos;t Find Your Cause?
          </h2>
          <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Make a general donation to support our mission of reaching <span className="font-bold underline decoration-white/50">1000 villages by 2030</span>
          </p>
          <div className="flex justify-center">
            <Link href="/build-school">
              <div
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
                Donate a Grocery Kit Now
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Campaigns;
