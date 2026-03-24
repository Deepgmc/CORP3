export interface IUser {
    userId      : number,
    username    : string,
    password    : string,
    birth       : number,          //timestamp
    reg_date    : number,          //timestamp
    hire_date   : number,          //timestamp
    fire_date   : number,          //timestamp
    email       : string,
    companyId   : number | null,
    departmentId: number | null,
    isDirector  : boolean,
    gender      : number,
    bio         : string;
    firstName   : string,
    lastName    : string,
    phone       : string,

    skills?: TSkill[]
}

export type TSkill = {
    id         : number,
    skillUserId: number,
    skill      : string
}

export interface IVacation {
    id                ?:number,
    dateFrom          : number,
    dateTo            : number,
    isMedical         : boolean,
    userId            : TUserId
}
export type IVacationCreateDTO = Omit<IVacation, 'id'>

export type TUserId = IUser['userId'];

export type ILoginUser = Pick<IUser, 'username' | 'password'>

//тип для формы смены пароля
export interface ICPForm extends Pick<IUser, 'username' | 'userId'> {
    password: string,
    newPassword: string
}

export interface TRegisterForm extends Pick<IUser, 'username' | 'password' | 'email' | 'birth'> {
    passwordConfirm: string,
}

export type IUsersCreateDTO = Omit<IUser, 'userId'>
export type IUsersUpdateDTO = Partial<IUser>
export type TUserWithoutPassword = Omit<IUser, 'password'>
