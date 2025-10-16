export interface IUser {
    id      : number,
    username: string,
    birth   : string,
    password: string,
    email   : string,
}

export interface ILoginUser extends Pick<IUser, 'username' | 'password'> {}

export interface TRegisterForm extends Pick<IUser, 'username' | 'password' | 'email' | 'birth'> {
    passwordConfirm: string,
}
