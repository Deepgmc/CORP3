import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUnit } from '@/interfaces/Company'

export const useDictStore = defineStore('dictionaries', () => {

    const units = ref<IUnit[]>([])

    function setUnits(newUnits: IUnit[]): void {
        units.value = newUnits
    }

    return {
        units,

        setUnits
    }
})
