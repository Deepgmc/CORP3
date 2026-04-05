export class StorageManager {

    private _storage: Storage

    constructor(storage: Storage){
        this._storage = storage
    }

    saveAuthData(data: object){
        try {
            this.saveRawData('authData', data)
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

    private saveRawData(name: string, data: object) {
        this._storage.setItem(name, JSON.stringify(data))
    }

    getDictName(name: string) {
        return 'dict_' + name
    }

    public setItem(name: string, data: object){
        this.saveRawData(this.getDictName(name), data)
    }

    public getItem(name: string): object | false {
        const data = this._storage.getItem(this.getDictName(name))
        if(data !== null) return JSON.parse(data)
        return false
    }
}
