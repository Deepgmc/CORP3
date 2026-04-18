import { ref } from "vue";
import type { AxiosResponse } from "axios";
import type { IUser } from "@/interfaces/User";
import NetworkManager, { EReqMethods } from "@/network/NetworkManager";
import { isSuccessRequest } from "@/utils/helpers/network";
import { Employee } from "@/entities/Employee";
import { userDummy } from '@/stores/userStore'
import { Rbac } from "@/entities/Rbac";

const isUserProfileCardOpened = ref<boolean>(false)
const cardEmployee = ref<Employee>(new Employee(userDummy, true))
const avatar = ref('')

export function useUserProfileCard() {

    async function openUserCard() {
        return new Promise((resolve) => {
            isUserProfileCardOpened.value = true
            resolve(true)
        })
    }

    function closeUserCard() {
        isUserProfileCardOpened.value = false
    }

    async function setCardEmployee(newCardEmployee: Employee) {
        return new Promise((resolve) => {
            cardEmployee.value = newCardEmployee
            resolve(true)
        })
    }

    async function loadUserCardData(userId: IUser['userId']): Promise<void> {
        const res: AxiosResponse = await NetworkManager.getInstance().getApiRequestMethod(EReqMethods.get)('users')(`get_employee_avatar?uid=${userId}`)({});
        if (isSuccessRequest(res)) {
            const foundEmployee = Rbac.getInstance().company.getEmployeeById(userId)
            if(!foundEmployee){
                throw new Error('Не найден сотрудник при открытии карточки сотрудника')
            }
            await setCardEmployee(foundEmployee)
            if(typeof res !== 'boolean') avatar.value = res.data.avatar
        }
    }

    return {
        avatar,

        isUserProfileCardOpened,
        cardEmployee,

        openUserCard,
        closeUserCard,
        loadUserCardData,
    }
}
