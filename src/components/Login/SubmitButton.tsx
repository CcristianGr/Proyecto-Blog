interface SubmitButtonProps {
    isLoading: boolean;
    loadingText: string;
    defaultText: string;
    className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    isLoading,
    loadingText,
    defaultText,
    className = ''
}) => {
    return (
        <div className={`rounded-4xl bg-green-500 h-14 w-[80%] my-3 justify-self-center place-self-start ${className}`}>
            <button 
                type="submit" 
                className="px-10 w-full h-full text-white font-bold text-xl disabled:opacity-50 hover:cursor-pointer hover:bg-black hover:rounded-4xl" 
                disabled={isLoading}
            >
                {isLoading ? loadingText : defaultText}
            </button>
        </div>
    );
};