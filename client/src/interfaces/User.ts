import type { ICompany, IDepartment, IPosition } from './Company'
import type { jwtStrategy } from '@/auth/strategies/jwt.strategy'
import type { isLoginedResult } from '@/auth/strategies/Strategy'
import type { Router } from 'vue-router'

export interface IUser {
    userId      : number,
    username    : string,
    birth       : number,          //timestamp
    email       : string,
    companyId   : number | null,
    isDirector  : boolean,
    gender      : number,
    bio         : string;
    firstName   : string,
    lastName    : string,
    phone       : string,
    departmentId: number | null,
    positionId  : number | null,
    avatar      : string | null,

    //! RELATIONS
    company   : ICompany | null,
    skills    : TSkill[],
    department: IDepartment | null,
    position  : IPosition | null
}

export interface ILoginUser extends Pick<IUser, 'username'> {
    password: string,
}

export type TSkill = {
    id         : number,
    skillUserId: number,
    skill      : string
}

//тип для формы смены пароля
export interface ICPForm extends Pick<IUser, 'username' | 'userId'> {
    password: string,
    newPassword: string
}

export interface TRegisterForm extends Pick<IUser, 'username' | 'email' | 'birth' | 'companyId' | 'isDirector' | 'departmentId' | 'positionId' | 'bio' > {
    passwordConfirm: string,
    password: string,
}

export type TUserId = IUser['userId'];

export type IUsersCreateDTO = Omit<IUser, 'userId'>
export type IUsersUpdateDTO = Partial<IUser>
export type TUserWithoutPassword = Omit<IUser, 'password'>




export type TJwtToken = string

export type TAuthData = {
    access_token: TJwtToken,
    userId: number
}

export type TStrategies = jwtStrategy | null

export enum availableStrategies {
    'jwt'
}

export interface IUserManager {

    /**
     Current strategy
     */
    _strategy: TStrategies
    //setStrategy: (s: IUserManager['_strategy']) => void
    /**
     * What types of strategies we have
     */
    availableStrategies: typeof availableStrategies

    /**
     * Определяет директор ли текущий юзер или нет
     */
    isDirector(): boolean

    /**
     * Обратное к isDirector. Оставлено на будущее, возможно будет больше "типов"
     */
    isEmployee(): boolean

    /**
     * User registration. Sends query to a server
     */
    registerRequest: (registerData: TRegisterForm) => Promise<any>

    /**
     * User login. Sends Query to a server
     * @param username
     * @param password
     * @returns
     */
    loginRequest: (loginData: ILoginUser) => Promise<any>

    /**
     * SHORT client-side status logined or not. Unsafe - do not checks the server
     */
    loginedStatus: isLoginedResult

    /**
     * checks AND UPDATES isLogin status
     */
    updateAndGetIsLogined(): Promise<isLoginedResult>

    /**
     * Выйти из системы, удалив авторизационные данные из стора
     * @returns успех разлогирования
     */
    logOut: () => boolean

    /**
     * Знает что делать с редиректом роута после логина
     * @returns void
     */
    setRouteAfterLogin: (router: Router) => void
}
