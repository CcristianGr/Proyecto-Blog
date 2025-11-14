import axios from "axios";
import apiClient from "./axiosConfig";
import type { LoginForm, RegisterForm, PublicacionDTO } from "../TypeScript/Entities";

const API_BASE_URL = import.meta.env.VITE_API_BLOG;

// Cliente axios para endpoints públicos (sin autenticación)
const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Endpoints de Acceso =====

export async function getPostActiveCloseArea() {
  const response = await apiClient.get(`/comments/1`);
  return response.data;
}

// Registra un nuevo usuario
export async function postRegistrarUsuario(data: RegisterForm) {
  const response = await publicApiClient.post(`/api/Acceso/Registrarse`, data);
  return response.data;
}

// Inicia sesión con correo y contraseña
export async function postIniciarSesion(data: LoginForm) {
  const response = await publicApiClient.post(`/api/Acceso/Login`, data);
  return response.data;
}

// ===== Endpoints de Publicaciones =====

// Obtiene todas las publicaciones disponibles
export async function getListarPublicaciones() {
  const response = await apiClient.get(`/api/Publicaciones/Listar`);
  return response.data;
}

// Obtiene las publicaciones del usuario autenticado
export async function getMisPublicaciones() {
  const response = await apiClient.get(`/api/Publicaciones/MisPublicaciones`);
  return response.data;
}

// Crea una nueva publicación
export async function postCrearPublicacion(data: PublicacionDTO) {
  const response = await apiClient.post(`/api/Publicaciones/Crear`, data);
  return response.data;
}

// Actualiza una publicación existente
export async function putActualizarPublicacion(id: number, data: PublicacionDTO) {
  const response = await apiClient.put(`/api/Publicaciones/Actualizar/${id}`, data);
  return response.data;
}

// Elimina una publicación
export async function deleteEliminarPublicacion(id: number) {
  const response = await apiClient.delete(`/api/Publicaciones/Eliminar/${id}`);
  return response.data;
}
