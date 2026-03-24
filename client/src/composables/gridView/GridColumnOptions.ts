import { fieldTypes, type ColsConfig, type sortOrders } from '@/composables/gridView/GridColsManager';


//настройки для вывода списка юзеров
//ВСЕ доступные поля. Из них йпотом выбираем нужные при выводе конкретной таблицы
export const employeeAvailableCols: ColsConfig = {
    userId: {
        label   : 'ID',
        align   : 'center',
        type    : fieldTypes.text,
        editable: false,
        sortFn  : defaultNumSortFn,
        order   : -1,
    },
    username: {
        label   : 'Логин',
        align   : 'center',
        type    : fieldTypes.text,
        editable: false,
        width   : '8em',
    },
    firstName: {
        label   : 'Имя',
        align   : 'center',
        type    : fieldTypes.text,
        editable: true,
        width   : '8em',
    },
    lastName: {
        label   : 'Фамилия',
        align   : 'center',
        type    : fieldTypes.text,
        editable: true,
    },
    email: {
        label   : 'email',
        align   : 'center',
        type    : fieldTypes.text,
        editable: true,
    },
    companyId: {
        label     : 'Компания',
        switchData: true,
        align     : 'left',
        type      : fieldTypes.text,
        editable  : false,
    },
    departmentId: {
        label     : 'Отдел',
        switchData: true,
        align     : 'left',
        type      : fieldTypes.text,
        editable  : false,
    },
    state: {
        label     : 'Статус',
        switchData: true,
        align     : 'center',
        type      : fieldTypes.text,
        editable  : false,
        sortFn    : defaultStringSortFn,
        order     : -1,
        width     : '7em',
    },
    positionId: {
        label     : 'Должность',
        switchData: true,
        align     : 'left',
        type      : fieldTypes.text,
        editable  : false,
        sortFn  : defaultStringSortFn,
        order   : -1,
    },
    position: {
        label     : 'Должность',
        type      : fieldTypes.text,
        align     : 'left',
        editable  : false,
        switchData: true,
        width     : '20em',
    },
    birth: {
        label     : 'Дата рождения',
        align     : 'center',
        switchData: true,
        type      : fieldTypes.text,
        editable  : false,
    },
    reg_date:  {
        label     : 'Дата рег.',
        align     : 'center',
        switchData: true,
        type      : fieldTypes.text,
        editable  : false,
    },
    phone: {
        label   : 'Телефон',
        align   : 'center',
        type    : fieldTypes.text,
        editable: true,
    },
    bio: {
        label   : 'О себе',
        align   : 'left',
        type    : fieldTypes.text,
        editable: true,
    },
    skills: {
        label     : 'Навыки',
        switchData: true,
        align     : 'left',
        type      : fieldTypes.widget,
        editable  : false,
        width     : '25em'
    },
}

//настройки для вывода списка департаментов
//ВСЕ доступные поля. Из них йпотом выбираем нужные при выводе конкретной таблицы
export const departmentAvailableCols: ColsConfig = {
    id: {
        label   : 'ID',
        sortFn  : defaultNumSortFn,
        order   : -1,
        align   : 'center',
        type    : fieldTypes.number,
        editable: false,
        width   : '5em',
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
        editable: true,
        width   : '20em',
    },
    description: {
        label   : 'Описание',
        align   : 'left',
        type    : fieldTypes.text,
        editable: true,
        width   : '25em',
    },
    countusers: {
        label   : 'Чел.',
        align   : 'center',
        sortFn  : defaultNumSortFn,
        order   : -1,
        type    : fieldTypes.number,
        editable: false,
        width   : '5em'
    },
}

//настройки для вывода списка департаментов
//ВСЕ доступные поля. Из них йпотом выбираем нужные при выводе конкретной таблицы
export const vacationAvailableCols: ColsConfig = {
    id: {
        label   : 'ID',
        align   : 'center',
        type    : fieldTypes.number,
        editable: false
    },
    dateFrom: {
        label     : 'От',
        switchData: true,
        align     : 'left',
        type      : fieldTypes.text,
        editable  : false
    },
    dateTo: {
        label     : 'До',
        switchData: true,
        align     : 'left',
        type      : fieldTypes.text,
        editable  : false
    },
    isMedical: {
        label     : 'Больничный/Отпуск',
        switchData: false,
        align     : 'center',
        type      : fieldTypes.widget,
        editable  : false,
    },
    vacationStatusText: {
        label     : 'Статус',
        switchData: false,
        align     : 'center',
        type      : fieldTypes.text,
        editable  : false,
    },
};

export type TSortFn = (a: any, b: any, order: sortOrders) => number


export function defaultStringSortFn(val1: string, val2: string, order: sortOrders): number {
    if(val1 === val2) return 0
    if(order === 1){
        return val1 < val2 ? 1 : -1
    }
    return val1 > val2 ? 1 : -1
}

export function defaultNumSortFn(val1: number, val2: number, order: sortOrders): number {
    if(val1 === val2) return 0
    if(order === 1){
        return val1 < val2 ? 1 : -1
    }
    return val1 > val2 ? 1 : -1
}
