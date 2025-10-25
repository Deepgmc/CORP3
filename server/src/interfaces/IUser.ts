export interface IUser {
    userId  : number,
    username: string,
    birth   : string, //timestamp of a birth
    password: string,
    email   : string,
}

export type TUserId = IUser['userId'];

export type ILoginUser = Pick<IUser, 'username' | 'password'>

export interface TRegisterForm extends Pick<IUser, 'username' | 'password' | 'email' | 'birth'> {
    passwordConfirm: string,
}

export type IUsersCreateDTO = Omit<IUser, 'userId'>
export type IUsersUpdateDTO = Partial<IUser>
export type TUserWithoutPassword = Omit<IUser, 'password'>
