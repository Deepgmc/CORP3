// import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUnit } from '@/interfaces/Company'

export const useDictStore = defineStore('dictionaries', {
    state: () => ({
        units: []
    }),
    getters: {
        getUnitById(state){
            return (unitID: number) => state.units.find((unit: IUnit) => unit.id === unitID);
        }
    },
    actions: {
        setUnits(newUnits: IUnit[]): void {
            this.units = newUnits
        }
    }
})
    // const units = ref<IUnit[]>([])

    // function setUnits(newUnits: IUnit[]): void {
    //     units.value = newUnits
    // }

    // const getUnitById = computed(() => {

    // })

    // return {
    //     units,

    //     setUnits
    // }
// })
