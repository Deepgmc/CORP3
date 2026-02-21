// import { ref } from 'vue'
// import { test, expect } from 'vitest'
// import { mount } from '@vue/test-utils'
// import { Quasar } from 'quasar'

// import GridView from '../../components/grid/GridView.vue'
// import { GridCols, fieldTypes } from '../../components/grid/GridColsManager'
// import { defaultStringSortFn, defaultNumSortFn } from '../../components/grid/GridColumnOptions'


// const availableCols = {
//     id: {
//         label   : 'ID',
//         sortFn  : defaultNumSortFn,
//         order   : -1,
//         align   : 'center',
//         type    : fieldTypes.number,
//         editable: false
//     },
//     name: {
//         label   : 'Название',
//         sortFn  : defaultStringSortFn,
//         order   : -1,
//         align   : 'left',
//         type    : fieldTypes.text,
//         editable: true
//     }
// }

// const rawData = ref<GridColsData>([
//     {id: 1, name: 'First'},
//     {id: 2, name: 'Second'},
//     {id: 3, name: 'Third'},
// ])

// const gridCols = new GridCols(
//     ['id', 'name'],
//     availableCols,
//     rawData,
//     'id',
//     'name',
// )

// test.only('Grid View renders properly', () => {
    // const wrapperFactory = () => mount(GridView, {
    //     global: {
    //         plugins: [Quasar]
    //     },
    //     props: { gridCols: gridCols }
    // })
    // const wrapper = wrapperFactory()
    // expect(wrapper.find('table').text()).equal('ID swap_vertНазвание swap_vert1First2Second3Third')
    // mount(GridView, {
    //     props: { gridCols: gridCols }
    // })
// })
