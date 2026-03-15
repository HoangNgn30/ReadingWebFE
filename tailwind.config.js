/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // primary: "#f5f6f2",
                primary: "#f8f6fb",
                secondary: "#1C4436",
                secondaryOne: "#66F369",
                bgColor: "#F6F6EE",
                bgColorOne: "#E6EADA",
                footer: "#060D1E",
                text1: "#505050",
                text2: "#666666",
                tertiary: "#272626",
                // tertiary: "#404040",
                gray: {
                    10: "#EEEEEE",
                    20: "#A2A2A2",
                    30: "#7B7B7B",
                    50: "#585858",
                    90: "#141414",
                },
            },
            fontFamily: {
                roboto: ['Roboto', 'sans-serif'],
                arial: ['Arial', 'sans-serif'],
                times: ['"Times New Roman"', 'serif'],
            },
        },
    },
    plugins: [require('@tailwindcss/line-clamp')],
};
