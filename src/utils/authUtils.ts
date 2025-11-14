const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "user_id";

// Guarda el token de autenticación en localStorage
export const saveAuthToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving auth token:", error);
  }
};

// Obtiene el token de autenticación guardado en localStorage
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Elimina el token y el ID del usuario de localStorage (logout)
export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error("Error removing auth token:", error);
  }
};

// Verifica si el usuario está autenticado (tiene token guardado)
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

// Guarda el ID del usuario en localStorage
export const saveUserId = (userId: number): void => {
  try {
    localStorage.setItem(USER_ID_KEY, userId.toString());
  } catch (error) {
    console.error("Error saving user ID:", error);
  }
};

// Obtiene el ID del usuario guardado en localStorage
export const getUserId = (): number | null => {
  try {
    const stored = localStorage.getItem(USER_ID_KEY);
    if (stored) {
      const userId = parseInt(stored, 10);
      if (!isNaN(userId)) return userId;
    }
    return null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};
