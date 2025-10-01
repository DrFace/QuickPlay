import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                MMArmenU: ["MMArmenU", "sans-serif"],
                Kanit: ["Kanit", "sans-serif"],
                Inter: ["Inter", "sans-serif"],
                Black: ["Black", "sans-serif"],

            },
            colors: {
                sideBlack: "#0e0e23",
                titleColor: "#170c6b",
                primary: "#004AAD",
                secondary: "#0e0e23",
                textSecondary: "#676767",
                primaryBtnColor: "#004AAD",
                primaryBtnColorHover: "#125ec4",
                tYellow: "#EEA70D",
                tRed: "#EF5353",
                pageColor: "#D9D9D9",
                cardColor: "#1F57C3",
                borderColor: "#CFCFCF",
                footerColor: "#181818",
                cardsColor: "#F2F6FB",
                skillCardColor: "#E9E9E9",
                OverviewborderColor: "#676767",
                acivationColor: "#004aad",
                invisibleborder: "#b8b8b8",
                profileBgColor: "#FFFFFF",
                newborderColor: "#E9E9E8",
                newblueColor: "#004AAD0D",


            },
            boxShadow: {
                'up-lg': '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)', // large upward shadow
                'up-3xl': '0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 -10px 10px -5px rgba(0, 0, 0, 0.04)', // 3xl upward shadow

                'bottom-lg': '0 0px 10px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // large bottom shadow
                'bottom-3xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // 3xl bottom shadow
              },

              backgroundImage: theme => ({
                'client-home-pattern': "url('/assets/home/BG.png')",
              }),

        },
    },

    plugins: [forms],
};


















