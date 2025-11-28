import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {preset: 'static'},
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css",
    'notivue/notification.css',
    'notivue/animations.css',
  ],
  app: {
    baseURL: '',
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      title: "Sistema de pedidos para cafeterías",
      meta: [
        { charset: "utf-8", },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/images/icon.jpg" },
      // Bulma CSS
      {rel: "preconnect", href: "https://fonts.googleapis.com"},
      {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: ""},
      {rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cabin:wght@400;700&display=swap"},
      {rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.4/css/bulma.min.css"},
      {rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"},
      ],
      script: [
        {src: "https://cdn.tailwindcss.com", tagPosition: "head"},
        {
          children: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: '#2F4F4F',
                    secondary: '#48D1CC',
                    background: '#F0F8FF',
                    'text-dark': '#34495E',
                    'gray-lighter': '#ECF0F1',
                  },
                  fontFamily: {
                    cabin: ['Cabin', 'sans-serif'],
                  }
                  ,
                },
              },
            }
          `,
          type: "text/javascript",
          tagPosition: "head",

        }
      ],
    },
  },
  modules: ['notivue/nuxt'],
  notivue: {
    position: 'top-right',
    limit: 4,
    enqueue: true,
    avoidDuplicates: true,
    notifications: {
      global: {
        duration: 4000,
      }
    },
  },
});
