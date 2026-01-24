import type { jwtStrategy } from '@/auth/strategies/jwt.strategy'
import type { isLoginedResult } from '@/auth/strategies/Strategy'
import type { ILoginUser, TRegisterForm } from "@/interfaces/User"
import type { Router } from 'vue-router'

export type TJwtToken = string

export type TAuthData = {
    access_token: TJwtToken,
    userId: number
}

export type TStrategies = jwtStrategy | null

export enum availableStrategies {
    'jwt'
}

export interface IAuthManager {

    /**
     Current strategy
     */
    _strategy: TStrategies
    //setStrategy: (s: IAuthManager['_strategy']) => void
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
