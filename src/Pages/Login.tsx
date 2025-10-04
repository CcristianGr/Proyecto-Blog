import { useNavigate } from "react-router-dom";
import type { LoginForm } from "../TypeScript/Entities";
import { useForm } from '../hooks/useForm';
import { FormInput } from '../components/FormInput';
import { SubmitButton } from '../components/SubmitButton';
import { validateLoginForm } from '../utils/formValidations';
import { postIniciarSesion } from "../api/EndPoint";

export const LoginPage = () => {
    const navigate = useNavigate();

    const initialValues: LoginForm = {
        correo: "",
        passwordHash: ""
    };

    const handleSubmitForm = async (formData: LoginForm) => {
        try {
            await postIniciarSesion(formData);
            alert("Login exitoso");
            navigate('/Home');
        } catch (err) {
            console.error('Error en login:', err);
            alert("Error al iniciar sesión. Por favor intenta de nuevo.");
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
            <form onSubmit={handleSubmit} className="h-160 bg-white rounded-4xl">
                <div className="h-full w-140 grid grid-rows-[15%_21%_15%_15%_10%_24%] place-items-center p-10">
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

                    <span className="text-gray-400 justify-self-center place-self-start">Olvidaste tu <a href="/"><strong>Usuario / Contraseña</strong></a></span>
                    <span className="justify-self-center place-self-end">
                        <a href="/Register" className="text-gray-400"><strong>Crea tu cuenta</strong></a>
                    </span>
                </div>
            </form>
        </div>
    )
}