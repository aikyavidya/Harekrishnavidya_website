
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp } from "lucide-react";

interface CampaignerCampaign {
  id: string;
  fundraiserName: string;
  fundraiserImage: string;
  story: string;
  targetAmount: number;
  raisedAmount: number;
  supporters: number;
  category: string;
  campaignImage: string;
  location: string;
}

const CampaignerCampaigns = () => {
  const [campaigns, setCampaigns] = useState<CampaignerCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "https://api.harekrishnavidya.org/api/campaigner-campaigns",
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
              "Pragma": "no-cache"
            }
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Failed to fetch campaigns:", res.status, errorData);
          throw new Error(errorData.message || "Failed to fetch campaigns");
        }

        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
        setError(err instanceof Error ? err.message : "Failed to fetch campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-orange-50/30">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
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
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-primary text-sm sm:text-base font-bold uppercase tracking-wider">Personal Fundraisers</p>
            </div>

            <h1 className="text-5xl text-[#2D1B0F] sm:text-7xl md:text-8xl font-extrabold mb-8 text-foreground leading-[1.05] animate-fade-in tracking-tight" style={{ animationDelay: '100ms' }}>
              Support a
              <span className="block mt-3">
                <span className="text-gradient bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] bg-clip-text text-transparent">
                  Campaigner&apos;s Mission
                </span>
              </span>
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-fade-in font-medium" style={{ animationDelay: '200ms' }}>
              Individuals making a difference in their communities. <span className="text-primary font-semibold">Support their personal initiatives</span> and help them reach their goals.
            </p>
          </div>
        </div>
      </section>

      {/* Campaigner Campaigns Grid */}
      <section className="py-12 sm:py-16 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {campaigns.map((campaign, index) => (
              <Card
                key={`${campaign.id}-${index}`}
                className="group hover:shadow-[0_20px_60px_-15px_rgba(251,146,60,0.3)] transition-all duration-500 hover:-translate-y-2 border-2 border-primary/30 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Campaign Image */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 mix-blend-multiply z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Image
                    src={campaign.campaignImage}
                    alt={campaign.story}
                    width={400}
                    height={224}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20"></div>

                  <Badge className="absolute top-4 left-4 z-30 bg-gradient-to-r from-primary to-accent text-white font-bold px-4 py-1.5 shadow-lg">
                    {campaign.category}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  {/* Fundraiser Profile */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-border">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-50"></div>
                      <Image
                        src={campaign.fundraiserImage}
                        alt={campaign.fundraiserName}
                        width={56}
                        height={56}
                        className="relative w-14 h-14 rounded-full object-cover border-4 border-background shadow-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-extrabold text-foreground text-lg leading-tight">{campaign.fundraiserName}</h3>
                      <p className="text-xs text-muted-foreground font-medium">📍 {campaign.location}</p>
                    </div>
                  </div>

                  {/* Story */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed font-medium">
                    {campaign.story}
                  </p>

                  {/* Progress */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-primary">
                          ₹{(campaign.raisedAmount / 1000).toFixed(0)}K raised
                        </span>
                        <span className="font-semibold text-muted-foreground">
                          of ₹{(campaign.targetAmount / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <Progress value={calculateProgress(campaign.raisedAmount, campaign.targetAmount)} className="h-2.5" />
                      <div className="text-xs text-muted-foreground mt-1.5 font-medium">
                        {calculateProgress(campaign.raisedAmount, campaign.targetAmount).toFixed(0)}% funded • {campaign.supporters} supporters
                      </div>
                    </div>

                    <Button
                      className="w-full bg-primary text-white  transition-all duration-300 h-11 font-extrabold group-hover:scale-[1.02]"
                      asChild
                    >
                      <Link href={`/support-compaign?id=${campaign.id}`} className="w-full">
                        Support Campaign
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}<section className="py-16 sm:py-20 px-3 sm:px-6 
    bg-gradient-to-b from-[#FF7F2A] to-[#F96D2F] 
    relative overflow-hidden">

        <div className="absolute i">
          <div className="absolute inset-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        </div>
        <div className="absolute top-10 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-6 animate-bounce">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Start Your Own Campaign
          </h2>
          <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Have a cause close to your heart? Create your personal fundraising campaign and rally support from your community.
          </p>
          <div
            className="
    h-11 sm:h-12
    px-4 sm:px-5
    inline-flex items-center justify-center
    text-sm sm:text-base
    font-semibold
    bg-white
    text-primary
    rounded-lg
    shadow-lg
    transition-all duration-300
    hover:scale-105
    hover:bg-white/95
    cursor-pointer
    whitespace-nowrap
    w-fit
  "
          >
            <Link href="/donation-kit/general-support">
              Get Started Today
            </Link>
          </div>


        </div>
      </section>
    </div>
  );
};

export default CampaignerCampaigns;
