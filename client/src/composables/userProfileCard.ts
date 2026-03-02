import { ref } from "vue";
import type { AxiosResponse } from "axios";
import type { IUser } from "@/interfaces/User";
import NetworkManager, { EReqMethods } from "@/network/NetworkManager";
import { isSuccessRequest } from "@/utils/helpers/network";
import { Employee } from "@/entities/Employee";
import { userDummy } from '@/stores/userStore'

const isUserProfileCardOpened = ref<boolean>(false)

const dialogEmployee = ref<Employee>(new Employee(userDummy))

const avatar = ref('')

export function useUserProfileCard() {

    function openUserCard() {
        isUserProfileCardOpened.value = true
    }

    function closeUserCard() {
        isUserProfileCardOpened.value = false
    }

    function setDialogEmployee(newUser: IUser) {
        dialogEmployee.value = new Employee(newUser)
    }

    async function loadUserCardData(userId: IUser['userId']): Promise<void> {
        const res: AxiosResponse | boolean = await NetworkManager.getInstance()
            .getApiRequestMethod(EReqMethods.get)('users')(`get_employee_data/${userId}`)() as AxiosResponse | boolean;
        if(typeof res === 'boolean'){ return }
        if (isSuccessRequest(res)) {
            setDialogEmployee(res.data.user)
            avatar.value = res.data.avatar
        }
    }

    return {
        avatar,

        isUserProfileCardOpened,
        dialogEmployee,

        openUserCard,
        closeUserCard,
        loadUserCardData,

        setDialogEmployee
    }
}
