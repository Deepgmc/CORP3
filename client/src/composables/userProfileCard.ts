import { ref } from "vue";
import type { AxiosResponse } from "axios";
import type { IUser } from "@/interfaces/User";
import NetworkManager, { EReqMethods } from "@/network/NetworkManager";
import { isSuccessRequest } from "@/utils/helpers/network";

const isUserProfileCardOpened = ref<boolean>(false)

//interface IEmployeeRedactUser extends IUser {}

const dialogUser = ref<IUser> ({
    userId      : 0,
    username    : '',
    birth       : 123,
    email       : '',
    companyId   : 2,
    isDirector  : false,
    gender      : 1,
    bio         : '',
    firstName   : '',
    lastName    : '',
    phone       : '',
    departmentId: null,
    positionId  : 1,
    company     : null,
    skills      : [],
    department  : null,
    position    : null,
    avatar      : null,
})

const avatar = ref('')

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

    async function loadUserCardData(userId: IUser['userId']): Promise<void> {
        const res: AxiosResponse | boolean = await NetworkManager.getInstance()
            .getApiRequestMethod(EReqMethods.get)('users')(`get_employee_data/${userId}`)() as AxiosResponse | boolean;
        if(typeof res === 'boolean'){ return }
        if (isSuccessRequest(res)) {
            setDialogUser(res.data.user)
            avatar.value = res.data.avatar
        }
    }

    return {
        avatar,

        isUserProfileCardOpened,
        dialogUser,

        openUserCard,
        closeUserCard,
        loadUserCardData,

        setDialogUser
    }
}
