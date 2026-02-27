import { defineStore } from 'pinia'

//базовый пример без использования setup
export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0,
    }),
    actions: {
        increment() {
            this.count++
        },
    },
    getters: {
        doubleCount: (state) => state.count * 2,
    },
})
