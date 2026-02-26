import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUser, TSkill } from '@/interfaces/User'
import { jwtStrategy } from '@/auth/strategies/jwt.strategy'
import NetworkManager, { EReqMethods } from '@/network/NetworkManager'
import type { AxiosResponse } from 'axios'

export const useUserStore = defineStore('user', () => {

    /**
     ref() становятся свойствами состояния
     computed() становятся геттерами
     function() становятся действиями
    */

    const user = ref<IUser>(userDummy)
    const timeLogined = ref<number>(0)

    function setUser(incomeUser: IUser): boolean {
        user.value = incomeUser
        return true
    }

    const isDirector = computed(() => {
        return user.value.isDirector
    })

    const loadUserData = async (): Promise<IUser> => {
        const userId = jwtStrategy.userId
        if (userId && userId > 0) {
            const res: AxiosResponse | boolean = await NetworkManager.getInstance()
                .getApiRequestMethod(EReqMethods.get)('user')('get_user_data')({ data: { userId } }) as AxiosResponse | boolean
            if (typeof res !== 'boolean') {
                res.data.user.avatar = res.data.avatar
                if(setUser(res.data.user)) return res.data.user
                return userDummy
            }
        }
        return userDummy
    }

    function removeSkill(skillId: TSkill['id']) {
        user.value.skills.forEach((skill, index) => {
            if(skill.id === skillId){
                user.value.skills.splice(index, 1)
                return true
            }
        })
    }

    function addSkill(skillText: TSkill['skill'], addedSkillId: TSkill['id']): boolean {
        user.value.skills.push({
            id: addedSkillId,
            skillUserId: user.value.userId,
            skill: skillText
        })
        return true
    }

    return {
        user,
        timeLogined,

        isDirector,

        setUser,
        loadUserData,

        removeSkill,
        addSkill,
    }
})



export const userDummy: IUser = {
    userId      : 0,
    username    : 'dummy',
    birth       : 0,
    email       : '',
    companyId   : null,
    isDirector  : false,
    gender      : 1,
    bio         : '',
    firstName   : '',
    lastName    : '',
    phone       : '',
    departmentId: null,
    positionId  : null,
    avatar      : null,

    company   : null,
    skills    : [],
    department: null,
    position : null
}

