import type { IDepartment } from "@/interfaces/Company";
import { AuthManager } from "@/auth/AuthManager";
import { convertTSToStr } from "@/utils/helpers/dates";
import { computed, type ComputedRef, type Ref } from "vue";
import type { IUser } from "@/interfaces/User";

export type TGridColMap = {
    label     ?: string,
    switchData?: boolean,                       //нужно ли видоизменять данные (id менять на названия или переформатировать данные)
    sortFn    ?: (a: any, b: any, order: sortOrders) => void,
    order     ?: sortOrders,
    align      : 'left' | 'center' | 'right',
    type       : fieldTypes,
    editable   : boolean
}

export type TColsMap = Map<string, TGridColMap>

export type GridColsData = IDepartment[] | IUser[]

export type GridColsDataTypes = GridColsData extends (infer T)[] ? T : never // keyof IDepartmet | keyof IUser  etc...

export type sortOrders = 0 | 1 | -1 //asc, desc + default

export type ColsConfig = Record<string, TGridColMap>;

export const enum fieldTypes {
    text     = 'text',
    textarea = 'textarea',
    number   = 'number',
    date     = 'date',
    phone    = 'phone'
}

export type TSortingColsMap = Map<string, TGridColMap>




/**
 * Класс для обработки видов столбцов компонента GridView
   пагинации, сортировки
 */
export class GridCols {

    private colsMap: TColsMap = new Map()
    private modifiedColsMap: ComputedRef<GridColsData>
    private $authManager: AuthManager

    constructor(
        private requiredCols: string[],
        private availableCols: ColsConfig, //общий конфиг столбцов разных таблиц департаментов, юзеров, компаний и т.д.
        private rawData: Ref<GridColsData>, // массив сырых данных компаний, департаментов и пр
        public idName: string,
        public module: string,
        public action: string
    ){
        this.setBaseColsMap(this.requiredCols, this.availableCols)

        this.modifiedColsMap = computed(() => {
            return this.modifyColsMap()
        })

        this.$authManager = AuthManager.getInstance()
    }

    sortField(column: keyof GridColsDataTypes){
        this.$authManager.company.sortDepartments(this.getColsMap(), column, this)
    }

    switchColSortOrder(
        lastOrder     : sortOrders,
        sortingColsMap: TSortingColsMap,
        thisCol       : TGridColMap,
        column        : keyof IDepartment,
    ){
        if(lastOrder === -1) lastOrder = 0
        thisCol.order = Math.abs(lastOrder - 1) as sortOrders
        sortingColsMap.set(column, thisCol)
    }

    resetColsSorting(sortingColsMap: TSortingColsMap){
        sortingColsMap.forEach(c => {
            if(c.order !== undefined) c.order = -1
        })
    }

    /**
        * Заменяем данные во входном массиве на те, которые требуются в GridView таблице
            Например
            - таймстампы конвертируем в строку
            - ид компаний/департаментов в названия
        * @param data массив департаментов, компаний, юзеров
    */
    modifyColsMap(){
        return this.rawData.value.map((item: any) => {
            for(const [val,] of Object.entries(item)){
                if(this.colsMap.get(val)?.switchData) {
                    this.switchGridValue(item, val)
                }
            }
            return item
        })
    }

    switchGridValue(item: any, field: string){
        switch(field){
            case 'companyId':
                if(item.companyId !== null){
                    //! тут нужно выбирать из списка компаний а не текущую!!!
                    item['companyIdValue'] = this.$authManager.company.name
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
                    const thisDept: IDepartment = this.$authManager.company.departments.value.find((dept: IDepartment) => dept.id === item.departmentId)
                    item['departmentIdValue'] = thisDept.name
                }
            break;
        }
    }

    /*
        По переданному массиву needFields заполняем массив настроек текущей таблицы
        Все возможные варианты переданы в массиве availableCols, оставляем только нужные в текущей таблице
    */
    setBaseColsMap(requiredCols: string[], availableCols: ColsConfig){
        requiredCols.forEach((field) => {
            if(typeof availableCols[field] !== 'undefined') {
                this.colsMap.set(field, availableCols[field])
            }
        })
    }

    getColsMap(): TColsMap{
        return this.colsMap
    }

    getModifiedColsMap(){
        return this.modifiedColsMap
    }
}
