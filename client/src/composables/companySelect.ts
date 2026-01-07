import type { ICompany, ICompanySelect } from '@/interfaces/Company'
import type NetworkManager from '@/network/NetworkManager'
import { EReqMethods } from '@/network/NetworkManager'
import { ref } from 'vue'

export function useCompany($networkManager: NetworkManager | null) {

  let isLoaded = false
  const comOptions = ref([])
  const emptyDummy = {label: '', value: 0}
  const selectRefModel = ref<ICompanySelect<ICompany>>(emptyDummy)

  async function loadAllCompanies(): Promise<void>{
    if($networkManager === null){
      throw new Error('Wrong network manager injection!')
    }
    if(!isLoaded){ //загружаем только один раз, это статичные данные
      const asxiosData = await $networkManager.getApiRequestMethod(EReqMethods.get)('company')('get_all')({}, false)
      isLoaded = true
      comOptions.value = asxiosData.data.map((company: ICompany) => {
        return {
          value: company.companyId,
          label: company.name,
        }
      })
    }
  }

  function filterFn (val: string, update: any, /*_abort: any*/) {
    update(() => {
      const needle = val.toLowerCase()
      comOptions.value = comOptions.value.filter((com: ICompanySelect<ICompany>) => {
        return com.label.toLowerCase().indexOf(needle) > -1
      })
    })
  }

  function resetCompanySelection(){
    selectRefModel.value = emptyDummy
  }

  return {
    selectRefModel,
    selectOptions: comOptions,
    filterFn,
    loadAllCompanies,
    resetCompanySelection,
  }
}
