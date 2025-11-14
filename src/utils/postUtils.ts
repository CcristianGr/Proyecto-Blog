// Convierte un texto a formato slug (URL-friendly): elimina acentos, espacios y caracteres especiales
export const slugify = (s: string): string =>
  s.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// Calcula los minutos estimados de lectura basado en el número de palabras (180 palabras/minuto)
export const estimateReadingMins = (text: string): number => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return Math.max(1, Math.round(words.length / 180));
};

// URL por defecto para imágenes de portada cuando no se proporciona una
export const DEFAULT_COVER = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop";

// Valida si una URL es válida para una imagen (http/https o data:image)
export const isValidImageUrl = (url: string): boolean => {
  if (!url.trim()) return false;
  return /^https?:\/\/.+/i.test(url.trim()) || url.startsWith("data:image/");
};

// Genera la URL de navegación para un post basado en su título
export const generatePostHref = (title: string): string => {
  return `#/post/${slugify(title)}`;
};
