import { defineStore } from 'pinia'
import type Dictionary from '@/utils/Dictionary';

export const useDictStore = defineStore('dictionaries', {
    state: () => ({
        units: {} as any,
        companies: {} as any
    }),
    getters: {},
    actions: {
        setDictionary<T extends {id: number}>(dictionary: Dictionary<T>, name: string) {
            if(this[name]){
                this[name] = dictionary
            }
        }
    }
});
