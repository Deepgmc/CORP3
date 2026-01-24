import type { ICompany } from "./Company";

export interface IUser {
    userId: number,
    username: string,
    birth: number,          //timestamp of a birth
    email: string,
    companyId: number | null,
    isDirector: boolean,
    gender: number,
    bio: string;
    firstName: string,
    lastName: string,
    phone: string,

    company: ICompany | null //relation
}

export interface ILoginUser extends Pick<IUser, 'username'> {
    password: string,
}

export interface TRegisterForm extends Pick<IUser, 'username' | 'email' | 'birth' | 'companyId' | 'isDirector'> {
    passwordConfirm: string,
    password: string,
}

export type TUserId = IUser['userId'];

export type IUsersCreateDTO = Omit<IUser, 'userId'>
export type IUsersUpdateDTO = Partial<IUser>
export type TUserWithoutPassword = Omit<IUser, 'password'>
