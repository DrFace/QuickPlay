// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translations
const resources = {
  en: {
    translation: {
      scoreline: "Scoreline",
      menu: "Menu",
      top_headlines: "Top headlines",
      leagues: "Leagues",
      latest_news: "Latest News",
      see_all: "See all",
      read_full_story: "Read full story",
      live_scores: "Live scores",
      loading_live_scores: "Loading live scores...",
      no_live_matches: "No live matches at the moment.",
      get_biggest_stories: "Get the day's biggest stories",
      subscribe_newsletter: "Subscribe to our newsletter and never miss a headline.",
      subscribe: "Subscribe",
      no_image: "No Image",
      prev: "Prev",
      next: "Next",
      placeholder_email: "you@email.com"
    },
  },
  es: {
    translation: {
      scoreline: "Marcador",
      menu: "Menú",
      top_headlines: "Titulares principales",
      leagues: "Ligas",
      latest_news: "Últimas Noticias",
      see_all: "Ver todo",
      read_full_story: "Leer historia completa",
      live_scores: "Marcadores en vivo",
      loading_live_scores: "Cargando marcadores...",
      no_live_matches: "No hay partidos en vivo en este momento.",
      get_biggest_stories: "obtain las historias más importantes del día",
      subscribe_newsletter: "Suscríbete a nuestro boletín y nunca pierdas un titular.",
      subscribe: "Suscribirse",
      no_image: "Sin imagen",
      prev: "Anterior",
      next: "Siguiente",
      placeholder_email: "tucorreo@email.com"
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
