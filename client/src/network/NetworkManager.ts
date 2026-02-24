import { UserManager } from '@/entities/UserManager'
import { jwtStrategy } from '@/auth/strategies/jwt.strategy'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { /*AxiosInstance,*/ Axios, AxiosRequestConfig /*AxiosResponse*/ } from 'axios'

export type HttpClientTypes = Axios

export enum EReqMethods {
    get    = 'get',
    post   = 'post',
    delete = 'delete',
    put    = 'put',
    patch  = 'patch',
}

export default class NetworkManager {

    static instance: NetworkManager

    private httpClient: HttpClientTypes

    static getInstance(): NetworkManager {
        if (!NetworkManager.instance) new NetworkManager()
        return NetworkManager.instance
    }

    private constructor() {
        //if(NetworkManager.instance) { throw new TypeError('NetworkManager singleton creation only with .getInstance()') }

        NetworkManager.instance = this

        this.httpClient = axios.create({
            //baseURL: import.meta.env.DEV ? import.meta.env.VUE_APP_API_URL : 'NEED_PROD_URL',
            baseURL: 'http://localhost:5173/api',
            timeout: 1000,
            // url: '/user',
            // method: 'get',
            // transformRequest: [function (data, headers) {
            //   Do whatever you want to transform the data

            //   return data;
            // }],
            // params: {
            //   ID: 12345
            // },
            // data: {
            //   firstName: 'Fred'
            // },
            // auth: {
            //   username: 'janedoe',
            //   password: 's00pers3cret'
            // },
            // proxy: {
            //   protocol: 'https',
            //   host: '127.0.0.1',
            //   port: 9000,
            //   auth: {
            //     username: 'mikeymike',
            //     password: 'rapunz3l'
            //   }
            // },

            //baseURL: 'http://localhost:3050/api',
            //headers: {'Authorization': 'Bearer XXXXX'},
            //this.httpClient.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        })
    };

    // $axios.interceptors.request.use(function(config) {
    //   config.headers['Authorization'] = 'Bearer ' + store.state.token
    //   return config
    // })

    private applyAuthorization(userManager: UserManager) {
        if (userManager._strategy && userManager._strategy.isHasToken()) {
            this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${jwtStrategy.token}`;
            return true
        }
        return false
    }

    getApiRequestMethod(method: EReqMethods) {
        return (module: string) => {
            return (action: string) => {
                return async (
                    parameters?: AxiosRequestConfig,
                    withAuth: boolean = true // нужно ли для запроса посылать токен авторизации или это обычный справочный запрос
                ): Promise<AxiosResponse | boolean> => {
                    if (withAuth) {
                        console.log(`%c NM: authenticated request = ${module}/${action}`, 'background:rgb(27, 122, 35); color: #bfc231; padding: 4px;')
                        if (!this.applyAuthorization(UserManager.getInstance())) {
                            console.warn('Apply authorization failed at NetworkManager')
                            return false
                        }
                    } else {
                        console.log(`${module}/${action} without auth`)
                    }
                    try {
                        return this.httpClient[method](`${module}/${action}`, parameters)
                    } catch {
                        console.warn('NM catch')
                        return false
                    }
                }
            }
        }
    }

}
