export const RegisterPage = () => {
    
    return (
        <div>
            <div className="w-full h-[100vh] bg-gray-100 flex justify-center items-center bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
            <form action="" className="h-160 bg-white rounded-4xl">
                <div className="h-full w-140 grid grid-rows-[20%_21%_20%_15%_20%] place-items-center p-10">
                    <div className="text-3xl justify-self-center place-self-end">
                        <p>
                            <strong>
                                Registrate
                            </strong>
                        </p>
                    </div>

                    <div className="rounded-4xl bg-[#e5dddd] h-14 w-[80%] my-2 justify-self-center place-self-end">
                        <input type="email" placeholder="Email" className="px-10 w-full h-full outline-0" />
                    </div>

                    <div className="rounded-4xl bg-[#e5dddd] h-14 w-[80%] my-2 justify-self-center place-self-start">
                        <input type="password" placeholder="Contraseña" className="px-10 w-full h-full outline-0" />
                    </div>

                    <div className="rounded-4xl bg-green-500 h-14 w-[80%] my-3 justify-self-center place-self-start">
                        <button className="px-10 w-full h-full text-white font-bold text-xl">Registrarse</button>
                    </div>
                    <span className="text-gray-400 justify-self-center place-self-start">O puedes <a href="/"><strong>Iniciar Sesion</strong></a> </span>
                </div>
            </form>
        </div>
        </div>
    )
}