import { useState } from 'react';

interface UseFormOptions<T> {
    initialValues: T;
    validate?: (values: T) => Record<string, string>;
    onSubmit: (values: T) => Promise<void>;
}

interface UseFormReturn<T> {
    values: T;
    errors: Record<string, string>;
    isLoading: boolean;
    handleChange: (field: keyof T, value: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    resetForm: () => void;
}

export const useForm = <T extends Record<string, any>>({
    initialValues,
    validate,
    onSubmit
}: UseFormOptions<T>): UseFormReturn<T> => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: keyof T, value: string) => {
        setValues(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field as string]) {
            setErrors(prev => ({
                ...prev,
                [field as string]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validar formulario si se proporciona función de validación
        const validationErrors = validate ? validate(values) : {};
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            await onSubmit(values);
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
        setIsLoading(false);
    };

    return {
        values,
        errors,
        isLoading,
        handleChange,
        handleSubmit,
        resetForm
    };
};