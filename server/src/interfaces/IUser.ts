export interface IUser {
    userId    : number,
    username  : string,
    password  : string,
    birth     : number, //timestamp
    email     : string,
    companyId : number | null,
    isDirector: boolean,
    gender    : number,
    bio       : string;
    firstName : string,
    lastName  : string,
    phone     : string,
}

export type TUserId = IUser['userId'];

export type ILoginUser = Pick<IUser, 'username' | 'password'>

export interface TRegisterForm extends Pick<IUser, 'username' | 'password' | 'email' | 'birth'> {
    passwordConfirm: string,
}

export type IUsersCreateDTO = Omit<IUser, 'userId'>
export type IUsersUpdateDTO = Partial<IUser>
export type TUserWithoutPassword = Omit<IUser, 'password'>
