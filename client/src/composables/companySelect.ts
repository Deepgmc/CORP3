import { Employee } from '@/entities/Employee'
import type { ICompany, ICompanySelect, IDepartment, IDeptSelect } from '@/interfaces/Company'
import type { IPosition, ISelectData } from '@/interfaces/User'
import type NetworkManager from '@/network/NetworkManager'
import { EReqMethods } from '@/network/NetworkManager'
import { getSelectOptionsFromDataArray } from '@/utils/helpers/components'
import { isSuccessRequest } from '@/utils/helpers/network'
import { onMounted, ref } from 'vue'

export type optionsResult = {
    value: number,
    label: string
}

export function useCompany($networkManager: NetworkManager) {

    let isLoaded = false
    const emptyDummy = { label: '', value: 0 }
    const comOptions = ref<ISelectData[]>()
    const deptOptions = ref<ISelectData[]>()
    const selectPositionOptions = ref<ISelectData[]>()
    const selectRefModel = ref<ICompanySelect<ICompany>>(emptyDummy)
    const selectDeptModel = ref<IDeptSelect>(emptyDummy)
    const selectPositionModel = ref<ISelectData>(emptyDummy)

    async function loadAllCompanies(): Promise<boolean> {
        if (!isLoaded) { //загружаем только один раз, это статичные данные
            const asxiosData = await $networkManager.getApiRequestMethod(EReqMethods.get)('company')('get_all')({})
            isLoaded = true
            if (typeof asxiosData !== 'boolean') {
                comOptions.value = getSelectOptionsFromDataArray<ICompany>(asxiosData.data, {
                    idField: 'companyId',
                    labelField: 'name'
                })
            }
        }
        return isLoaded
    }

    async function loadCompanyDepartments(companyId: number): Promise<IDepartment[] | boolean> {
        const asxiosData = await $networkManager.getApiRequestMethod(EReqMethods.get)('company')(`get_departments_of_company?cid=${companyId}`)({})
        if (typeof asxiosData !== 'boolean') {
            deptOptions.value = getSelectOptionsFromDataArray<IDepartment>(asxiosData.data, {
                idField: 'id',
                labelField: 'name'
            })
        }
        return false
    }
    async function loadPositions(): Promise<IPosition[] | boolean> {
        const asxiosData = await $networkManager.getApiRequestMethod(EReqMethods.get)('company')(`get_positions`)({})
        if (typeof asxiosData !== 'boolean') {
            selectPositionOptions.value = getSelectOptionsFromDataArray<IPosition>(asxiosData.data, {
                idField: 'id',
                labelField: 'position'
            })
        }
        return false
    }

    async function loadCompanyOwnerUser(companyId: number): Promise<Employee | undefined> {
        const res = await $networkManager.getApiRequestMethod(EReqMethods.get)('company')(`get_company_owner?cid=${companyId}`)({})
        if(isSuccessRequest(res)) {
            return new Employee(res.data)
        }
        return undefined
    }

    function filterFn(val: string, update: any, /*_abort: any*/) {
        update(() => {
            const needle = val.toLowerCase()
            if(comOptions.value !== undefined) {
                comOptions.value = comOptions.value.filter((com: ICompanySelect<ICompany>) => {
                return com.label.toLowerCase().indexOf(needle) > -1
            })
            }
        })
    }

    function resetCompanySelection() {
        selectRefModel.value = emptyDummy
    }

    onMounted(() => {
        loadAllCompanies()
    })

    return {
        selectRefModel,
        selectDeptModel,
        selectPositionModel,
        selectOptions: comOptions,
        selectDeptOptions: deptOptions,
        selectPositionOptions,
        filterFn,
        loadAllCompanies,
        loadCompanyDepartments,
        loadPositions,
        resetCompanySelection,
        loadCompanyOwnerUser
    }
}
