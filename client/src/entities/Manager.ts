import { notifyTypes, useNotify } from "@/composables/notifyQuasar"
import type { TResult } from "@/interfaces/Error"
import NetworkManager, { EReqMethods } from "@/network/NetworkManager"
import { SAVED_SUCCESS, UNKNOWN_ERROR } from "@/utils/constants/texts"
import { isAffected, isSuccessRequest } from "@/utils/helpers/network"
const notify = useNotify()

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

    public async saveModel(): Promise<TResult<{id: number}>> { //возвращаем сохранённый новый id
        try {
            const saveRes = await this._postData('save_model')(this.getModel())
            if(isSuccessRequest (saveRes) && saveRes.data.id) {
                notify.run(SAVED_SUCCESS, notifyTypes.succ)
                return { error: false, res: { id: saveRes.data.id } }
            }
            return { error: true, errorMessage: UNKNOWN_ERROR }
        } catch (e: unknown) {
            let msg = UNKNOWN_ERROR
            if(e instanceof Error) msg = e.message
            else if(typeof e === 'string') msg = e
            notify.run(msg, notifyTypes.err)
            return { error: true, errorMessage: msg }
        }
    }

    protected async delete(id: number): Promise<boolean> {
        if(!Number.isInteger(id)) return false
        const res = await this._deleteData(`delete/${id}`)()
        return isSuccessRequest(res) && isAffected(res).one()
    }
}
