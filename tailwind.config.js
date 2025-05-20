module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  plugins: [],
  theme: {
    extend: {
      animation: {
        slide: "scroll-left 30s linear infinite",
      },
      keyframes: {
        "scroll-left": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  animation: {
    slide: "scroll-left 40s linear infinite",
  },
  keyframes: {
    "scroll-left": {
      "0%": { transform: "translateX(100%)" },
      "100%": { transform: "translateX(-100%)" },
    },
  },
};
