import type { IUser } from "@/interfaces/User";
import NetworkManager, { EReqMethods } from "@/network/NetworkManager";
import { isSuccessRequest } from "@/utils/helpers/network";
import type { AxiosResponse } from "axios";
import { ref } from "vue";

const isUserProfileCardOpened = ref<boolean>(false)

interface IEmployeeRedactUser extends IUser {}

const dialogUser = ref<IEmployeeRedactUser> ()

export function useUserProfileCard() {

    function openUserCard() {
        isUserProfileCardOpened.value = true
    }

    function closeUserCard() {
        isUserProfileCardOpened.value = false
    }

    function setDialogUser(newUser: IUser) {
        dialogUser.value = newUser
    }

    async function loadUserCardData(userId: IUser['userId']): Promise<false | IUser> {
        const res: AxiosResponse | boolean = await NetworkManager.getInstance()
            .getApiRequestMethod(EReqMethods.get)('users')(`get_employee_data/${userId}`)() as AxiosResponse | boolean;
        if(typeof res === 'boolean'){return false}
        if (isSuccessRequest(res)) {
            setDialogUser(res.data)
            return res.data as IUser
        }
        return false
    }

    return {
        isUserProfileCardOpened,
        dialogUser,

        openUserCard,
        closeUserCard,
        loadUserCardData,

        setDialogUser
    }
}
