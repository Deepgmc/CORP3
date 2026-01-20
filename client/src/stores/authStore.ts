import { computed, ref } from 'vue'
import { defineStore  } from 'pinia'
import type { IUser } from '@/interfaces/User'
import { jwtStrategy } from '@/auth/strategies/jwt.strategy'
import NetworkManager, { EReqMethods } from '@/network/NetworkManager'
import type { AxiosResponse } from 'axios'

const userDummy = {
    userId    : 0,
    username  : 'dummy',
    birth     : 0,
    email     : '',
    companyId : null,
    isDirector: false,
}

export const useAuthStore = defineStore('auth', () => {

    /**
     ref() становятся свойствами состояния
     computed() становятся геттерами
     function() становятся действиями
    */

    const user = ref<IUser>(userDummy)
    const isLogined = ref<boolean>(false)
    const authLoading = ref<boolean>(true)
    const timeLogined = ref<number>(0)

    function setUser(incomeUuser: IUser){
      user.value = incomeUuser
    }

    const isDirector = computed(() => {
      return user.value.isDirector
    })

    const loadUserData = async (): Promise<IUser> => {
      const userId = jwtStrategy.userId
      if(userId && userId > 0){
        const $networkManager = NetworkManager.getInstance()
        const res: AxiosResponse | boolean = await $networkManager.getApiRequestMethod(EReqMethods.get)('auth')('get_user_data')({data: {userId}}, true) as AxiosResponse | boolean
        if(typeof res !== 'boolean') setUser(res.data)
      }
      return userDummy
    }

    return {
      user,
      timeLogined,
      authLoading,

      isDirector,
      isLogined,

      setUser,
      loadUserData,
    }
})

