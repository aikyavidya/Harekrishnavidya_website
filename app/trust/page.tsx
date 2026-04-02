"use client";

import Image from "next/image";
import { useState } from "react";
import { StaticImageData } from "next/image";
import im from "../../public/images/im.png";
import imggg from "../../public/images/imggg.png";
import logo from "../../public/images/logo.png";
import divider from "../../public/images/Divider.png";
import mid from "../../public/images/mid.jpg";
import mid2 from "../../public/images/mid2.jpg";
import mid3 from "../../public/images/mid3.jpg";
import mid4 from "../../public/images/mid4.jpg";
import ch from "../../public/images/ch.jpg";
import ch2 from "../../public/images/ch2.jpg";
import ch3 from "../../public/images/ch3.jpg";
import ch4 from "../../public/images/ch4.jpg";

export default function Page() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpen = (key: string) => setActiveModal(key);
  const handleClose = () => setActiveModal(null);

  return (
    <div className="bg-white text-[#1a1a1a]">
      <main className="px-6 md:px-20 py-12">
        <h1 className="text-4xl font-bold text-center text-orange-600 mb-6">
          Our Associated Trusts
        </h1>

        {/* Section 1 */}
        <section className="mb-10">
          <Image src={im} alt="Akshaya Patra Foundation" width={180} height={50} />
          <p className="mt-4 text-sm leading-6">
            Hunger shall not be the obstacle stopping children from receiving education and working towards a bright future! We at the Akshaya Patra Foundation, through our efforts to implement the Mid-Day Meal Programme (PM-POSHAN), strive to construct a healthy, nutritious and bright future for every child in this country. With a vision that no child in India should be deprived of education because of hunger, our non-profit organisation has relentlessly worked towards implementing the Mid-Day Meal Programme (PM-POSHAN) in about 19,039 schools (government and government-aided) across the country. With a reach spanning over 67 locations across 15 States and 2 Union Territories, we at the Akshaya Patra Foundation strive towards feeding the primary and upper-primary children with a minimum of 450 and 700 calories respectively on a daily basis. Having achieved the milestone of feeding about 18,00,907 children every day, our non-profit organisation has the distinction of being one of the biggest NGOs in India that implements the Mid-Day Meal Programme (PM-POSHAN) in schools. Our efforts have been significantly bolstered by numerous charity donations, government grants and donations from selfless philanthropists who aim to make this world a better place. We, at the Akshaya Patra Foundation have been carrying out numerous NGO works including feeding children from socio-economically challenged sections, feeding lactating mothers, providing food assistance during times of disasters and primarily, driving away malnutrition from the face of India for over 22 years now. With a goal to bring in 3 million children under our wings and provide them with nutritious meals under the mid-day meal programme by 2025, our nonprofit organisation is open to collaborations and charity donations to realise our goals.
          </p>
          <div className="p-2 mt-2">
            <button
              onClick={() => handleOpen("trust1")}
              className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:scale-105 transition-transform duration-700 cursor-pointer"
            >
              Learn More
            </button>
            {activeModal === "trust1" && (
              <Modal
                onClose={handleClose}
                images={[mid, mid2, mid3, mid4]}
              />
            )}
          </div>
        </section>

        <Divider />

        {/* Section 2 */}
        <section className="mb-10">
          <Image
            src={imggg}
            alt="Hare Krishna Charities"
            width={180}
            height={50}
          />
          <p className="mt-4 text-sm leading-6">
            Hare Krishna Charities began its humble journey of providing free and subsidized meals as a means to address the hunger of the underprivileged, who are barely able to afford even a square meal daily. As the saying goes “A journey of a thousand miles begins with a single step”, a humble beginning has led Hare Krishna Charities to serving over 11 Crore meals since its inception. We continuously rise the bar for ourselves and We endeavor to realize our mission to feed more than 250000 meals a day by 2025, with the continued support from all our stakeholders and well-wishers. With 4 Hi-Tech Kitchens (Warangal, Narsingi-Hyderabad, Mahbubnagar and Srikakulam) across Telangana and Andhra Pradesh, we ensure that hot and nutritious meals reach the needy who await a square meal of the day and and give them a ray of hope of fulfilment. Our Technology enabled kitchens have the capacity to cook meals ranging from 20,000 to 50,000 per day. All our kitchens endeavor to utilize the latest technology to continuously improve the quality and nutrition levels of the meals and to implement environment friendly cooking by reducing the wastages.
          </p>
          <div className="p-2 mt-2">
            <button
              onClick={() => handleOpen("trust2")}
              className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:scale-105 transition-transform duration-700 cursor-pointer"
            >
              Learn More
            </button>
            {activeModal === "trust2" && (
              <Modal
                onClose={handleClose}
                images={[ch2, ch, ch3, ch4]}
              />
            )}
          </div>
        </section>

        <Divider />

        {/* Section 3 */}
        <section className="mb-10">
          <Image
            src={logo}
            alt="HARE KRISHNA MOVEMENT INDIA"
            width={180}
            height={50}
          />
          <p className="mt-4 text-sm leading-6">
            The HARE KRISHNA MOVEMENT INDIA (HKM) was brought to the whole world in this modern age by His Divine Grace. A.C. Bhaktivedanta Swami Prabhupada (in short addressed as “Srila Prabhupada”). Srila Prabhupada is the Founder-Acarya of the worldwide HARE KRISHNA MOVEMENT INDIA and is the current link to Almighty Lord Sri Krishna. By his powerful devotion to his Spiritual master, Srila Bhakti Siddhantha Sarasvati Thakur, and Lord Sri Krishna, he attracted the attention of Sri Chaitanya Mahaprabhu to spread His mission all over the planet delivering innumerable souls to the perfectional stage of life. This site is a humble offering to Srila Prabhupada who is our eternal spiritual master and shelter & to Lord Sri Krishna, the original attraction of everyone. May this endeavor please our eternal master for the benefit of hungry seeking souls who are trying to find something permanent, steady, satisfying & blissful in this world of impermanence, misery & dualities. Om Tat Sat.
          </p>
          <div className="p-2 mt-2">
            <button
              onClick={() => handleOpen("trust3")}
              className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:scale-105 transition-transform duration-700 cursor-pointer"
            >
              Learn More
            </button>
            {activeModal === "trust3" && (
              <Modal
                onClose={handleClose}
                images={[logo, mid, ch, ch2]}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// Reusable Modal Component
function Modal({ onClose, images }: { onClose: () => void; images: StaticImageData[] }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl font-bold hover:scale-125 transition-transform"
      >
        &times;
      </button>
      <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 rounded-lg shadow-lg transform scale-90 animate-zoomIn transition-all duration-300">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative w-40 h-40 sm:w-52 sm:h-52 overflow-hidden group"
          >
            <Image
              src={src}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Divider Component
function Divider() {
  return (
    <div className="w-full h-4 relative -mt-4">
      <Image
        src={divider}
        alt="Divider"
        fill
        className="object-contain"
      />
    </div>
  );
}
