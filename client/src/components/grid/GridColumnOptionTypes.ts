import { AuthManager } from "@/auth/AuthManager"
import type { IDepartment } from "@/interfaces/Company";
import { convertTSToStr } from "@/utils/helpers/dates"

export type TGridColMap = {
    label     ?: string,
    switchData?: boolean,                       //нужно ли видоизменять данные (id менять на названия или переформатировать данные)
    sortFn    ?: (a: any, b: any) => void,
    align      : 'left' | 'center' | 'right',
    type       : fieldTypes,
    editable   : boolean
}
// interface TableConfig {
//   [key: string]: TGridColMap;
// }
type TableConfig = Record<string, TGridColMap>;

export const enum fieldTypes {
    text     = 'text',
    textarea = 'textarea',
    number   = 'number',
    date     = 'date',
    phone    = 'phone'
}

//настройки для вывода списка юзеров
export const employeeBaseMap: Map<string, TGridColMap> = new Map()
export const employeeAvailableCols: TableConfig = {
    userId: {
        label    : 'ID',
        sortFn   : (val1, val2) => val1 < val2,
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
//ВСЕ доступные поля. Из них потом выбираем нужные при выводе конкретной таблицы
export const departmentAvailableCols: TableConfig = {
    id: {
        label   : 'ID',
        sortFn  : (val1, val2) => val1 < val2,
        align   : 'center',
        type    : fieldTypes.number,
        editable: false
    },
    companyId: {
        label     : 'Компания',
        switchData: true,
        sortFn    : (val1, val2) => val1 < val2,
        align     : 'center',
        type      : fieldTypes.text,
        editable  : false
    },
    name: {
        label   : 'Название',
        sortFn  : (val1, val2) => val1 < val2,
        align   : 'left',
        type    : fieldTypes.text,
        editable: true
    },
    description: {
        label   : 'Описание',
        align   : 'left',
        type    : fieldTypes.textarea,
        editable: true
    },
    countusers: {
        label   : 'Чел.',
        align   : 'left',
        type    : fieldTypes.number,
        editable: false
    },
}

/*
    По переданному массиву needFields заполняем массив настроек текущей таблицы
    Все возможные варианты переданы в массиве availableCols, оставляем только нужные в текущей таблице
*/
export function setColsMap(needFields: any[], baseMap: Map<string, TGridColMap>, availableCols: TableConfig){
    needFields.forEach((field) => {
        if(typeof availableCols[field] !== 'undefined') {
            baseMap.set(field, availableCols[field])
        }
    })
    return baseMap
}

const $authManager = AuthManager.getInstance()

/**
 * Заменяем данные во входном массиве на те, которые требуются в GridView таблице
    Например
    - таймстампы конвертируем в строку
    - ид компаний/департаментов в названия
 * @param data массив департаментов, компаний, юзеров
 * @returns
 */
export function modifyGridData(data: any[], cols: Map<string, TGridColMap>) {
    return data.map((item: any) => {
        for(const [val,] of Object.entries(item)){
            if(cols.get(val)?.switchData) {
                switchGridValue(item, val)
            }
        }
        return item
    })
}

function switchGridValue(item: any, field: string){
    let thisDept: IDepartment
    switch(field){
        case 'companyId':
            if(item.companyId !== null){
                item['companyIdValue'] = $authManager.company.name
            }
        break;
        case 'birth':
            item['birthValue'] = convertTSToStr(item.birth)
        break;
        case 'reg_date':
            item['reg_dateValue'] = convertTSToStr(item.reg_date)
        break;
        case 'departmentId':
            if(item.departmentId !== null){
                thisDept = $authManager.company.departments.value.find((dept: IDepartment) => dept.id === item.departmentId)
                item['departmentIdValue'] = thisDept.name
            }
        break;
    }
}
