import type { ICompany, ICompanySelect, IDepartment, IDeptSelect } from '@/interfaces/Company'
import type NetworkManager from '@/network/NetworkManager'
import { EReqMethods } from '@/network/NetworkManager'
import { ref } from 'vue'

export type optionsResult = {
    value: number,
    label: string
}

export function useCompany($networkManager: NetworkManager) {

    let isLoaded = false
    const comOptions = ref([])
    const deptOptions = ref([])
    const emptyDummy = { label: '', value: 0 }
    const selectRefModel = ref<ICompanySelect<ICompany>>(emptyDummy)
    const selectDeptModel = ref<IDeptSelect>(emptyDummy)

    async function loadAllCompanies(): Promise<boolean> {
        if (!isLoaded) { //загружаем только один раз, это статичные данные
            const asxiosData = await $networkManager.getApiRequestMethod(EReqMethods.get)('company')('get_all')({}, false)
            isLoaded = true
            if (typeof asxiosData !== 'boolean') {
                comOptions.value = asxiosData.data.map((company: ICompany): optionsResult => {
                    return {
                        value: company.companyId,
                        label: company.name,
                    }
                })
            }
        }
        return isLoaded
    }

    async function loadCompanyDepartments(companyId: number): Promise<IDepartment[] | boolean> {
        const asxiosData = await $networkManager.getApiRequestMethod(EReqMethods.get)('company')(`get_departments_of_company/${companyId}`)({}, false)
        if (typeof asxiosData !== 'boolean') {
            // selectDeptModel
             deptOptions.value = asxiosData.data.map((dept: IDepartment): optionsResult => {
                return {
                    value: dept.id,
                    label: dept.name,
                }
            })
        }
        return false
    }

    function filterFn(val: string, update: any, /*_abort: any*/) {
        update(() => {
            const needle = val.toLowerCase()
            comOptions.value = comOptions.value.filter((com: ICompanySelect<ICompany>) => {
                return com.label.toLowerCase().indexOf(needle) > -1
            })
        })
    }

    function resetCompanySelection() {
        selectRefModel.value = emptyDummy
    }

    return {
        selectRefModel, selectDeptModel,
        selectOptions: comOptions,
        selectDeptOptions: deptOptions,
        filterFn,
        loadAllCompanies,
        loadCompanyDepartments,
        resetCompanySelection,
    }
}
