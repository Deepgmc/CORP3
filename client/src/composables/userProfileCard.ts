import type { IUser } from "@/interfaces/User";
import { ref } from "vue";

const isUserProfileCardOpened = ref<boolean>(false)

interface IEmployeeRedactUser extends IUser {}

const dialogUser = ref<IEmployeeRedactUser> ()

export function useUserProfileCard() {

    function userCardOpen() {
        isUserProfileCardOpened.value = true
    }

    function userCardClose() {
        isUserProfileCardOpened.value = false
    }

    function setDialogUser(newUser: IUser) {
        dialogUser.value = newUser
    }


    return {
        isUserProfileCardOpened,
        dialogUser,

        userCardOpen,
        userCardClose,

        setDialogUser
    }
}
