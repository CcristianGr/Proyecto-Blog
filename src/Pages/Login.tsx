import { useNavigate } from "react-router-dom";
import type { LoginForm } from "../TypeScript/Entities";
import { useForm } from '../hooks/useForm';
import { FormInput } from '../components/Login/FormInput';
import { SubmitButton } from '../components/Login/SubmitButton';
import { validateLoginForm } from '../utils/formValidations';
import { saveAuthToken, saveUserId } from "../utils/authUtils";

export const LoginPage = () => {
    const navigate = useNavigate();

    const initialValues: LoginForm = {
        correo: "",
        passwordHash: ""
    };

    const handleSubmitForm = async (formData: LoginForm) => {
        try {
            // Usar axios directamente para poder acceder a los headers
            const axios = (await import("axios")).default;
            const API_BASE_URL = import.meta.env.VITE_API_BLOG;
            
            const response = await axios.post(`${API_BASE_URL}/api/Acceso/Login`, formData);
            
            // La API puede devolver el token de diferentes formas:
            // 1. En el body como string: response.data = "token123"
            // 2. En el body como objeto: response.data = { token: "token123", userId: 1 }
            // 3. En headers: response.headers['authorization'] o response.headers['x-auth-token']
            
            let token: string | null = null;
            let userId: number | null = null;

            // Buscar token en headers primero (más común en APIs REST)
            const authHeader = response.headers['authorization'] || 
                              response.headers['Authorization'] ||
                              response.headers['x-auth-token'] ||
                              response.headers['X-Auth-Token'];
            
            if (authHeader) {
                // Si viene como "Bearer token", extraer solo el token
                token = authHeader.startsWith('Bearer ') 
                    ? authHeader.substring(7) 
                    : authHeader;
            }

            // Si no está en headers, buscar en el body
            if (!token) {
                const data = response.data;
                if (typeof data === "string") {
                    // Si la respuesta es un string, asumimos que es el token
                    token = data;
                } else if (data && typeof data === "object") {
                    // Si es un objeto, buscar token y userId en diferentes propiedades posibles
                    token = data.token || data.accessToken || data.jwt || data.Token || null;
                    userId = data.userId || data.idUsuario || data.id || data.IdUsuario || null;
                }
            }

            // Guardar token si existe
            if (token) {
                saveAuthToken(token);
            } else {
                console.warn("No se recibió token en la respuesta del login. Revisa el formato de respuesta de la API.");
            }

            // Guardar userId si existe
            if (userId && typeof userId === "number") {
                saveUserId(userId);
            }

            navigate('/home');
        } catch (err: any) {
            console.error('Error en login:', err);
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.error ||
                                "Error al iniciar sesión. Por favor intenta de nuevo.";
            throw err;
        }
    };

    const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
        initialValues,
        validate: validateLoginForm,
        onSubmit: handleSubmitForm
    });

    return (
        <div className="w-full h-[100vh] bg-gray-100 flex justify-center items-center bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
            <form onSubmit={handleSubmit} className="h-130 bg-white rounded-4xl">
                <div className="h-full w-110 grid grid-rows-[15%_21%_15%_20%_24%] place-items-center p-10">
                    <div className="text-3xl justify-self-center place-self-end">
                        <p>
                            <strong>
                                Inicio de Sesion
                            </strong>
                        </p>
                    </div>

                    <FormInput
                        type="email"
                        placeholder="Email"
                        value={values.correo}
                        onChange={(value) => handleChange('correo', value)}
                        hasError={!!errors.correo}
                        required
                        className="place-self-end"
                    />

                    <FormInput
                        type="password"
                        placeholder="Contraseña"
                        value={values.passwordHash}
                        onChange={(value) => handleChange('passwordHash', value)}
                        hasError={!!errors.passwordHash}
                        required
                        className="place-self-start"
                    />

                    <SubmitButton
                        isLoading={isLoading}
                        loadingText="Ingresando..."
                        defaultText="Ingresar"
                    />

                    <span className="justify-self-center place-self-end">
                        <a href="/Register" className="text-gray-400"><strong>Crea tu cuenta</strong></a>
                    </span>
                </div>
            </form>
        </div>
    )
}