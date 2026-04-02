import { Flower2, Theater, Users, Heart, TreePine } from "lucide-react";

export default function AlternatingCardsLayout() {
  const cards = [
    {
      icon: Flower2,
      title: "Spiritual Education",
      items: ["Yoga & Meditation", "Prayers", "Philosophy"]
    },
    {
      icon: Theater,
      title: "Arts",
      items: ["Singing", "Dancing", "Music Instruments"]
    },
    {
      icon: Users,
      title: "Leadership",
      items: ["Public Speaking", "Event Management", "Financial Management"]
    },
    {
      icon: Heart,
      title: "Health & Hygiene",
      items: ["Healthcare", "Basic Hygiene", "Cleanliness"]
    },
    {
      icon: TreePine,
      title: "Base",
      items: ["Kitchen Gardening", "Promoting Horticulture", "Waste Management"]
    }
  ];

  return (
    <div className="bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          const isOdd = (index + 1) % 2 === 1; // Card 1, 3, 5 are odd
          
          return (
            <div key={index} className={`flex ${isOdd ? 'justify-start' : 'justify-end'}`}>
              <div className="relative p-4 bg-[#EDF2F7] shadow-lg rounded-xl transform transition-transform duration-300 hover:scale-105 w-64">
                <div className="absolute -top-3 left-3 bg-orange-200 p-2 rounded-full">
                  <IconComponent className="text-lg text-orange-700" />
                </div>
                <h2 className="text-md font-semibold text-blue-900 mt-4 mb-3">
                  {card.title}
                </h2>
                <ul className="text-gray-600 text-sm space-y-2">
                  {card.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}