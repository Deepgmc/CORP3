import { type TJwtToken } from '@/interfaces/Auth'
import { Strategy, type isLoginedResult } from '@/auth/strategies/Strategy';
import { RESPONSE_STATUS_CODES } from '@/constants';
import type { ILoginUser } from '../../interfaces/User';
import NetworkManager, { EReqMethods } from '@/network/NetworkManager';
import type { TAuthRenponse } from '@/interfaces/Error';


export class jwtStrategy extends Strategy {

  private _apiModule: string = 'auth'
  private _postData: (action: string) => any
  private _getData: (action: string) => any

  constructor(
    private networkManager: NetworkManager
  ) {
    super()
    this._postData = this.networkManager.getApiRequestMethod(EReqMethods.post)(this._apiModule)
    this._getData = this.networkManager.getApiRequestMethod(EReqMethods.get)(this._apiModule)
  }

  /**
   * Login via default JWT strategy
   * @param username User login
   * @param password
   * @returns Is user logined success or no
  */
  async login(loginData: ILoginUser): Promise<TAuthRenponse> {
    try {
      const loginRes = await this._postData('login')(loginData, false)
      if (loginRes.status === RESPONSE_STATUS_CODES.CREATED) {
        this.setAuthStoragedData({
          access_token: loginRes.data.access_token,
          userId: loginRes.data.user.userId
        })
        return { error: false, message: 'Успешная авторизация', data: loginRes.data }
      }
      return { error: true, message: loginRes.message }
    } catch (loginError: any) {
      return { error: true, message: loginError.response.data.message } //axios error
    }
  }

  logOut(): boolean {
    return this.removeAuthStoragedData()
  }

  /**
   * Is strategy has an authorisation
   * @returns whether token valid or not
   */
  async isLogined(): Promise<isLoginedResult> {
    let isLogined = false
    try {
      const checkData = await this._getData('check_token')()
       if (checkData.status === RESPONSE_STATUS_CODES.SUCCESS && checkData.data.logined) {
        isLogined = true
      } else if (checkData.error && checkData.error.status === RESPONSE_STATUS_CODES.UNAUTHORIZED) {
        isLogined = false
      }
      return {isLogined: isLogined, userId: checkData.userId}
    } catch {
      //в случае любой ошибки - проверка логина проваливается
      return {isLogined: false}
    }
  }

  static get token(): TJwtToken {
    const authData = jwtStrategy.getAuthStoragedData()
    if (!authData) return ''
    if (typeof authData.access_token !== 'undefined') {
      return authData.access_token
    }
    return ''
  }

  static get userId(): number {
    const authData = jwtStrategy.getAuthStoragedData()
    if (authData && !authData.access_token) return 0
    if (authData && typeof authData.userId !== 'undefined') {
      return authData.userId
    }
    return 0
  }

  isHasToken() {
    return !!jwtStrategy.token
  }
}
