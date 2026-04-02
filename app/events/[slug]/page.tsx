// [slug] page of events 

import { notFound } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, Heart, Star } from "lucide-react";
import zulan from "../../../public/photosOfEvents/31.jpg";

import krishna from "../../../public/photosOfEvents/38.jpg";
import srila from "../../../public/photosOfEvents/41.jpg";
import radha_krishna from "../../../public/photosOfEvents/34.jpg";
import krish from "../../../public/photosOfEvents/42.jpg";

type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  slug: string;
  image: StaticImageData; 
};

const allEvents: Event[] = [
  {
    id: "1",
    title: "Jhulan Yatra Celebration",
    start: "2025-08-05",
    end: "2025-08-10",
    description:
      "A joyful week-long swing festival where the deities of Radha-Krishna are placed on a decorated swing and worshipped with devotion...",
    slug: "jhulan-yatra-2025",
    image: zulan,
  },
  {
    id: "2",
    title: "Radha Krishna Utsav 2025",
    start: "2025-08-07",
    end: "2025-08-13",
    description:
      "A vibrant festival full of bhajans, dance, drama, and spiritual discourses celebrating the divine love of Radha and Krishna...",
    slug: "radha-krishna-utsav-2025",
    image: radha_krishna,
  },
  {
    id: "3",
    title: "Sri Krishna Janmashtami Celebration",
    start: "2025-08-15",
    end: "2025-08-16",
    description:
      "Celebrate the divine appearance of Lord Sri Krishna with midnight darshan, kirtans, and abhishekam...",
    slug: "krishna-janmashtami-2025",
    image: krishna,
  },
  {
    id: "4",
    title: "Srila Prabhupada Appearance Day",
    start: "2025-08-17",
    end: "2025-08-17",
    description:
      "A day dedicated to glorifying the life and teachings of ISKCON founder Srila Prabhupada with offerings and kirtans...",
    slug: "prabhupada-appearance-day-2025",
    image: srila,
  },
  {
    id: "5",
    title: "Sri Radhashtami Celebration",
    start: "2025-08-31",
    end: "2025-08-31",
    description:
      "Celebrate the auspicious appearance of Srimati Radharani, the eternal consort of Lord Krishna, with special festivities and darshan...",
    slug: "radhashtami-2025",
    image: krish,
  },
];

// Updated interface for async params
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Made the function async and await params
export default async function EventDetailPage({ params }: PageProps) {
  // Await the params since it's now a Promise
  const { slug } = await params;
  
  const event = allEvents.find((e) => e.slug === slug);

  if (!event) return notFound();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDuration = () => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 1 ? "1 Day" : `${diffDays} Days`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Overlapping Design */}
      <div className="relative bg-blue-900 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-2xl"></div>
        </div>
        
        {/* Content Container */}
        <div className="relative container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              {/* Date Badge */}
              <div className="inline-flex items-center gap-3 bg-orange-500 px-6 py-3 rounded-full mb-8 shadow-lg">
                <Calendar className="w-5 h-5" />
                <span className="font-bold text-lg">
                  {formatDateShort(event.start)} – {formatDateShort(event.end)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                {event.title}
              </h1>

              {/* Description Preview */}
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                Join us in this divine celebration filled with devotion, spiritual bliss, and community gathering.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={600}
                  height={300}
                  className="w-full h-100  object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent"></div>
              </div>
              {/* Decorative Frame */}
              <div className="absolute inset-0 border-4 border-orange-500 rounded-3xl transform -rotate-3 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Cards - Floating Design */}
      <div className="relative -mt-16 z-20 container mx-auto px-6 mb-20">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Calendar, label: "Start Date", value: formatDate(event.start), color: "orange-500" },
            { icon: Calendar, label: "End Date", value: formatDate(event.end), color: "blue-900" },
            { icon: Clock, label: "Duration", value: getDuration(), color: "orange-500" },
            { icon: MapPin, label: "Location", value: "Hare Krishna Golden Temple, Hyderabad", color: "blue-900" },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-orange-500">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${item.color === 'orange-500' ? 'bg-orange-500' : 'bg-blue-900'}`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{item.label}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* About Section */}
            <div className="bg-white rounded-3xl p-10 shadow-xs border-l-8 border-orange-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800">About This Celebration</h2>
              </div>
              
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p className="text-2xl font-medium text-orange-500 first-letter:text-6xl first-letter:font-bold first-letter:text-blue-900 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                  {event.description}
                </p>
                <p className="text-lg">
                  Join us for this spiritually uplifting celebration at ISKCON. The event includes a variety of devotional activities like kirtans, dance, dramas, and spiritual talks. Witness beautifully adorned deities and participate in soul-touching bhajans.
                </p>
                <p className="text-lg">
                  Thousands of devotees gather during this festival to offer their devotion, take darshan, and immerse themselves in the glories of the Lord and His devotees.
                </p>
                <p className="text-lg">
                  Don&apos;t miss this opportunity to be part of a transcendental experience full of joy, devotion, and spiritual bliss.
                </p>
              </div>
            </div>

            {/* Activities Grid */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-10 text-white">
              <h3 className="text-3xl font-bold mb-8 text-center">Festival Activities</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Sacred Kirtans & Bhajans",
                  "Divine Darshan",
                  "Spiritual Discourses",
                  "Cultural Performances",
                  "Prasadam Distribution",
                  "Community Gathering",
                ].map((activity, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-orange-500/20 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-orange-500 flex-shrink-0" />
                      <span className="font-medium">{activity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info Card */}
            <div className="bg-orange-500 rounded-3xl p-8 text-white shadow-xs">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="w-8 h-8" />
                Quick Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Open for all devotees</div>
                    <div className="text-sm opacity-90">Everyone welcome</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Daily: 5:00 AM - 9:00 PM</div>
                    <div className="text-sm opacity-90">Temple timings</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Main Temple Hall</div>
                    <div className="text-sm opacity-90">Primary venue</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xs border-2 border-blue-900">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Need More Information?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Contact our temple office for detailed schedule and special arrangements.
              </p>
              <Link href='/contact' className="block">
                <button className="w-full bg-blue-900 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
                  Contact Us
                </button>
              </Link>
            </div>

            {/* Highlight Box */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-3xl p-8 text-white text-center shadow-xs">
              <div className="text-4xl mb-4">🙏</div>
              <h4 className="text-xl font-bold mb-2">Join the Divine Celebration</h4>
              <p className="opacity-90">Experience spiritual bliss and community devotion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add generateMetadata function if you want dynamic metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const event = allEvents.find((e) => e.slug === slug);
  
  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }
  
  return {
    title: `${event.title} | ISKCON Events`,
    description: event.description,
  };
}