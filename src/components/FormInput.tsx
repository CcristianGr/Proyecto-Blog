interface FormInputProps {
    type: 'text' | 'email' | 'password';
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    hasError?: boolean;
    required?: boolean;
    className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    type,
    placeholder,
    value,
    onChange,
    hasError = false,
    required = false,
    className = ''
}) => {
    return (
        <div className={`rounded-4xl ${hasError ? 'bg-red-200' : 'bg-[#e5dddd]'} h-14 w-[80%] my-2 justify-self-center ${className}`}>
            <input 
                type={type}
                placeholder={placeholder}
                className="px-10 w-full h-full outline-0 bg-transparent"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
            />
        </div>
    );
};