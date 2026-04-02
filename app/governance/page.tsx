"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import picc from "../../public/images/picc.png";
import pii from "../../public/images/pii.png";
import p2 from "../../public/images/p2.png";
import ca from "../../public/images/ca.png";
import ca2 from "../../public/images/ca2.png";
import pr from "../../public/images/pr.png";
import kir from "../../public/images/kir.png";
import kir2 from "../../public/images/kir2.png";
import kir3 from "../../public/images/kir3.png";
import kir4 from "../../public/images/kir4.png";
import sai from "../../public/images/sai.png";
import mani from "../../public/images/mani.png";
import ravi from "../../public/images/ravi.png";
import pi2 from "../../public/images/pi2.png";
import underline from "../../public/images/Underline_06.png";
import progress_indicator from "../../public/images/Progress Indicator.png";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1a1a1a] overflow-x-hidden">
      <div className="max-w-5xl mx-auto py-8 md:py-8 px-4">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12"
        >
          <motion.h2
            variants={item}
            className="text-center text-2xl md:text-3xl font-semibold text-[#d34736] mb-1"
          >
            Our Trustees & <span className="text-orange-400">Leadership</span>
          </motion.h2>
          <motion.div variants={item} className="flex justify-center mb-4 md:mb-6">
            <Image
              src={underline}
              alt="decoration img"
              width={80}
              className="text-center mb-6 md:mb-10 md:w-[100px]"
            />
          </motion.div>
        </motion.div>

        {/* Board of Trustees Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.p
            variants={item}
            className="text-center text-xl md:text-2xl mb-1 text-orange-400 italic"
          >
            Board of Trustees
          </motion.p>
          <motion.div
            variants={item}
            className="flex justify-center mb-4 md:mb-6"
          >
            <Image
              src={progress_indicator}
              alt="decoration img"
              width={180}
              className="text-center md:w-[240px]"
            />
          </motion.div>
        </motion.div>

        {/* First Board Member */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row items-center justify-center min-h-screen md:h-screen bg-white text-black py-8 md:py-0"
        >
          {/* Image Section */}
          <motion.div
            variants={slideInFromLeft}
            className="flex flex-col items-center flex-1 mb-6 md:mb-0"
          >
            <div className="relative mb-4">
              <Image
                src={picc}
                alt="HG Chanchalapathi Dasa"
                width={280}
                height={280}
                className="rounded-2xl md:w-[428px] md:h-[428px]"
                style={{
                  position: "relative",
                  top: "0px",
                  left: "0px",
                }}
              />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-center">
              HG Chanchalapathi Dasa
            </h3>
            <p className="text-base md:text-lg text-center">
              Vice- Chairman Akshyapatra
            </p>
          </motion.div>

          {/* Text Section */}
          <motion.div
            variants={slideInFromRight}
            className="flex-1 p-4 md:p-10"
          >
            <p className="text-sm md:text-base leading-relaxed text-justify md:text-left">
              Chanchalapathi Dasa has been working in the field of spiritual
              education since 1984 and social development since 2000. He pursued
              his Bachelor&apos;s Degree in PSG College of Technology,
              Coimbatore, where he came in touch with ISKCON and Srila
              Prabhupada&apos;s mission. Later, he joined the Indian Institute
              of Science, Bengaluru, to pursue his Masters in Electrical
              Communication Engineering. He has combined the spirit of
              compassion with his education in technology and applied it to
              social development. He is currently involved in strategy, planning
              and governance of Akshaya Patra.
            </p>
          </motion.div>
        </motion.div>

        {/* Second Board Member */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col-reverse md:flex-row items-center bg-white text-black p-4 md:p-12 gap-6 md:gap-8"
        >
          {/* Left Section: Text Content */}
          <motion.div variants={slideInFromLeft} className="flex-1">
            <p className="text-sm md:text-base leading-relaxed text-justify md:text-left">
              Amitasana Dasa is the President of HARE KRISHNA MOVEMENT INDIA, Mumbai
              and Governing Council Member of HARE KRISHNA MOVEMENT INDIA, India. He
              is also the President of Akshaya Patra operations in Maharashtra.
              Under his leadership, the Foundation has implemented several
              development initiatives in the region. Born in 1969 in Namrup,
              Assam, India, HG completed B. Tech. in Computer Science from REC
              Kurukshetra. He later worked in Kirloskar Computer Services,
              Bangalore and joined ISKCON Bangalore in 1992. He has organized
              seminars, workshops and counselling programs to benefit students
              and professionals from all over the country. He has guided
              hundreds of people, especially youth, to lead a life of happiness
              and fulfilment.
            </p>
          </motion.div>

          {/* Right Section: Image and Name */}
          <motion.div
            variants={slideInFromRight}
            className="flex flex-col items-center flex-1 mb-4 md:mb-0"
          >
            <Image
              src={pii}
              alt="HG Amitasana Dasa"
              width={280}
              height={280}
              className="rounded-lg max-w-full h-auto mb-4 md:w-[300px] md:h-[300px]"
            />
            <h3 className="text-lg md:text-2xl font-bold text-center">
              HG Amitasana Dasa
            </h3>
            <p className="text-base md:text-lg text-center">
              President, HARE KRISHNA MOVEMENT INDIA-Mumbai
            </p>
          </motion.div>
        </motion.div>

        {/* Leadership Team Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16"
        >
          <motion.h3
            variants={item}
            className="text-xl font-semibold mt-12 md:mt-16 text-center text-orange-400"
          >
            Leadership Team
          </motion.h3>
          <motion.div
            variants={item}
            className="flex justify-center mb-4 md:mb-6"
          >
            <Image
              src={progress_indicator}
              alt="decoration img"
              width={150}
              className="text-center md:w-[200px]"
            />
          </motion.div>
        </motion.div>

        {/* First Leadership Member */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row items-center bg-gray-100 text-gray-800 p-4 md:p-12 rounded-lg mb-6 md:mb-0"
        >
          {/* Left Section: Image and Name */}
          <motion.div
            variants={slideInFromLeft}
            className="flex flex-col items-center flex-1 mb-6 md:mb-0 md:pr-8"
          >
            <Image
              src={pi2}
              alt="HG Satya Gaura Chandra Dasa"
              width={280}
              height={280}
              className="rounded-lg max-w-full h-auto mb-4 md:w-[300px] md:h-[300px]"
            />
            <h3 className="text-lg md:text-2xl font-bold text-orange-600 text-center">
              HG Satya Gaura Chandra Dasa
            </h3>
            <p className="text-sm md:text-lg text-center">
              President, HARE KRISHNA MOVEMENT INDIA - Hyderabad <br />
              Regional President, The Akshaya Patra Foundation <br />
              Telangana & Andhra Pradesh
            </p>
          </motion.div>

          {/* Right Section: Text Content */}
          <motion.div variants={slideInFromRight} className="flex-1">
            <p className="text-sm md:text-base leading-relaxed text-justify md:text-center">
              HG Satya Gaura Chandra Dasa is a Gold Medalist in B.Tech
              Mechanical at Jawaharlal Nehru Technological University –
              Kakinada. He eventually did his M.Tech from IIT-Chennai and worked
              in a multinational IT firm in Bengaluru for a couple of years
              before deciding to dedicate his life to serving humanity. The
              first Akshaya Patra kitchen in unified Andhra Pradesh (now
              Telangana) was set up in Hyderabad in 2008 under his leadership.
              He also oversaw the setting up of the Foundation&apos;s high-tech
              mega kitchen in Kandi, Telangana, in association with the Infosys
              Foundation in 2018. Currently, he is serving as the President for
              Akshaya Patra Andhra Pradesh and Telangana. HG is also serving as
              the President of AIKYA VIDYA.
            </p>
          </motion.div>
        </motion.div>

        {/* Second Leadership Member */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row items-center bg-gray-100 text-gray-800 p-4 md:p-10 rounded-lg mt-8 md:mt-16 max-w-4xl mx-auto"
        >
          {/* Left Section: Image and Name */}
          <motion.div
            variants={slideInFromLeft}
            className="flex flex-col items-center flex-1 mb-6 md:mb-0 md:pr-8"
          >
            <Image
              src={p2}
              alt="HG Sahadeva Sakha Dasa"
              width={280}
              height={280}
              className="rounded-lg max-w-full h-auto mb-4 md:w-[300px] md:h-[300px]"
            />
            <h3 className="text-lg md:text-2xl font-bold text-orange-600 text-center">
              HG Sahadeva Sakha Dasa
            </h3>
            <p className="text-sm md:text-lg text-center">
              Director, AIKYA VIDYA
            </p>
          </motion.div>

          {/* Right Section: Text Content */}
          <motion.div variants={slideInFromRight} className="flex-1">
            <p className="text-sm md:text-base leading-relaxed text-justify md:text-center">
              HG is currently serving as Director of the AIKYA Vidya. Sahadeva
              Saka Dasa is also the Associate Vice President of Hare Krishna
              Movement Hyderabad&apos;s state youth outreach. He pursued M.Tech
              degree from NIT Calicut and Worked in Wipro Software Company
              before joining the movement. HG has been rendering his dedicated
              services to movement from past 12 years. Swamiji is well versed
              in conducting training programs for the youth in the aspect
              of PERSONALITY DEVELOPMENT based on Bhagavad-Gita and trained
              students from reputed colleges like IIT Hyderabad, JNTU
              University, BITS Hyderabad etc. He is also the most
              sought-after speaker in reputed software professionals
              from Microsoft, Google, Qualcom, Deloitte, TCS, Infosys etc.
            </p>
          </motion.div>
        </motion.div>

        {/* Officers Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-8 md:mt-12 mb-6 md:mb-10"
        >
          <motion.div
            variants={item}
            className="text-center bg-gray-50 p-4 rounded-lg md:bg-transparent md:p-0"
          >
            <Image
              src={ca2}
              alt="Charan Raj Krishna Dasa"
              width={120}
              height={120}
              className="mx-auto rounded mb-3 md:w-[150px] md:h-[150px]"
            />
            <p className="font-semibold mt-2 md:mt-4 text-lg">
              Chaitanya Krishna Dasa
            </p>
            <p className="text-sm text-orange-600 font-medium">
              Chief Education Officer
            </p>
            <p className="text-xs md:text-sm mt-2 text-justify md:text-center px-2 md:px-0">
              Chaitanya Krishna Dasa is currently serving as the CEdO of AIKYA
              Vidya. He Completed his B.Tech Mechanical Engineering from JNTU,
              Kakinada and worked in PSUs, Railways, and India Post
              (Accounting). He has been serving the HARE KRISHNA MOVEMENT INDIA and
              ISKCON (Vrindavan and Delhi temples) from the past 11 years. He is
              also serving as the main editor of Bhakti Vedanta Book Trust one
              of the world&apos;s largest publisher of classic Vaishnava texts and
              contemporary works on the philosophy, theology, and culture of
              bhakti-yoga. He is also one of the largest social media
              influencers in India spreading the knowledge of the Bhagavad Gita
              through his digital media company JivJago media.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="text-center bg-gray-50 p-4 rounded-lg md:bg-transparent md:p-0"
          >
            <Image
              src={ca}
              alt="Tapasvi Chaitanya Dasa"
              width={120}
              height={120}
              className="mx-auto rounded mb-3 md:w-[150px] md:h-[150px]"
            />
            <p className="font-semibold mt-2 md:mt-4 text-lg">
              Tejasvi Chaitanya Dasa
            </p>
            <p className="text-sm text-orange-600 font-medium">
              Chief Operations Officer
            </p>
            <p className="text-xs md:text-sm mt-2 text-justify md:text-center px-2 md:px-0">
              Chaitanya Krishna Dasa is currently serving as the CEdO of AIKYA
              Vidya. He Completed his B.Tech Mechanical Engineering from JNTU,
              Kakinada and worked in PSUs, Railways, and India Post
              (Accounting). He has been serving the HARE KRISHNA MOVEMENT INDIA and
              ISKCON (Vrindavan and Delhi temples) from the past 11 years. He is
              also serving as the main editor of Bhakti Vedanta Book Trust one
              of the world&apos;s largest publisher of classic Vaishnava texts and
              contemporary works on the philosophy, theology, and culture of
              bhakti-yoga. He is also one of the largest social media
              influencers in India spreading the knowledge of the Bhagavad Gita
              through his digital media company JivJago media.
            </p>
          </motion.div>
        </motion.div>

        {/* Communication Officer */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={fadeIn}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-lg shadow-lg"
        >
          {/* Profile Image */}
          <motion.div
            variants={item}
            className="flex justify-center mb-6 md:mb-16"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-orange-100">
              <Image
                src={pr}
                alt="Raghavendra"
                width={96}
                height={96}
                className="w-full h-full object-cover md:w-[128px] md:h-[128px]"
              />
            </div>
          </motion.div>

          {/* Name */}
          <motion.div variants={item} className="text-center mb-2">
            <h1 className="text-xl md:text-2xl font-semibold text-orange-500">
              Raghavendra
            </h1>
          </motion.div>

          {/* Title */}
          <motion.div variants={item} className="text-center mb-6 md:mb-8">
            <p className="text-gray-600 text-sm font-medium">
              Chief Sustainability and Communications Officer
            </p>
          </motion.div>

          {/* Bio Content */}
          <motion.div
            variants={container}
            className="space-y-3 md:space-y-4 text-gray-700 text-xs md:text-sm leading-relaxed"
          >
            <motion.p variants={item} className="text-justify">
              Raghavendra is currently serving as the CSCO of AIKYA VIDYA. He is
              an Ex-Political and Policy Consultant and Ex-Civil Services
              mentor. In a span of his 10 years career in government sector he
              contributed to many policy reforms in media in the spheres of
              education and governance.
            </motion.p>

            <motion.p variants={item} className="text-justify">
              Earlier he worked for reputed think tanks like Centre for Civil
              Society and Foundation for Democratic Reforms contributing towards
              Governance Reforms and National Education Policy.
            </motion.p>

            <motion.p variants={item} className="text-justify">
              He has published more than 60 articles for various reputed
              magazines like Swarajya, the Pulse and Telugu news dailies like
              Andhra Jyothi and Velugu.
            </motion.p>

            <motion.p variants={item} className="text-justify">
              He has done his Masters in Governance from MIT school of
              Government and was awarded a certificate in Rule of Law by
              International Academy of Leadership Germany.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Management Team */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16"
        >
          <motion.h3
            variants={item}
            className="text-xl font-semibold mt-12 md:mt-16 text-center text-orange-400"
          >
            Management Team
          </motion.h3>
          <motion.div
            variants={item}
            className="flex justify-center mb-4 md:mb-6"
          >
            <Image
              src={progress_indicator}
              alt="decoration img"
              width={220}
              className="text-center md:w-[300px]"
            />
          </motion.div>
        </motion.div>

        {/* Management Team Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-12 max-w-7xl mx-auto lg:mb-24"
        >
          {/* Card 1 */}
          <motion.div
            variants={item}
            className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-lg md:bg-transparent md:p-0 space-y-3"
          >
            <Image
              src={kir}
              alt="Rasa Mandal Dasa"
              width={140}
              height={140}
              className="rounded-full object-cover md:w-[160px] md:h-[160px]"
            />
            <h3 className="text-base md:text-lg font-semibold text-orange-500">
              Rasa Mandal Dasa
            </h3>
            <p className="text-xs md:text-sm text-gray-700 text-justify">
              He is currently serving as the Senior Manager Outreach of AIKYA
              Vidya. He is a B.Pharmacy graduate from Vignan University Vizag.
              Before joining AIKYA Vidya, he worked in Healthcare industry.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={item}
            className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-lg md:bg-transparent md:p-0 space-y-3"
          >
            <Image
              src={kir2}
              alt="Kumaraswamy"
              width={140}
              height={140}
              className="rounded-full object-cover md:w-[160px] md:h-[160px]"
            />
            <h3 className="text-base md:text-lg font-semibold text-orange-500">
              Kumaraswamy
            </h3>
            <p className="text-xs md:text-sm text-gray-700 text-justify">
              He is currently serving as Senior Manager Youth outreach programme
              of the AIKYA Vidya. He has done his MA in Sanskrit and diploma in
              Kathak dance. He participated 3 times in International Kick Boxing
              championship and won silver medal once. Before joining AIKYA Vidya
              he worked with various reputed NGOs in different capacities.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={item}
            className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-lg md:bg-transparent md:p-0 space-y-3"
          >
            <Image
              src={kir3}
              alt="Brahmanandam"
              width={140}
              height={140}
              className="rounded-full object-cover md:w-[160px] md:h-[160px]"
            />
            <h3 className="text-base md:text-lg font-semibold text-orange-500">
              Brahmanandam
            </h3>
            <p className="text-xs md:text-sm text-gray-700 text-justify">
              He is currently serving as Senior Manager Village Outreach. Before
              joining AIKYA Vidya, Brahmanandam served in various reputed NGOs
              in different capacities.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            variants={item}
            className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-lg md:bg-transparent md:p-0 space-y-3"
          >
            <Image
              src={kir4}
              alt="G. Karthik"
              width={140}
              height={140}
              className="rounded-full object-cover md:w-[160px] md:h-[160px]"
            />
            <h3 className="text-base md:text-lg font-semibold text-orange-500">
              G. Karthik
            </h3>
            <p className="text-xs md:text-sm text-gray-700 text-justify">
              He is currently serving as the Manager Outreach in AIKYA Vidya. He
              is a Mechanical Engineer by education and previously worked in
              reputed pharmaceutical and software companies.
            </p>
          </motion.div>
        </motion.div>

        {/* Executive Assistants */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="flex lg:grid sm:grid-cols-3 lg:gap-2 md:gap-4 mt-8 text-center"
        >
          <motion.div
            variants={item}
            className="bg-gray-50 p-1 lg:p-4 rounded-lg md:bg-transparent md:p-0"
          >
            <Image
              src={ravi}
              alt="Ravi"
              width={80}
              height={80}
              className="mx-auto rounded-full mb-2 md:w-[100px] md:h-[100px]"
            />
            <p className="font-semibold mt-2 text-sm md:text-base text-orange-400">
              Ravi
            </p>
            <p className="text-xs md:text-sm text-gray-600">
              Executive Assistant Youth Outreach{" "}
            </p>
          </motion.div>
          <motion.div
            variants={item}
            className="bg-gray-50 lg:p-4 rounded-lg md:bg-transparent md:p-0"
          >
            <Image
              src={sai}
              alt="Sai Pawan"
              width={80}
              height={80}
              className="mx-auto rounded-full mb-2 md:w-[100px] md:h-[100px]"
            />
            <p className="font-semibold mt-2 text-sm md:text-base text-orange-400">
              Sai Pawan
            </p>
            <p className="text-xs md:text-sm text-gray-600">
              Executive Assistant Operations
            </p>
          </motion.div>
          <motion.div
            variants={item}
            className="bg-gray-50 lg:p-4 rounded-lg md:bg-transparent md:p-0"
          >
            <Image
              src={mani}
              alt="Mani Teja"
              width={80}
              height={80}
              className="mx-auto rounded-full mb-2 md:w-[100px] md:h-[100px]"
            />
            <p className="font-semibold mt-2 text-sm md:text-base text-orange-400">
              Mani Teja
            </p>
            <p className="text-xs md:text-sm text-gray-600">
              Executive Assistant Donor Care
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}