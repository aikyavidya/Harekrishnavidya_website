"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image, { StaticImageData } from "next/image";
import { Calendar, Clock, Users } from "lucide-react";

import zulan from "../../public/photosOfEvents/29.jpg";
import krishna from "../../public/photosOfEvents/35.jpg";
import srila from "../../public/photosOfEvents/39.jpg";
import radha_krishna from "../../public/photosOfEvents/30.jpg";
import krish from "../../public/images/Radha_Syamasundar_Vrindavan_Radhastami_2004.jpg";

import Link from "next/link";

type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  slug: string;
  image: StaticImageData;
  imgWidth?: number;
  imgHeight?: number;
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
    imgWidth: 350,
    imgHeight: 300,
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
    imgWidth: 300,
    imgHeight: 100,
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
    imgWidth: 410,
    imgHeight: 330,
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
    imgWidth: 400,
    imgHeight: 330,
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
    imgWidth: 330,
    imgHeight: 200,
  },
];

const PAGE_SIZE = 4;

// Loading component for Suspense fallback
function EventsPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-orange-600 mt-4 text-xl">Loading events...</p>
      </div>
    </div>
  );
}

// Main events component that uses useSearchParams
function EventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const [pagedEvents, setPagedEvents] = useState<Event[]>([]);

  const totalPages = Math.ceil(allEvents.length / PAGE_SIZE);

  useEffect(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    setPagedEvents(allEvents.slice(startIndex, endIndex));
  }, [currentPage]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-300 to-blue-900 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
      <div className="absolute top-20 right-10 w-24 h-24 bg-gradient-to-br from-blue-900 to-orange-400 rounded-full opacity-15" />
      <div className="absolute bottom-20 left-10 w-20 h-20 bg-gradient-to-br from-orange-500 to-blue-900 rounded-full opacity-15" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <h1 className=" text-3xl lg:text-6xl font-bold  bg-clip-text text-orange-500 mb-4">
                Upcoming Events
              </h1>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
            </div>
            <p className="text-xl text-gray-700 mt-8 max-w-2xl mx-auto leading-relaxed">
              Join us in celebrating the divine festivals and spiritual
              gatherings that bring devotees together in devotion and joy
            </p>
          </div>

          {/* Events Grid */}
          <div className="space-y-8">
            {pagedEvents.map((event, index) => (
              <div
                key={event.id}
                className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-orange-200 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } flex flex-col lg:flex`}
              >
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 opacity-10 rounded-br-full" />
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-yellow-400 to-orange-500 opacity-10 rounded-tl-full" />

                {/* Image Section */}
                <div className="lg:w-2/5 relative overflow-hidden">
                  <div className="w-full h-[350px] relative ">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover rounded-xl p-4"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-3/5 p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <h2 className=" text-2xl lg:text-4xl font-bold text-gray-800 mb-4 hover:text-orange-500 transition-colors duration-300">
                      {event.title}
                    </h2>

                    {/* Date and details */}
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full">
                        <Calendar className="text-blue-900" size={18} />
                        <span className="text-blue-900 font-semibold">
                          {event.start === event.end
                            ? event.start
                            : `${event.start} - ${event.end}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full">
                        <Clock className="text-orange-500" size={18} />
                        <span className="text-orange-500 font-semibold">
                          Full Day
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 px-4 py-2 rounded-full">
                        <Users className="text-blue-900" size={18} />
                        <span className="text-blue-900 font-semibold">
                          All Welcome
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      {event.description}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4 ">
                    <Link href={`/events/${event.slug}`} className="flex-1 ">
                      <button className="w-fit bg-blue-900 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300  cursor-pointer">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination */}
          <div className="mt-16 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-xs p-6 border-2 border-orange-100">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 disabled:shadow-none cursor-pointer disabled:bg-gray-400"
                >
                  <span className="hidden ">← </span>Previous
                </button>

                <div className="flex items-center gap-3">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                          page === currentPage
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-110"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className=" px-6 py-3 bg-blue-900 text-white font-semibold rounded-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 disabled:shadow-none cursor-pointer disabled:bg-gray-400"
                >
                  Next <span className="hidden ">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Call to action section */}
          <div className=" hidden lg:mt-20 text-center bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-12 text-white shadow-xs">
            <h3 className="text-3xl font-bold mb-4">
              🙏 Join Our Spiritual Community
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Experience the joy of devotional service and connect with fellow
              devotees in our upcoming celebrations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="./contact">
                <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300 cursor-pointer">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function EventsPage() {
  return (
    <Suspense fallback={<EventsPageLoading />}>
      <EventsContent />
    </Suspense>
  );
}
