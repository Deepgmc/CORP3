import { StorageManager } from '@/network/LocalStorageManager'
import NetworkManager, { EReqMethods } from '@/network/NetworkManager'
import { isSuccessRequest } from './helpers/network'

//type dictDataType = {id: number}

export default class Dictionary<T extends {id: number}> {

    private data: T[] = []
    private storageManager = new StorageManager(localStorage)
    private $nm: NetworkManager

    constructor(
        public readonly serverPath: string, // 'company/dictionary/units'
    ) {
        this.$nm = NetworkManager.getInstance()
    }

    getData(): T[] {
        return this.data
    }

    getItemById(id: number) {
        return this.getData().find((item: T) => item.id === id)
    }

    public async initData(): Promise<Dictionary<T>> {
        const storageData = this.storageManager.getItem(this.serverPath) as T[]
        if(!storageData) {
            this.data = await this.loadFromServer()
            this.storageManager.setItem(this.serverPath, this.data)
        } else {
            this.data = storageData
        }
        return this
    }

    private async loadFromServer(): Promise<T[]> {
        const res = await this.$nm.getApiRequestMethod(EReqMethods.get)('company')(`dictionary/${this.serverPath}`)()
        if (isSuccessRequest(res)) {
            return res.data
        }
        return []
    }

}
