import { useMemo, useState } from "react";
import type { Post, SortKey } from "../TypeScript/Entities";

interface UsePostFiltersOptions {
  posts: Post[];
}

interface UsePostFiltersReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  showDrafts: boolean;
  setShowDrafts: (show: boolean) => void;
  filteredPosts: Post[];
  allTags: string[];
  clearFilters: () => void;
}

// Hook para gestionar búsqueda, filtros y ordenamiento de posts
export const usePostFilters = (options: UsePostFiltersOptions): UsePostFiltersReturn => {
  const { posts } = options;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("new");
  const [showDrafts, setShowDrafts] = useState(true);

  // Extrae todas las etiquetas únicas de los posts y las ordena alfabéticamente
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  // Filtra y ordena los posts según los criterios seleccionados
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    // Aplica filtros: búsqueda por texto, etiquetas y borradores
    let filtered = posts.filter(post => {
      const matchesSearch = !query || 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.author ?? "").toLowerCase().includes(query) ||
        (post.tags ?? []).some(tag => tag.toLowerCase().includes(query));

      const matchesTags = activeTags.length === 0 || 
        (post.tags ?? []).some(tag => activeTags.includes(tag));

      const matchesDraft = showDrafts || !post.draft;

      return matchesSearch && matchesTags && matchesDraft;
    });

    // Aplica ordenamiento según la opción seleccionada
    filtered = [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "new":
          return (new Date(b.date || 0).getTime()) - (new Date(a.date || 0).getTime());
        case "likes":
          return (b.initialLikes ?? 0) - (a.initialLikes ?? 0);
        case "alpha":
          return a.title.localeCompare(b.title);
        case "short":
          return (a.readingMins ?? 0) - (b.readingMins ?? 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchQuery, activeTags, showDrafts, sortKey]);

  // Agrega o quita una etiqueta de los filtros activos
  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Limpia todas las etiquetas activas
  const clearTags = () => {
    setActiveTags([]);
  };

  // Limpia todos los filtros (búsqueda y etiquetas)
  const clearFilters = () => {
    setSearchQuery("");
    setActiveTags([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    activeTags,
    toggleTag,
    clearTags,
    sortKey,
    setSortKey,
    showDrafts,
    setShowDrafts,
    filteredPosts,
    allTags,
    clearFilters,
  };
};
