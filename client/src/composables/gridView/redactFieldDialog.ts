import NetworkManager, { EReqMethods } from "@/network/NetworkManager";
import { isSuccessRequest } from "@/utils/helpers/network";
import type { AxiosResponse } from "axios";
import { ref, type Ref } from "vue";

export type TEditTypes = "text" | "textarea" | "number" | "date"

type TSettings = {
    val        : string,
    itemId     : string,
    fieldName  : string,
    module     : string,
    action     : string,
    HTMLElement: HTMLElement | null,
    fieldType  : TEditTypes,
}
export type TSavingSettings = Omit<TSettings, 'fieldType' | 'HTMLElement'>

export type gvType = {
    isOpenedGV : Ref<boolean>,
    gvSettings : Ref<TSettings>,
    openGV     : (newSettings: TSettings) => void
    closeGV    : () => Promise<null>
    saveNewData: (newSettings: TSavingSettings) => Promise<boolean>
}

const isOpenedGV = ref<boolean>(false)

const gvSettings: Ref<TSettings> = ref({
    val      : '',
    itemId   : '',
    fieldName: '',
    module   : '',
    action   : '',
    HTMLElement: null,
    fieldType: 'text',
})

export function useGVDialog(): gvType {

    function openGV(newSettings: TSettings){
        gvSettings.value = newSettings
        isOpenedGV.value = true
    }

    function closeGV(): Promise<null> {
        isOpenedGV.value = false
        return Promise.resolve(null)
    }

    async function saveNewData (savingData: TSavingSettings): Promise<boolean> {
        const $networkManager = NetworkManager.getInstance()
        const res: AxiosResponse | boolean = await $networkManager.getApiRequestMethod(EReqMethods.post)(savingData.module)(`gv_${savingData.action}`)({data: savingData}, true)
        if(typeof res === 'boolean') return false
        return isSuccessRequest(res)
    }

    return {
        isOpenedGV,
        gvSettings,

        openGV,
        closeGV,
        saveNewData,
    }
}
