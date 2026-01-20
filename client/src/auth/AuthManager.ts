
import { availableStrategies, type IAuthManager } from '@/interfaces/Auth'

import type { TStrategies } from '@/interfaces/Auth'
import type { ILoginUser, TRegisterForm } from '@/interfaces/User'
import NetworkManager, { EReqMethods } from '@/network/NetworkManager'
import type { TAuthRenponse } from '@/interfaces/Error'
import { jwtStrategy } from './strategies/jwt.strategy'
import type { Router } from 'vue-router'
import type { isLoginedResult } from './strategies/Strategy'

export class AuthManager implements IAuthManager {

  public availableStrategies = availableStrategies

  _strategy: TStrategies = null
  _authStore

  private _isLogined: isLoginedResult = {isLogined: false} //авторизация, любыми стратегиями

  networkManager: NetworkManager

  static instance: AuthManager | null = null
  static getInstance(
    strategy?: IAuthManager['_strategy'],
    authStore?: any
  ): AuthManager {
    if (AuthManager.instance) {
      return AuthManager.instance
    }
    return new AuthManager(strategy, authStore)
  }

  private _apiModule: string = 'auth'
  private _postData: (action: string) => any

  private constructor(
    strategy?: IAuthManager['_strategy'],
    authStore?: any
  ) {
    if (AuthManager.instance) throw new TypeError('Instance creation only with .getInstance()')
    AuthManager.instance = this
    if (strategy) this._strategy = strategy
    this._authStore = authStore
    this.networkManager = NetworkManager.getInstance()
    this._postData = this.networkManager.getApiRequestMethod(EReqMethods.post)(this._apiModule)

    //при создании менеджера проверяем статус логина и разлогиниваем/убираем, если токен остался по какойто-причине старый
    void this.updateAndGetIsLogined().then(() => {
      //после проверки статуса сессии (токена) - загружаем данные юзера
      if(this.loginedStatus.isLogined){
        this._authStore.loadUserData()
      }
    })
  }

  static isLoginedByJWTToken(): boolean {
    const token = jwtStrategy.token
    return !!token
  }

  static getJWTUserID(): number {
    return jwtStrategy.userId
  }

  async registerRequest(registerData: TRegisterForm): Promise<TAuthRenponse> {
    if (this._isLogined.isLogined) return { error: true, message: this.ALREADY_AUTHORISED_MSG }
    return await this._postData('register')(registerData, false)
  }

  get user () {
    return this._authStore.user
  }

  /**
   * Depends on strategy: logins current user, saving authorisation data
   * @returns saved login status or no
  */
  async loginRequest(loginData: ILoginUser): Promise<TAuthRenponse> {
    if (this._isLogined.isLogined) return { error: true, message: this.ALREADY_AUTHORISED_MSG }
    if (!this._strategy) return { error: true, message: 'Invalid login strategy' }

    const loginRes = await this._strategy.login(loginData)

    if (!loginRes.error) {
      this._isLogined = {isLogined: true, userId: loginRes.data.user.userId}
      //при логине юзер ставится из ответа авторизации, в дальнейшем, при обновлении страницы - отдельным запросом из App
      this._authStore.setUser(loginRes.data.user)
    }

    return loginRes
  }

  get loginedStatus(): isLoginedResult {
    return this._isLogined
  }
  set loginedStatus(_someFailParameter) {
    throw new ReferenceError('Cant set isLogined directly')
  }

  /** Обновляет статус авторизации при обновлении страницы */
  async updateAndGetIsLogined(): Promise<isLoginedResult> {
    if (!this._strategy) {
      this.logOut()
      return {isLogined: false}
    }
    this._isLogined = await this._strategy.isLogined()
    return this._isLogined
  }

  logOut(): boolean {
    if (!this._strategy) return true
    this._strategy.logOut()
    this._isLogined = {isLogined: false}
    return true
  }

  setRouteAfterLogin(router: Router): void {
    router.push({ name: 'main' })
  }
  setRouterAfterLogOut(router: Router): void {
    router.push({ name: 'login' })
  }

  private ALREADY_AUTHORISED_MSG = 'Вы уже авторизованы в системе'
}
