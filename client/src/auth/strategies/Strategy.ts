import type { ILoginUser } from '../../interfaces/User'
import { StorageManager } from '@/network/LocalStorageManager'
import { type TAuthData } from '@/interfaces/Auth'


export abstract class Strategy {

    static storageManager = new StorageManager(localStorage)

    constructor(){}

    abstract login(loginData: ILoginUser): Promise<any>

    abstract isLogined(): Promise<boolean>

    setAuthStoragedData(data: TAuthData): boolean{
        return Strategy.storageManager.saveAuthData(data)
    }
    static getAuthStoragedData(): TAuthData{
        return Strategy.storageManager.getAuthData()
    }
    removeAuthStoragedData(): boolean{
        return Strategy.storageManager.removeAuthData()
    }
}
