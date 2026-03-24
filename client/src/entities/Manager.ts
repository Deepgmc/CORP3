import type { TResult } from "@/interfaces/Error"
import NetworkManager, { EReqMethods } from "@/network/NetworkManager"
import { UNKNOWN_ERROR } from "@/utils/constants/texts"
import { isSuccessRequest } from "@/utils/helpers/network"

export default class Manager {

    protected _apiModule: string = ''
    protected networkManager: NetworkManager

    protected _postData!  : (module: string) => any
    protected _getData!   : (module: string) => any
    protected _deleteData!: (module: string) => any
    protected _patchData! : (module: string) => any

    constructor(){
        this.networkManager = NetworkManager.getInstance()
    }

    protected initNetwork(apiModule: string) {
        this._apiModule = apiModule
        this._postData   = this.networkManager.getApiRequestMethod(EReqMethods.post)(this._apiModule)
        this._getData    = this.networkManager.getApiRequestMethod(EReqMethods.get)(this._apiModule)
        this._deleteData = this.networkManager.getApiRequestMethod(EReqMethods.delete)(this._apiModule)
        this._patchData  = this.networkManager.getApiRequestMethod(EReqMethods.patch)(this._apiModule)
    }

    protected getModel() {
        throw new Error('Вызов только из наследников')
    }

    protected async saveModel(): Promise<TResult> { //возвращаем сохранённый новый id
        const saveRes = await this._postData('save_model')(this.getModel())
        if(isSuccessRequest (saveRes) && saveRes.data.id) {
            return { error: false, res: { id: saveRes.data.id } }
        }
        return { error: true, errorMessage: UNKNOWN_ERROR }
    }

    protected async delete(id: number): Promise<boolean> {
        if(!Number.isInteger(id)) return false
        const res = await this._deleteData(`delete/${id}`)()
        if(isSuccessRequest (res)){
            return !!res.data.affected
        }
        return false
    }
}
