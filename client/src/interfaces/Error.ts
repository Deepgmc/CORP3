export type TResult<T> = TError | TSuccess<T>

export interface TError {
    error       : true,
    errorMessage: string
}
export interface TSuccess<T> {
    error: false,
    res  : T
}

export type TAuthRenponse = {
  error   : boolean,
  data   ?: any
  message?: string,
  errCode?: string,
}
