export const LoginPage = () =>{

    return(
        <div>
            <form action="">
                <div>
                    <p>Member Login</p>
                </div>
                <div>
                    <input type="email" placeholder="Email" />
                </div>
                <div>
                    <input type="password" placeholder="PassWord"  />
                </div>
                <div>
                    <button>Login</button>
                </div>
                <span>Forgot <a href="/">UserName </a>/ <a href="/"> PassWord</a></span>
            </form>
        </div>
    )
}