import type { ICompany, ICompanySelect } from '@/interfaces/Company'
import type NetworkManager from '@/network/NetworkManager'
import { EReqMethods } from '@/network/NetworkManager'
import { ref } from 'vue'

export async function useCompany($networkManager: NetworkManager | null) {

  if(!$networkManager){
    throw new Error('Wrong network manager injection!')
  }

  const model = ref(null) //company select model

  const asxiosData = await $networkManager.getApiRequestMethod(EReqMethods.get)('company')('get_all')({}, false)

  const comOptions = asxiosData.data.map((company: ICompany) => {
    return {
      value: company.companyId,
      label: company.name,
    }
  })

  const selectOptions = ref(comOptions)

  function filterFn (val: string, update: any, /*_abort: any*/) {
    update(() => {
      const needle = val.toLowerCase()
      selectOptions.value = comOptions.filter((com: ICompanySelect<ICompany>) => {
        return com.label.toLowerCase().indexOf(needle) > -1
      })
    })
  }

  return {
    selectOptions,
    selectRefModel: model,

    filterFn,
    companiesArray: asxiosData
  }
}
