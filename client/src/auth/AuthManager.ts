
import { availableStrategies, type IAuthManager } from '@/interfaces/Auth'

import type { TStrategies } from '@/interfaces/Auth'
import type { ILoginUser, TRegisterForm } from '../../../interfaces/User'
import NetworkManager, { EReqMethods } from '@/network/NetworkManager'
import type { TAuthRenponse } from '@/interfaces/Error'

export class AuthManager implements IAuthManager {

    public availableStrategies = availableStrategies

    _strategy: TStrategies = null
    _authStore

    private _isLogined: boolean = false //авторизация, любыми стратегиями
    networkManager: NetworkManager

    static instance: AuthManager | null = null
    static getInstance (
        strategy?: IAuthManager['_strategy'],
        authStore?: any
    ): AuthManager {
        if(AuthManager.instance) {
            return AuthManager.instance
        }
        return new AuthManager(strategy, authStore)
    }

    private _apiModule: string = 'auth'
    private _postData: (action: string) => any

    private constructor (
        strategy?: IAuthManager['_strategy'],
        authStore?: any
    ){
        if(AuthManager.instance) throw new TypeError('Instance creation only with .getInstance()')
        AuthManager.instance = this
        if(strategy) this._strategy = strategy
        this._authStore = authStore
        this.networkManager = NetworkManager.getInstance()
        this._postData = this.networkManager.getApiRequestMethod(EReqMethods.post)(this._apiModule)

        //при создании менеджера проверяем статус логина и разлогиниваем/убираем, если токен остался по какойто-причине старый
        void this.updateAndGetIsLogined()
    }

    async registerRequest(registerData: TRegisterForm): Promise<TAuthRenponse>{
      if(this.isLogined) return {error: true, message: 'Вы уже авторизованы' }
      return await this._postData('register')(registerData, false)
    }

    /**
     * Depends on strategy: logins current user, saving authorisation data
     * @returns saved login status or no
    */
    async loginRequest(loginData: ILoginUser): Promise<TAuthRenponse> {
        if(this.isLogined) return {error: true, message: 'Вы уже авторизованы в системе' }
        if(!this._strategy) return {error: true, message: 'Invalid login strategy' }

        const loginRes = await this._strategy.login(loginData)

        if(!loginRes.error) {
            this._isLogined = true
            this._authStore.setIsLogined(true)
        }

        return loginRes
    }

    get isLogined(){
        return this._isLogined
    }
    set isLogined(someFailParameter){
        throw new ReferenceError('Cant set isLogined directly')
    }

    async updateAndGetIsLogined(): Promise<boolean> {
        if(!this._strategy) {
            this.logOut()
            return false
        }
        let isLogined = false

        isLogined = await this._strategy.isLogined()
        this._isLogined = isLogined
        this._authStore.setIsLogined(this._isLogined)
        if(!this._isLogined) this.logOut()
        return this._isLogined
    }

    logOut(): boolean {
        if(!this._strategy || this._isLogined) return true
        this._strategy.logOut()
        this._authStore.setIsLogined(false)
        this._isLogined = false
        return true
    }
}

// export default {
//     install: (app: AppType) => {
//         console.info('Auth manager as plugin instance created')
//         const am = AuthManager.getInstance( new jwtStrategy(), useAuthStore())
//         app.config.globalProperties.$authManager = am
//         app.provide('$authManager', am )
//     }
// }
