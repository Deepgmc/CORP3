export interface IUser {
    id      : number,
    username: string,
    age     : number,
    password: string,
    email   : string,
}

export interface ILoginUser extends Pick<IUser, 'username' | 'password'> {}
