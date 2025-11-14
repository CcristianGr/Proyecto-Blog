import type { Post } from "../TypeScript/Entities";

const STORAGE_KEY = "user_posts_v3";

// Carga los posts del usuario guardados en localStorage
export const loadUserPosts = (): Post[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Post[];
  } catch (error) {
    console.error("Error loading posts from localStorage:", error);
    return [];
  }
};

// Guarda los posts del usuario en localStorage
export const saveUserPosts = (posts: Post[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("Error saving posts to localStorage:", error);
  }
};

// Elimina todos los posts del usuario de localStorage
export const clearUserPosts = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing posts from localStorage:", error);
  }
};
