export type RegisterForm = {
    nombre: string;
    username: string;
    correo: string;
    passwordHash: string;
}

export type LoginForm = {
    correo: string;
    passwordHash: string;
}