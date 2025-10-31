export const UserProfile = () => {


    return (
        <div className="grid grid-cols-2 grid-rows-2 p-20 gap-5 *:border-2">
            <div className="flex flex-col">
                <div>
                    <img src="" alt="" />
                </div>
                <div>
                    <p>John Doe</p>
                    <p>Full Stack Developer</p>
                </div>
            </div>
            <div>2
                <div>
                    <div>
                        <p>Nombre Completo:</p>
                        <p>Kenneth Valdez</p>
                    </div>
                    <div>
                        <p>Correo:</p>
                        <p>Kenneth Valdez</p>
                    </div>
                    <div>
                        <p>Telefono:</p>
                        <p>Kenneth Valdez</p>
                    </div>
                </div>
                <div>
                    <button>Edit</button>
                </div>
            </div>
            <div>4
                <div>
                    <p>Post Realizados</p>
                    <div>
                        <div>
                            post 1
                        </div>
                        <div>
                            post 2
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
