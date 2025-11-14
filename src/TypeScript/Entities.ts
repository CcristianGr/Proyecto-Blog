export type RegisterForm = {
    nombre: string;
    username: string;
    correo: string;
    passwordHash: string;
}

export type LoginForm = {
    correo: string;
    passwordHash: string;
}

// DTOs según swagger.json
export type PublicacionDTO = {
    titulo: string | null;
    contenido: string | null;
    etiquetas: string | null;
    imagenUrl: string | null;
    idUsuario: number;
    idCategoria: number | null;
}

// Tipos para el frontend
export interface Post {
    id: string | number;
    title: string;
    coverUrl: string;
    excerpt: string;
    author?: string;
    date?: string;
    tags?: string[];
    initialLikes?: number;
    href?: string;
    readingMins?: number;
    isUser?: boolean;
    draft?: boolean;
    // Campos adicionales para mapeo con API
    contenido?: string;
    idUsuario?: number;
    idCategoria?: number | null;
}

export type SortKey = "new" | "likes" | "alpha" | "short";