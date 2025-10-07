import type { RegisterForm, LoginForm } from '../TypeScript/Entities';

export const validateRegisterForm = (values: RegisterForm): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!values.nombre.trim()) {
        errors.nombre = 'El nombre es requerido';
    }
    
    if (!values.username.trim()) {
        errors.username = 'El usuario es requerido';
    }
    
    if (!values.correo.trim()) {
        errors.correo = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(values.correo)) {
        errors.correo = 'El email no es válido';
    }
    
    if (!values.passwordHash.trim()) {
        errors.passwordHash = 'La contraseña es requerida';
    } else if (values.passwordHash.length < 6) {
        errors.passwordHash = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return errors;
};

export const validateLoginForm = (values: LoginForm): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!values.correo.trim()) {
        errors.correo = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(values.correo)) {
        errors.correo = 'El email no es válido';
    }
    
    if (!values.passwordHash.trim()) {
        errors.passwordHash = 'La contraseña es requerida';
    }
    
    return errors;
};