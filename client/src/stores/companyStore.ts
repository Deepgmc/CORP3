import { type IDepartment, type ICompany } from "@/interfaces/Company"
import type { IUser } from "@/interfaces/User"
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
    const employees = ref<IUser[]>([])

    function setCompany(newCompany: ICompany): boolean {
        company.value = newCompany
        return true
    }

    function setDepartments(newDepts: IDepartment[]): void {
        departments.value = newDepts
    }
    function setEmployees(newEmployees: IUser[]): void {
        employees.value = newEmployees
    }

    function addNewDepartment(newDept: IDepartment): void {
        departments.value.push(newDept)
    }

    function deleteDepartment(depertmentId: number): void {
        departments.value.splice(departments.value.findIndex(dept => dept.id === depertmentId), 1)
    }

    return {
        company,
        departments,
        employees,

        setCompany,
        setDepartments,
        setEmployees,
        addNewDepartment,
        deleteDepartment,
    }
})

export const companyDummy: ICompany = {
    companyId: 0,
    name     : '',
    address  : ''
}
