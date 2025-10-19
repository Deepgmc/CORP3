import type { TJwtToken } from '@/interfaces/Auth'
import axios from 'axios'
import type {AxiosResponse} from 'axios'
import type { /*AxiosInstance,*/ Axios, /*AxiosRequestConfig*/ /*AxiosResponse*/ } from 'axios'

export type HttpClientTypes = Axios

export enum EReqMethods {
  get    = 'get',
  post   = 'post',
  delete = 'delete',
  put    = 'put',
  patch  = 'patch',
}

export default class NetworkManager {

  static instance: NetworkManager | null = null

  private httpClient: HttpClientTypes

  static getInstance(): NetworkManager {
    if(NetworkManager.instance) return NetworkManager.instance
    return new NetworkManager()
  }

  private constructor(){
    if(NetworkManager.instance) { throw new TypeError('NetworkManager singleton creation only with .getInstance()') }

    NetworkManager.instance = this

    this.httpClient = axios.create({
      //baseURL: import.meta.env.DEV ? import.meta.env.VUE_APP_API_URL : 'NEED_PROD_URL',
      baseURL: 'http://localhost:5173/api',
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
      timeout: 1000,
    })
  };

  // $axios.interceptors.request.use(function(config) {
  //   config.headers['Authorization'] = 'Bearer ' + store.state.token
  //   return config
  // })

  getApiRequestMethod (method: EReqMethods) {
    return (module: string) => {
      return (action: string) => {
        return async (parameters: object | null): Promise<AxiosResponse> => {
            return this.httpClient[method](`${module}/${action}`, parameters)
        }
      }
    }
  }



  /**
  if(unauthorized){
      this.applyAuthorization('TOKEN')
    }
    return async () => {
      try {
        const res = await this.httpClient[schema.method](path, {params: parameters})
        return res
      } catch (e: any){
        console.log('e:', e)
      }
    }
  */

  applyAuthorization(token: TJwtToken){
      this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

}
