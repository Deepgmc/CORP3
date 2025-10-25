import { ref } from 'vue'
import { defineStore  } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    /**
     ref() становятся свойствами состояния
     computed() становятся геттерами
     function() становятся действиями
    */
    const isLogined = ref<boolean>(false)
    const authLoading = ref<boolean>(true)
    const timeLogined = ref<number>(0)

    function setIsLogined(state: boolean): void {
        timeLogined.value = Date.now()
        isLogined.value = state
        authLoading.value = false
    }

    return {isLogined, setIsLogined, authLoading}
})

