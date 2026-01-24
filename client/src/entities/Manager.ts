import NetworkManager, { EReqMethods } from "@/network/NetworkManager"

export default class Manager {

    protected _apiModule: string = ''
    protected networkManager: NetworkManager
    protected _post: (action: string) => any
    protected _get: (action: string) => any

    protected _postData!: (module: string) => any
    protected _getData!: (module: string) => any

    constructor(){
        this.networkManager = NetworkManager.getInstance()
        this._post = this.networkManager.getApiRequestMethod(EReqMethods.post)
        this._get = this.networkManager.getApiRequestMethod(EReqMethods.get)
    }
}
