export type TResult = TError | TSuccess

export interface TError {
    error       : true,
    errorMessage: string
}
export interface TSuccess {
    error: false,
    res  : any
}

export type TAuthRenponse = {
  error   : boolean,
  data   ?: any
  message?: string,
  errCode?: string,
}
