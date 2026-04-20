import { defineStore } from 'pinia'
import type Dictionary from '@/utils/Dictionary';
import type { ICompany, IUnit } from '@/interfaces/Company';

export const useDictStore = defineStore('dictionaries', {
    state: () => ({
        units: {} as Dictionary<IUnit>,
        companies: {} as Dictionary<ICompany>
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
