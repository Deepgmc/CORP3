import type { sortOrders } from "@/components/grid/GridCols"
import { type IDepartment, type ICompany } from "@/interfaces/Company"
import type { IUser } from "@/interfaces/User"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

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

    function deleteDepartment(depertmentId: number): boolean {
        if(!Number.isInteger(depertmentId)) return false
        departments.value.splice(departments.value.findIndex(dept => dept.id === depertmentId), 1)
        return true
    }

    const getDepartments = computed(() => {
        return departments
    })
    const getEmployees = computed(() => {
        return employees
    })

    // при смене департамента у сотрудника - меняем сумму сотрудников в списке департаментов
    // с сервера это значение приходит из count(*) sql, не хотелось бы перегружать весь список департаментов с сервера ради этого
    function changeCountsInDepartments(departmentId: number, addNum: number): boolean {
        const thisDeptIndex = departments.value.findIndex((dept: IDepartment) => dept.id === departmentId)
        if(thisDeptIndex > -1 && typeof departments.value[thisDeptIndex] !== 'undefined'){
            departments.value[thisDeptIndex].countusers = String(Number.parseInt(departments.value[thisDeptIndex].countusers) + addNum)
            return true
        }
        return false
    }

    function changeUserDepartment(userId: number, fromDepartmentId: number, newDepartmentId: number): boolean {
        const thisEmp = employees.value.find((emp: IUser) => emp.userId === userId)
        if(thisEmp) {
            thisEmp.departmentId = newDepartmentId
            changeCountsInDepartments(fromDepartmentId, -1) // откуда перенесли сотрудника - вычитаем
            changeCountsInDepartments(newDepartmentId, 1) // а куда - надоборот прибаляем
            return true
        }
        return false
    }

    function sortDepartments(sortFn: (a: any, b: any, order: sortOrders) => number, column: keyof IDepartment, order: sortOrders){
        departments.value.sort((dept1: IDepartment, dept2: IDepartment): number => {
            return sortFn(dept1[column], dept2[column], order)
        })
    }

    return {
        company,

        getDepartments,
        getEmployees,

        setCompany,
        setDepartments,
        setEmployees,
        addNewDepartment,
        deleteDepartment,
        changeUserDepartment,
        sortDepartments,
    }
})

export const companyDummy: ICompany = {
    companyId: 0,
    name     : '',
    address  : ''
}
