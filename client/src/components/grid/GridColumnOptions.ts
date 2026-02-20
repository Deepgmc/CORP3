import { fieldTypes, type ColsConfig, type sortOrders, type TGridColMap } from "./GridCols";


//настройки для вывода списка юзеров
export const employeeBaseMap: Map<string, TGridColMap> = new Map()
//ВСЕ доступные поля. Из них йпотом выбираем нужные при выводе конкретной таблицы
export const employeeAvailableCols: ColsConfig = {
    userId: {
        label    : 'ID',
        sortFn   : defaultNumSortFn,
        order    : -1,
        align    : 'center',
        type: fieldTypes.text,
        editable: false,
    },
    username: {
        label    : 'Логин',
        align    : 'center',
        type: fieldTypes.text,
        editable: false,
    },
    firstName: {
        label    : 'Имя',
        align    : 'center',
        type: fieldTypes.text,
        editable: true,
    },
    lastName: {
        label    : 'Фамилия',
        align    : 'center',
        type: fieldTypes.text,
        editable: true,
    },
    email: {
        label    : 'email',
        align    : 'center',
        type: fieldTypes.text,
        editable: true,
    },
    companyId: {
        label     : 'Компания',
        switchData: true,
        align     : 'left',
        type: fieldTypes.text,
        editable: false,
    },
    departmentId: {
        label     : 'Отдел',
        switchData: true,
        align     : 'left',
        type: fieldTypes.text,
        editable: false,
    },
    birth: {
        label    : 'Дата рож.',
        align    : 'center',
        switchData: true,
        type: fieldTypes.text,
        editable: false,
    },
    reg_date:  {
        label    : 'Дата рег.',
        align    : 'center',
        switchData: true,
        type: fieldTypes.text,
        editable: false,
    },
    phone: {
        label    : 'Телефон',
        align    : 'center',
        type: fieldTypes.text,
        editable: true,
    },
    bio: {
        label    : 'О себе',
        align    : 'left',
        type: fieldTypes.text,
        editable: true,
    },
}

//настройки для вывода списка департаментов
export const departmentBaseMap: Map<string, TGridColMap> = new Map()
//ВСЕ доступные поля. Из них йпотом выбираем нужные при выводе конкретной таблицы
export const departmentAvailableCols: ColsConfig = {
    id: {
        label   : 'ID',
        sortFn  : defaultNumSortFn,
        order   : -1,
        align   : 'center',
        type    : fieldTypes.number,
        editable: false
    },
    companyId: {
        label     : 'Компания',
        switchData: true,
        align     : 'center',
        type      : fieldTypes.text,
        editable  : false
    },
    name: {
        label   : 'Название',
        sortFn  : defaultStringSortFn,
        order   : -1,
        align   : 'left',
        type    : fieldTypes.text,
        editable: true
    },
    description: {
        label   : 'Описание',
        align   : 'left',
        type    : fieldTypes.text,
        editable: true
    },
    countusers: {
        label   : 'Чел.',
        align   : 'center',
        sortFn  : defaultNumSortFn,
        order   : -1,
        type    : fieldTypes.number,
        editable: false
    },
}

export type TSortFn = (a: any, b: any, order: sortOrders) => number


function defaultStringSortFn(val1: string, val2: string, order: sortOrders): number {
    if(val1 === val2) return 0
    if(order === 1){
        return val1 < val2 ? 1 : -1
    }
    return val1 > val2 ? 1 : -1
}

function defaultNumSortFn(val1: number, val2: number, order: sortOrders): number {
    if(val1 === val2) return 0
    if(order === 1){
        return val1 < val2 ? 1 : -1
    }
    return val1 > val2 ? 1 : -1
}
