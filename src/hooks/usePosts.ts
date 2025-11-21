import { useState, useEffect, useCallback } from "react";
import type { Post } from "../TypeScript/Entities";
import { 
  getListarPublicaciones, 
  getMisPublicaciones,
  postCrearPublicacion,
  putActualizarPublicacion,
  deleteEliminarPublicacion
} from "../api/EndPoint";
import { loadUserPosts, saveUserPosts } from "../utils/localStorageUtils";
import { mapPublicacionDTOToPost } from "../utils/postMappers";

interface UsePostsOptions {
  userId?: number;
}

interface UsePostsReturn {
  allPosts: Post[];
  userPosts: Post[];
  isLoading: boolean;
  error: string | null;
  createPost: (formData: FormData) => Promise<void>;
  updatePost: (id: number, post: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

// Hook principal para gestionar todas las operaciones de posts
export const usePosts = (options: UsePostsOptions = {}): UsePostsReturn => {
  const { userId } = options;
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>(() => loadUserPosts());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza los posts del usuario con localStorage
  useEffect(() => {
    saveUserPosts(userPosts);
  }, [userPosts]);

  // Carga todas las publicaciones desde la API
  const loadAllPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getListarPublicaciones();
      const posts: Post[] = Array.isArray(response)
        ? response.map((item: any) => mapPublicacionDTOToPost(item, false))
        : [];
      setAllPosts(posts);
    } catch (err) {
      console.error("Error loading posts:", err);
      setError("Error al cargar las publicaciones");
      setAllPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga las publicaciones del usuario desde la API
  const loadUserPostsFromAPI = useCallback(async () => {
    if (!userId) {
      const localPosts = loadUserPosts();
      setUserPosts(localPosts);
      return;
    }
    
    try {
      const response = await getMisPublicaciones();
      const posts: Post[] = Array.isArray(response)
        ? response.map((item: any) => mapPublicacionDTOToPost(item, true))
        : [];
      setUserPosts(posts);
    } catch (err) {
      console.error("Error loading user posts:", err);
      const localPosts = loadUserPosts();
      setUserPosts(localPosts);
    }
  }, [userId]);

  // Crea un nuevo post y recarga todos los posts usando FormData
  const createPost = useCallback(async (formData: FormData) => {
    try {
      setError(null);
      await postCrearPublicacion(formData);
      await Promise.all([loadAllPosts(), loadUserPostsFromAPI()]);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Error al crear la publicación");
      throw err;
    }
  }, [loadAllPosts, loadUserPostsFromAPI]);

  // Actualiza un post existente y recarga todos los posts
  const updatePost = useCallback(async (id: number, post: Partial<Post>) => {
    try {
      setError(null);
      const existingPost = userPosts.find(p => p.id === id);
      if (!existingPost) {
        throw new Error("Post no encontrado");
      }
      const updatedPost = { ...existingPost, ...post };
      const dto = mapPostToPublicacionDTO(updatedPost);
      await putActualizarPublicacion(id, dto);
      await Promise.all([loadAllPosts(), loadUserPostsFromAPI()]);
    } catch (err) {
      console.error("Error updating post:", err);
      setError("Error al actualizar la publicación");
      throw err;
    }
  }, [userPosts, loadAllPosts, loadUserPostsFromAPI]);

  // Elimina un post y recarga todos los posts
  const deletePost = useCallback(async (id: number) => {
    try {
      setError(null);
      await deleteEliminarPublicacion(id);
      await Promise.all([loadAllPosts(), loadUserPostsFromAPI()]);
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Error al eliminar la publicación");
      throw err;
    }
  }, [loadAllPosts, loadUserPostsFromAPI]);

  // Refresca todos los posts desde la API
  const refreshPosts = useCallback(async () => {
    await Promise.all([loadAllPosts(), loadUserPostsFromAPI()]);
  }, [loadAllPosts, loadUserPostsFromAPI]);

  // Carga inicial de posts al montar el componente
  useEffect(() => {
    let isMounted = true;
    
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Carga posts generales y del usuario en paralelo
        const [allPostsResponse, userPostsResponse] = await Promise.allSettled([
          getListarPublicaciones(),
          userId ? getMisPublicaciones() : Promise.resolve([]),
        ]);

        if (!isMounted) return;

        // Procesa posts generales: extrae el array de publicaciones del objeto de respuesta
        if (allPostsResponse.status === "fulfilled") {
          const response = allPostsResponse.value;
          let publicacionesArray: any[] = [];
          
          if (Array.isArray(response)) {
            publicacionesArray = response;
          } else if (response && typeof response === "object") {
            publicacionesArray = response.publicaciones || 
                                 response.Publicaciones || 
                                 response.data || 
                                 response.Data || 
                                 response.items || 
                                 response.Items || 
                                 [];
          }
          
          const posts: Post[] = Array.isArray(publicacionesArray)
            ? publicacionesArray.map((item: any) => mapPublicacionDTOToPost(item, false))
            : [];
          setAllPosts(posts);
        } else {
          setError("Error al cargar las publicaciones");
          setAllPosts([]);
        }

        // Procesa posts del usuario: extrae el array de publicaciones del objeto de respuesta
        if (userPostsResponse.status === "fulfilled") {
          const response = userPostsResponse.value;
          let publicacionesArray: any[] = [];
          
          if (Array.isArray(response)) {
            publicacionesArray = response;
          } else if (response && typeof response === "object") {
            publicacionesArray = response.publicaciones || 
                                 response.Publicaciones || 
                                 response.data || 
                                 response.Data || 
                                 response.items || 
                                 response.Items || 
                                 [];
          }
          
          if (Array.isArray(publicacionesArray) && publicacionesArray.length > 0) {
            const posts: Post[] = publicacionesArray.map((item: any) => mapPublicacionDTOToPost(item, true));
            setUserPosts(posts);
          } else if (!userId) {
            const localPosts = loadUserPosts();
            setUserPosts(localPosts);
          }
        } else {
          console.error("Error loading user posts:", userPostsResponse.reason);
          const localPosts = loadUserPosts();
          setUserPosts(localPosts);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error loading posts:", err);
        setError("Error al cargar las publicaciones");
        setAllPosts([]);
        const localPosts = loadUserPosts();
        setUserPosts(localPosts);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return {
    allPosts,
    userPosts,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
    refreshPosts,
  };
};
