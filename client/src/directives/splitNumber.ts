import type { Directive } from 'vue'

/**
 * разбиваем строки по 3 знака: 4000000 = 4 000 000
*/
export default {
    mounted: (el, binding) => {
        el.innerText = split(binding.value)
    },
    beforeUpdate: (el, binding) => {
        el.innerText = split(binding.value)
    },
} satisfies Directive<HTMLElement, number>

function split(val: number) {
    return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
