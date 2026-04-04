import { jwtStrategy } from '@/auth/strategies/jwt.strategy'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
import type { Axios, AxiosRequestConfig } from 'axios'
import { UNKNOWN_ERROR } from '@/utils/constants/texts'
import { RESPONSE_STATUS_CODES } from '@/utils/constants'

export type HttpClientTypes = Axios

export enum EReqMethods {
    get    = 'get',
    post   = 'post',
    delete = 'delete',
    put    = 'put',
    patch  = 'patch',
}

const notify = useNotify()


export default class NetworkManager {

    static instance: NetworkManager
    private httpClient: HttpClientTypes

    static getInstance(): NetworkManager {
        if (!NetworkManager.instance) new NetworkManager()
        return NetworkManager.instance
    }

    private constructor() {

        NetworkManager.instance = this

        this.httpClient = axios.create({
            //baseURL: import.meta.env.DEV ? import.meta.env.VUE_APP_API_URL : 'NEED_PROD_URL',
            baseURL: 'http://localhost:5173/api',
            timeout: 1000,
            //baseURL: 'http://localhost:3050/api',
        })
    };

    private applyAuthorization(): void {
        this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${jwtStrategy.token}`;
    }

    //console.log(`%c NM: authenticated request = ${module}/${action}`, 'background:rgb(27, 122, 35); color: #bfc231; padding: 4px;')
    getApiRequestMethod(method: EReqMethods) {
        //каррировано, чтоб в каждом модуле подготавливать наборы методов к своему модулю
        this.applyAuthorization()
        return (module: string) => {
            return (action: string) => {
                return async (parameters?: AxiosRequestConfig): Promise<AxiosResponse> => {
                    return this.httpClient[method](`${module}/${action}`, parameters)
                        .catch((err) => {
                            return this.handleError(err)
                        })
                }
            }
        }
    }

    handleError(err: any) {
        if(axios.isAxiosError(err)) {
            return this.handleAxiosError(err)
        } else {
            notify.run(UNKNOWN_ERROR, notifyTypes.err)
        }
        return err
    }

    handleAxiosError(err: any) {
        if(err.response){
            //"нормальный" ответ сервера, но код ошибки не 200
            if(err.response.data.statusCode !== RESPONSE_STATUS_CODES.UNAUTHORIZED) {
                notify.run(this.warnPrefix + err.response.data.message, notifyTypes.err)
            }
        }
        return err
    }

    private warnPrefix = 'NetworkManager: '
}
