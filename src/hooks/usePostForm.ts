import { useState, useEffect, useRef, useCallback } from "react";
import type { Post } from "../TypeScript/Entities";
import { isValidImageUrl } from "../utils/postUtils";
import { DEFAULT_COVER } from "../utils/postUtils";

interface PostFormData {
  title: string;
  coverUrl: string;
  excerpt: string;
  tags: string;
  isDraft: boolean;
}

interface UsePostFormOptions {
  onSubmit: (data: PostFormData) => Promise<void>;
  initialPost?: Post | null;
  onCancel?: () => void;
}

interface UsePostFormReturn {
  formData: PostFormData;
  error: string | null;
  isEditing: boolean;
  dropRef: React.RefObject<HTMLDivElement>;
  setTitle: (title: string) => void;
  setCoverUrl: (url: string) => void;
  setExcerpt: (excerpt: string) => void;
  setTags: (tags: string) => void;
  setIsDraft: (isDraft: boolean) => void;
  validate: () => string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearForm: () => void;
  setError: (error: string | null) => void;
}

// Hook para gestionar el formulario de crear/editar posts
export const usePostForm = (options: UsePostFormOptions): UsePostFormReturn => {
  const { onSubmit, initialPost, onCancel } = options;
  
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    coverUrl: "",
    excerpt: "",
    tags: "",
    isDraft: false,
  });

  const [error, setError] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const isEditing = !!initialPost;

  // Carga los datos del post cuando se está editando
  useEffect(() => {
    if (initialPost) {
      setFormData({
        title: initialPost.title,
        coverUrl: initialPost.coverUrl,
        excerpt: initialPost.excerpt,
        tags: (initialPost.tags ?? []).join(", "),
        isDraft: !!initialPost.draft,
      });
    }
  }, [initialPost]);

  // Configura el drag & drop para arrastrar imágenes al formulario
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      el.classList.add("dz--on");
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      el.classList.remove("dz--on");
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      el.classList.remove("dz--on");
      
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData(prev => ({
            ...prev,
            coverUrl: String(reader.result),
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("dragleave", handleDragLeave);
    el.addEventListener("drop", handleDrop);

    return () => {
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("dragleave", handleDragLeave);
      el.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Valida los datos del formulario antes de enviar
  const validate = useCallback((): string | null => {
    if (formData.title.trim().length < 4) {
      return "El título debe tener al menos 4 caracteres.";
    }
    
    if (formData.excerpt.trim().length < 20) {
      return "El resumen debe tener al menos 20 caracteres.";
    }
    
    const tagList = formData.tags
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    
    if (tagList.length > 5) {
      return "Máximo 5 etiquetas.";
    }
    
    if (formData.coverUrl && !isValidImageUrl(formData.coverUrl)) {
      return "La URL de imagen no es válida.";
    }
    
    return null;
  }, [formData]);

  // Maneja el envío del formulario
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError(null);
      await onSubmit(formData);
      clearForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el post");
    }
  }, [formData, validate, onSubmit]);

  // Limpia el formulario y restablece todos los campos
  const clearForm = useCallback(() => {
    setFormData({
      title: "",
      coverUrl: "",
      excerpt: "",
      tags: "",
      isDraft: false,
    });
    setError(null);
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  return {
    formData,
    error,
    isEditing,
    dropRef,
    setTitle: (title: string) => setFormData(prev => ({ ...prev, title })),
    setCoverUrl: (coverUrl: string) => setFormData(prev => ({ ...prev, coverUrl })),
    setExcerpt: (excerpt: string) => setFormData(prev => ({ ...prev, excerpt })),
    setTags: (tags: string) => setFormData(prev => ({ ...prev, tags })),
    setIsDraft: (isDraft: boolean) => setFormData(prev => ({ ...prev, isDraft })),
    validate,
    handleSubmit,
    clearForm,
    setError,
  };
};
