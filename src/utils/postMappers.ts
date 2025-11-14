import type { Post, PublicacionDTO } from "../TypeScript/Entities";
import { generatePostHref, estimateReadingMins, DEFAULT_COVER } from "./postUtils";

// Convierte un objeto de la API (PublicacionDTO) a un Post del frontend
// Maneja diferentes formatos de respuesta (mayúsculas/minúsculas, diferentes nombres de propiedades)
export const mapPublicacionDTOToPost = (
  dto: any,
  isUser: boolean = false
): Post => {
  // Extrae los campos del DTO, probando diferentes variantes de nombres
  const id = dto.id || dto.Id || dto.idPublicacion || Date.now();
  const titulo = dto.titulo || dto.Titulo || dto.title || "";
  const contenido = dto.contenido || dto.Contenido || dto.content || "";
  const imagenUrl = dto.imagenUrl || dto.ImagenUrl || dto.imagen || dto.coverUrl || null;
  const etiquetas = dto.etiquetas || dto.Etiquetas || dto.tags || "";
  const fechaCreacion = dto.fechaCreacion || dto.FechaCreacion || dto.fecha || dto.date || new Date().toISOString();
  const autor = dto.autor || dto.Autor || dto.author || dto.nombreUsuario || null;
  const likes = dto.likes || dto.Likes || dto.initialLikes || 0;
  const idUsuario = dto.idUsuario || dto.IdUsuario || dto.userId || 0;
  const idCategoria = dto.idCategoria || dto.IdCategoria || dto.categoryId || null;

  // Convierte las etiquetas a array si vienen como string separado por comas
  const tags = etiquetas 
    ? (typeof etiquetas === "string" 
        ? etiquetas.split(",").map(t => t.trim()).filter(Boolean)
        : Array.isArray(etiquetas) 
          ? etiquetas 
          : [])
    : [];

  // Genera un resumen (excerpt) de los primeros 150 caracteres del contenido
  const excerpt = contenido 
    ? (contenido.length > 150 ? contenido.substring(0, 150) + "..." : contenido)
    : "";

  return {
    id,
    title: titulo,
    coverUrl: imagenUrl || DEFAULT_COVER,
    excerpt,
    contenido,
    author: autor || "Autor desconocido",
    date: fechaCreacion,
    tags,
    initialLikes: likes,
    href: generatePostHref(titulo),
    readingMins: estimateReadingMins(contenido),
    isUser,
    draft: false,
    idUsuario,
    idCategoria,
  };
};

// Convierte un Post del frontend a un PublicacionDTO para enviar a la API
export const mapPostToPublicacionDTO = (post: Post): PublicacionDTO => {
  return {
    titulo: post.title || null,
    contenido: post.contenido || post.excerpt || null,
    etiquetas: post.tags?.join(", ") || null,
    imagenUrl: post.coverUrl || null,
    idUsuario: post.idUsuario ?? 0,
    idCategoria: post.idCategoria ?? null,
  };
};
