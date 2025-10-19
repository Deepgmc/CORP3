export class StorageManager {

    private _storage: Storage

    constructor(storage: Storage){
        this._storage = storage
    }

    saveAuthData(data: object){
        try {
            this._storage.setItem('authData', JSON.stringify(data))
            return true
        } catch {
            return false
        }
    }

    getAuthData(){
        const data = this._storage.getItem('authData')
        if(data === null) return null
        return JSON.parse(data)
    }

    removeAuthData(): boolean{
        this._storage.removeItem('authData')
        return true
    }
}
