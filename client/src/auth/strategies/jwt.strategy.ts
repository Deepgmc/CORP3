import {type TJwtToken } from '@/interfaces/Auth'

import { Strategy } from './Strategy';
import { RESPONSE_STATUS_CODES } from '@/constants';
import type { ILoginUser } from '../../../../interfaces/User';
//import NetworkManager from '@/network/NetworkManager';
import { AuthManager } from '../AuthManager';

//const $networkManager = NetworkManager.getInstance()

export class jwtStrategy extends Strategy {

    private _apiSection: string = 'auth'
    // private _postData: (authManager: AuthManager) => any
    // private _getData: (authManager: AuthManager) => any

    constructor(){
        super()
        // this._postData = $networkManager.applyNetworkMethod('post', this._apiSection)
        // this._getData = $networkManager.applyNetworkMethod('get', this._apiSection)
    }

    /**
     * Login via default JWT strategy
     * @param username User login
     * @param password
     * @returns Is user logined success or no
    */
    async login(loginData: ILoginUser): Promise<any> {
        const $authManager = AuthManager.getInstance()
        try{
            const loginRes = await this._postData($authManager)('login')(loginData)
            if(loginRes.status === RESPONSE_STATUS_CODES.CREATED){
                this.setAuthStoragedData({access_token: loginRes.data.access_token})
                return true
            }
            return loginRes //axios error
        } catch(loginError){
            return loginError
        }
    }

    logOut(): boolean {
        return this.removeAuthStoragedData()
    }

    /**
     * Is strategy has an authorisation
     * @returns boolean
     */
    async isLogined() {
        let isLogined: boolean = false
        isLogined = await this.checkServerStrategyStatus()
        return isLogined
    }

    /**
     * Checks the server token
     * @returns whether token valid or not
     */
    async checkServerStrategyStatus() {
        let isLogined = false
        const checkData = await this._getData(AuthManager.getInstance())('check_token')()
        if(checkData.status === RESPONSE_STATUS_CODES.SUCCESS){
            isLogined = true
        }
        if(checkData.error && checkData.error.status === RESPONSE_STATUS_CODES.UNAUTHORIZED){
            isLogined = false
        }
        return isLogined
    }

    set token(token: TJwtToken) {
        throw new ReferenceError('Can not set token directly')
    }
    get token(): TJwtToken {
        const authData = this.getAuthStoragedData()
        if(!authData) return null
        if(typeof authData.access_token !== 'undefined'){
            return authData.access_token
        }
        return null
    }
}
