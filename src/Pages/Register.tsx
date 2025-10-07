import { postRegistrarUsuario } from "../api/EndPoint";
import type { RegisterForm } from "../TypeScript/Entities";
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { FormInput } from '../components/FormInput';
import { SubmitButton } from '../components/SubmitButton';
import { validateRegisterForm } from '../utils/formValidations';

export const RegisterPage = () => {
    const navigate = useNavigate();

    const initialValues: RegisterForm = {
        nombre: "",
        username: "",
        correo: "",
        passwordHash: ""
    };

    const handleSubmitForm = async (formData: RegisterForm) => {
        try {
            await postRegistrarUsuario(formData);
            alert("Usuario Registrado");
            resetForm();
            navigate('/');
        } catch (err) {
            console.error('Error POST:', err);
            alert("Error al enviar Registrarse. Por favor intenta de nuevo.");
            throw err; // Re-throw para que useForm maneje el estado de loading
        }
    };

    const { values, errors, isLoading, handleChange, handleSubmit, resetForm } = useForm({
        initialValues,
        validate: validateRegisterForm,
        onSubmit: handleSubmitForm
    });
    return (
        <div>
            <div className="w-full h-[100vh] bg-gray-100 flex justify-center items-center bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
                <form onSubmit={handleSubmit} className="h-140 bg-white rounded-4xl">
                    <div className="h-full w-120 grid grid-rows-[12%_18%_14%_14%_14%_14%_14%] place-items-center p-10">
                        <div className="text-3xl justify-self-center place-self-end">
                            <p>
                                <strong>
                                    Registrate
                                </strong>
                            </p>
                        </div>

                        <FormInput
                            type="text"
                            placeholder="Nombre"
                            value={values.nombre}
                            onChange={(value) => handleChange('nombre', value)}
                            hasError={!!errors.nombre}
                            required
                            className="place-self-end"
                        />

                        <FormInput
                            type="text"
                            placeholder="Usuario"
                            value={values.username}
                            onChange={(value) => handleChange('username', value)}
                            hasError={!!errors.username}
                            required
                            className="place-self-end"
                        />

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
                            loadingText="Registrando..."
                            defaultText="Registrarse"
                        />
                        
                        <span className="text-gray-400 justify-self-center place-self-start">O puedes <a href="/"><strong>Iniciar Sesion</strong></a> </span>
                    </div>
                </form>
            </div>
        </div>
    )
}