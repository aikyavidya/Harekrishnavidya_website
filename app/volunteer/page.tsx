"use client";
import Image from "next/image";
import Link from "next/link"

import tulsi from "../../public/images/tulsi.png";
import join from "../../public/images/volunteerBG.jpg";
import community from "../../public/images/comuniity.png";
import wellness from "../../public/images/wellness.png";
import skill_development from "../../public/images/skill_development.png";
import network from "../../public/images/network.png";

export default function Home() {
  return (
    <main className="font-sans text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]">
        <section
          className="relative bg-cover bg-center text-white h-full w-full max-w-7xl mx-auto rounded-none sm:rounded-xl overflow-hidden"
          style={{ backgroundImage: `url(${join.src})` }}
        >
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black opacity-60 z-0" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 md:px-8 z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
              Join Our Mission
            </h1>
            <p className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl text-sm sm:text-base md:text-lg mb-6 md:mb-8 text-gray-200 leading-relaxed">
              Be part of a meaningful journey to create lasting change in our communities.
            </p>
            
            <Link href="https://forms.gle/2gjki8bMiBwaubzK7" target="_blank">
              <button className="bg-orange-500 hover:bg-orange-600  text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg text-sm sm:text-base md:text-lg font-medium cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Become a Volunteer
              </button>
            </Link>
          </div>
        </section>
      </section>

      {/* Mission Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 text-center px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Join Our Mission
          </h2>
          <p className="max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
            Our NGO is dedicated to making a positive impact through community
            services and education. Join us in our mission to create lasting
            change and empower individuals through volunteering.
          </p>
          
          <Link href="https://forms.gle/2gjki8bMiBwaubzK7" target="_blank">
            <button className="bg-orange-500 hover:bg-orange-600  text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg text-sm sm:text-base md:text-lg font-medium cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-6 sm:mb-8">
              Become a Volunteer
            </button>
          </Link>
          
          <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            <Image
              src={tulsi}
              alt="Mission"
              width={600}
              height={400}
              className="rounded-lg w-full h-auto shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Volunteer Benefits */}
      <section className="bg-gray-100 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 sm:mb-12 md:mb-16">
            Volunteer Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Benefit 1 */}
            <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-full sm:w-auto sm:flex-1">
                <h3 className="font-semibold text-lg sm:text-xl md:text-2xl mb-2">
                  Community Engagement
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                  Connect with local communities and make a meaningful difference in people&apos;s lives.
                </p>
                <Link href="https://forms.gle/2gjki8bMiBwaubzK7" target="_blank">
                  <button className="text-blue-900 border border-orange-300 rounded px-4 py-2 text-sm sm:text-base cursor-pointer hover:bg-orange-400 hover:text-white transition-all duration-300">
                    Learn more
                  </button>
                </Link>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                <Image
                  src={community}
                  alt="Community"
                  width={120}
                  height={120}
                  className="rounded-md w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover"
                />
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-full sm:w-auto sm:flex-1">
                <h3 className="font-semibold text-lg sm:text-xl md:text-2xl mb-2">
                  Skill Development
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                  Enhance your skills with hands-on experience and professional development opportunities.
                </p>
                <Link href="https://forms.gle/2gjki8bMiBwaubzK7" target="_blank">
                  <button className="text-blue-900 border border-orange-300 rounded px-4 py-2 text-sm sm:text-base cursor-pointer hover:bg-orange-400 hover:text-white transition-all duration-300">
                    See Workshops
                  </button>
                </Link>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                <Image
                  src={skill_development}
                  alt="Skills"
                  width={120}
                  height={120}
                  className="rounded-md w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover"
                />
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-full sm:w-auto sm:flex-1">
                <h3 className="font-semibold text-lg sm:text-xl md:text-2xl mb-2">
                  Networking
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                  Meet like-minded people and expand your professional and personal network.
                </p>
                <Link href="https://forms.gle/2gjki8bMiBwaubzK7" target="_blank">
                  <button className="text-blue-900 border border-orange-300 rounded px-4 py-2 text-sm sm:text-base cursor-pointer hover:bg-orange-400 hover:text-white transition-all duration-300">
                    Join Events
                  </button>
                </Link>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                <Image
                  src={network}
                  alt="Networking"
                  width={120}
                  height={120}
                  className="rounded-md w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover"
                />
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-full sm:w-auto sm:flex-1">
                <h3 className="font-semibold text-lg sm:text-xl md:text-2xl mb-2">
                  Wellness & Self-care
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                  Focus on self-care and improve your well-being through meaningful volunteer work.
                </p>
                <Link href="https://forms.gle/2gjki8bMiBwaubzK7" target="_blank">
                  <button className="text-blue-900 border border-orange-300 rounded px-4 py-2 text-sm sm:text-base cursor-pointer hover:bg-orange-400 hover:text-white transition-all duration-300">
                    Explore Tips
                  </button>
                </Link>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                <Image
                  src={wellness}
                  alt="Wellness"
                  width={120}
                  height={120}
                  className="rounded-md w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Opportunities */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 sm:mb-12 md:mb-16">
            Upcoming Volunteer Opportunities
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
              <h3 className="font-semibold text-lg sm:text-xl mb-2">
                Tree Planting Day
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-2">
                Date: November 15, 2023
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                Join us for a tree-planting event to enhance our local park&apos;s
                greenery and contribute to environmental sustainability.
              </p>
              <div className="mb-4">
                <Image
                  src="/images/plant.png"
                  alt="Tree Planting"
                  width={300}
                  height={180}
                  className="rounded-md w-full h-40 sm:h-48 object-cover"
                />
              </div>
              <Link href="https://forms.gle/2gjki8bMiBwaubzK7" target="_blank">
                <button className="w-full sm:w-auto text-black border border-orange-300 rounded-lg px-4 py-2 text-sm sm:text-base hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all duration-300 cursor-pointer">
                  Become a Volunteer
                </button>
              </Link>
            </div>

            {/* Card 2 */}
            <div className="border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
              <h3 className="font-semibold text-lg sm:text-xl mb-2">
                Beach Cleanup
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-2">
                Date: December 1, 2023
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                Help us clean up the beach and contribute to a cleaner ocean
                environment for marine life and future generations.
              </p>
              <div className="mb-4">
                <Image
                  src="/images/sea.png"
                  alt="Beach Cleanup"
                  width={300}
                  height={180}
                  className="rounded-md w-full h-40 sm:h-48 object-cover"
                />
              </div>
              <Link href="https://forms.gle/2gjki8bMiBwaubzK7" target="_blank">
                <button className="w-full sm:w-auto text-black border border-orange-300 rounded px-4 py-2 text-sm sm:text-base hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all duration-300 cursor-pointer">
                  Become a Volunteer
                </button>
              </Link>
            </div>

            {/* Card 3 */}
            <div className="border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white sm:col-span-2 lg:col-span-1">
              <h3 className="font-semibold text-lg sm:text-xl mb-2">
                Food Drive Support
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-2">
                Date: December 10, 2023
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                Support local families by assisting in our community food drive
                and help address food insecurity in our neighborhood.
              </p>
              <div className="mb-4">
                <Image
                  src="/images/box.png"
                  alt="Food Drive"
                  width={300}
                  height={180}
                  className="rounded-md w-full h-40 sm:h-48 object-cover"
                />
              </div>
              <Link href="https://forms.gle/2gjki8bMiBwaubzK7" target="_blank">
                <button className="w-full sm:w-auto text-black border border-orange-300 rounded px-4 py-2 text-sm sm:text-base hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all duration-300 cursor-pointer">
                  Become a Volunteer
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}