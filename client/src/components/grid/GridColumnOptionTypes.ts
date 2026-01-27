import { AuthManager } from "@/auth/AuthManager"
import { convertTSToStr } from "@/utils/helpers/dates"

export type TGridColMap = {
    label     ?: string,
    switchData?: boolean, //нужно ли видоизменять данные (id менять на названия или переформатировать данные)
    sortFn    ?: (a: any, b: any) => void,
    align      : 'left' | 'center' | 'right'
}
// interface TableConfig {
//   [key: string]: TGridColMap;
// }
type TableConfig = Record<string, TGridColMap>;

//настройки для вывода списка юзеров
export const employeeBaseMap: Map<string, TGridColMap> = new Map()
export const employeeAvailableCols: TableConfig = {
    userId: {
        label    : 'ID',
        sortFn   : (val1, val2) => val1 < val2,
        align    : 'center'
    },
    username: {
        label    : 'Логин',
        align    : 'center'
    },
    firstName: {
        label    : 'Имя',
        align    : 'center'
    },
    lastName: {
        label    : 'Фамилия',
        align    : 'center'
    },
    email: {
        label    : 'email',
        align    : 'center'
    },
    companyId: {
        label     : 'Компания',
        switchData: true,
        align     : 'left'
    },
    departmentId: {
        label     : 'Отдел',
        switchData: true,
        align     : 'left'
    },
    birth: {
        label    : 'Дата рож.',
        align    : 'center',
        switchData: true,
    },
    reg_date:  {
        label    : 'Дата рег.',
        align    : 'center',
        switchData: true,
    },
    phone: {
        label    : 'Телефон',
        align    : 'center',
    },
    bio: {
        label    : 'О себе',
        align    : 'center',
    },
}

//настройки для вывода списка департаментов
export const departmentBaseMap: Map<string, TGridColMap> = new Map()
//ВСЕ доступные поля. Из них йпотом выбираем нужные при выводе конкретной таблицы
export const departmentAvailableCols: TableConfig = {
    id: {
        label : 'ID',
        sortFn: (val1, val2) => val1 < val2,
        align : 'center',
    },
    companyId: {
        label     : 'Компания',
        switchData: true,
        sortFn    : (val1, val2) => val1 < val2,
        align     : 'center'
    },
    name: {
        label    : 'Название',
        sortFn   : (val1, val2) => val1 < val2,
        align    : 'center'
    },
    description: {
        label    : 'Описание',
        align    : 'center'
    },
}

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
    switch(field){
        case 'companyId':
            item.companyId = $authManager.company.name
        break;
        case 'birth':
            item.birth = convertTSToStr(item.birth)
        break;
        case 'reg_date':
            item.reg_date = convertTSToStr(item.reg_date)
        break;
        case 'departmentId':
            item.departmentId = $authManager.getUser().department?.name
        break;
    }
}
