import { type IDepartment, type ICompany } from "@/interfaces/Company"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useCompanyStore = defineStore('company', () => {
    /**
     ref() становятся свойствами состояния
     computed() становятся геттерами
     function() становятся действиями
    */

    const company = ref<ICompany>(companyDummy)

    const departments = ref<IDepartment[]>([])

    function setCompany(newCompany: ICompany): boolean {
        company.value = newCompany
        return true
    }

    function setDepartments(newDepts: IDepartment[]): void {
        departments.value = newDepts
    }

    function addNewDepartment(newDept: IDepartment): void {
        departments.value.push(newDept)
    }

    return {
        company,
        departments,
        setCompany,
        setDepartments,
        addNewDepartment,
    }
})

export const companyDummy: ICompany = {
    companyId: 0,
    name     : '',
    address  : ''
}
