import { ref } from "vue";
import type { AxiosResponse } from "axios";
import type { IUser } from "@/interfaces/User";
import NetworkManager, { EReqMethods } from "@/network/NetworkManager";
import { isSuccessRequest } from "@/utils/helpers/network";
import { Employee } from "@/entities/Employee";
import { userDummy } from '@/stores/userStore'
import { Rbac } from "@/entities/Rbac";

const isUserProfileCardOpened = ref<boolean>(false)

const dialogEmployee = ref<Employee>(new Employee(userDummy, true))

const avatar = ref('')
const $um = Rbac.getInstance()

export function useUserProfileCard() {

    function openUserCard() {
        isUserProfileCardOpened.value = true
    }

    function closeUserCard() {
        isUserProfileCardOpened.value = false
    }

    function setDialogEmployee(newEmployee: Employee) {
        dialogEmployee.value = newEmployee
    }

    async function loadUserCardData(userId: IUser['userId']): Promise<void> {
        const res: AxiosResponse | boolean = await NetworkManager.getInstance()
            .getApiRequestMethod(EReqMethods.get)('users')(`get_employee_data/${userId}`)() as AxiosResponse | boolean;
        if(typeof res === 'boolean'){ return }
        if (isSuccessRequest(res)) {
            const foundEmployee = $um.company.getEmployeeById(res.data.user.userId)
            if(foundEmployee){
                setDialogEmployee(foundEmployee)
                avatar.value = res.data.avatar
            }
            throw new Error('Не найден сотрудник при открытии карточки сотрудника')
        }
    }

    return {
        avatar,

        isUserProfileCardOpened,
        dialogEmployee,

        openUserCard,
        closeUserCard,
        loadUserCardData,
    }
}
