import axios from "axios";
import type { LoginForm, RegisterForm } from "../TypeScript/Entities";

const API_BASE_URL = import.meta.env.VITE_API_BLOG;


export async function getPostActiveCloseArea() { //TODO
  const response = await axios.get(`${API_BASE_URL}/comments/1`);
  return response.data;
}

export async function postRegistrarUsuario(data: RegisterForm) {
  const response = await axios.post(`${API_BASE_URL}api/Acceso/Registrarse`,data);
  return response.data;
}

export async function postIniciarSesion(data: LoginForm) {
  const response = await axios.post(`${API_BASE_URL}api/Acceso/Login`,data);
  return response.data;
}


 