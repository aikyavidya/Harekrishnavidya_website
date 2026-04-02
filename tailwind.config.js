// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       keyframes: {
//         shimmer: {
//           "0%": { backgroundPosition: "0% 50%" },
//           "100%": { backgroundPosition: "100% 50%" },
//         },
//         "fade-in": {
//           "0%": { opacity: "0", transform: "translateY(12px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//       },
//       animation: {
//         shimmer: "shimmer 3s ease-in-out infinite",
//         "fade-in": "fade-in 0.6s ease-out forwards",
//       },
//     },
//   },
//   plugins: [],
// };

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#FF6B00", // your main brand color
//         accent: "#FACC15", // your highlight / secondary color
//       },
//     },
//   },
//   plugins: [],
// };
// // tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       colors: {
//         primary: "#FB7C21", // example primary color
//         accent: "#FFD700", // optional accent
//         background: "#FBF7F5",
//         foreground: "#1F2937",
//         muted: "#64748B",
//       },
//     },
//   },
// };
/** 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F96D2F",
        accent: "#FFD700",
        background: "#FBF7F5",
        foreground: "#1F2937",
        muted: "#64748B",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
