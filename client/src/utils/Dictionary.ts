import { StorageManager } from '@/network/LocalStorageManager'
import NetworkManager, { EReqMethods } from '@/network/NetworkManager'
import { isSuccessRequest } from './helpers/network'

type dictDataType = {id: number}

export default class Dictionary {

    private data: dictDataType[] = []
    private storageManager = new StorageManager(localStorage)
    private $nm: NetworkManager

    constructor(
        public readonly serverPath: string, // 'company/dictionary/units'
    ) {
        this.$nm = NetworkManager.getInstance()
    }

    getData() {
        return this.data
    }

    public async initData(): Promise<Dictionary> {
        const storageData = this.storageManager.getItem(this.serverPath) as dictDataType[]
        if(!storageData) {
            this.data = await this.loadFromServer()
            //this.storageManager.setItem(this.serverPath, this.data)
        } else {
            this.data = storageData
        }
        return this
    }

    private async loadFromServer(): Promise<dictDataType[]> {
        const res = await this.$nm.getApiRequestMethod(EReqMethods.get)('company')(`dictionary/${this.serverPath}`)()
        if (isSuccessRequest(res)) {
            return res.data
        }
        return []
    }

}
