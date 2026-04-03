import { ref } from "vue"
import { defineStore } from "pinia"
import { Employee } from "@/entities/Employee"
import type { Vacation } from "@/entities/Vacation"
import { type IDepartment, type ICompany } from "@/interfaces/Company"
import type { IPosition } from "@/interfaces/User"
import type { IProduct } from "@/interfaces/ProductsDeals"

export const useOrganizationStore = defineStore('organization', () => {

    const company = ref<ICompany>(companyDummy)

    const departments = ref<IDepartment[]>([])
    const employees   = ref<Employee[]>([])
    const positions   = ref<IPosition[]>([])
    const warehouse   = ref<IProduct[]>([])

    function setCompany(newCompany: ICompany): boolean {
        company.value = newCompany
        return true
    }

    function setDepartments(newDepts: IDepartment[]): void {
        departments.value = newDepts
    }
    function setEmployees(newEmployees: Employee[]): void {
        employees.value = newEmployees.map((employee: Employee) => new Employee(employee))
    }
    function setPositions(newPositions: IPosition[]): void {
        positions.value = newPositions
    }
    function setWarehouse(newProducts: IProduct[]): void {
        warehouse.value = newProducts
    }

    function addNewDepartment(newDept: IDepartment): void {
        departments.value.push(newDept)
    }

    function deleteDepartment(depertmentId: number): boolean {
        if(!Number.isInteger(depertmentId)) return false
        departments.value.splice(departments.value.findIndex(dept => dept.id === depertmentId), 1)
        return true
    }

    function addNewProduct(newProduct: IProduct): boolean {
        return !!warehouse.value.push(newProduct)
    }

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
        const thisEmp = employees.value.find(employee => employee.userId === userId)
        if(thisEmp) {
            thisEmp.departmentId = newDepartmentId
            changeCountsInDepartments(fromDepartmentId, -1) // откуда перенесли сотрудника - вычитаем
            changeCountsInDepartments(newDepartmentId, 1) // а куда - надоборот прибаляем
            return true
        }
        return false
    }

    function changeEmployeePosition(newPositionId: number, userId: number){
        const thisEmp = employees.value.find(emp => {
            return emp.userId === userId
        })
        if(thisEmp !== undefined){
            thisEmp.positionId = newPositionId
        }
    }

    function getVacationById(userId: number, vacationId: number): Vacation | null {
        const foundEmployee = employees.value.find(emp => emp.userId === userId)
        if(foundEmployee) {
            const foundVacation = foundEmployee.vacations.find(vacation => vacation.id === vacationId)
            if(foundVacation) return foundVacation as Vacation
        }
        return null
    }



    return {
        company,
        employees,
        departments,
        positions,
        warehouse,

        setCompany,
        setDepartments,
        setEmployees,
        setPositions,
        setWarehouse,

        addNewDepartment,
        deleteDepartment,
        changeUserDepartment,
        addNewProduct,

        changeEmployeePosition,
        getVacationById,
    }
})

export const companyDummy: ICompany = {
    companyId     : 0,
    name          : '',
    address       : '',
    accountBalance: 0
}
