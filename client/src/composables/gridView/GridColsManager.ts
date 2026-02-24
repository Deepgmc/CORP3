import type { IDepartment, IPosition } from "@/interfaces/Company";
import { convertTSToStr, getAgeFromTS } from "@/utils/helpers/dates";
import { computed, ref, type ComputedRef, type Ref } from "vue";
import type { IUser } from "@/interfaces/User";
import type { TSortFn } from "../../components/grid/GridColumnOptions";
import { Rbac } from "@/entities/Rbac";

export type TGridColMap = {
    label     ?: string,
    switchData?: boolean,                       //нужно ли видоизменять данные (id менять на названия или переформатировать данные)
    sortFn    ?: TSortFn,
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
    phone    = 'phone',
    widget   = 'widget'
}

export type TSortingColsMap = Map<string, TGridColMap>




/**
 * Класс для обработки видов столбцов компонента GridView
   пагинации, сортировки
 */
export class GridCols {

    private colsMap: TColsMap = new Map()
    private modifiedData: ComputedRef<GridColsData>
    private $userManager: Rbac

    public readonly rowsPerPage = ref(5)
    public currentPage = ref(1)
    private thatPageIndex = 0

    constructor(
        private requiredCols: string[],
        private availableCols: ColsConfig, //общий конфиг столбцов разных таблиц департаментов, юзеров, компаний и т.д.
        private rawData: Ref<GridColsData>, // массив сырых данных компаний, департаментов и пр
        public idName: string,
        public module: string,
        public action: string,
        perPage ?: number
    ){
        this.setBaseColsMap(this.requiredCols, this.availableCols)

        this.modifiedData = computed(() => {
            return this.modifyRawData()
        })

        if(perPage) this.rowsPerPage.value = perPage

        this.$userManager = Rbac.getInstance()
    }

    /** сколько всего страниц в таблице */
    public pagesCount: Ref<number> = computed((): number => {
        return Math.ceil(this.modifiedData.value.length / this.rowsPerPage.value)
    })

    /** массив чисел - сколько всего страниц в таблице. нужен только для вычислений*/
    private allPagesNums: ComputedRef<number[]> = computed(() => {
        const pages: number[] = []
        for(let p = 1; p <= this.pagesCount.value; p++){
            if(p === this.currentPage.value) this.thatPageIndex = p - 1
            pages.push(p)
        }
        return pages
    })

    /** страницы слева от текущей */
    leftSideNums = computed(() => {
        let thisArr: number[] = []
        for(let p = 1; p <= 2; p++) {
            //@ts-ignore
            const thisLeftNum = this.allPagesNums.value[this.thatPageIndex] - p
            if(thisLeftNum == 0) break
            thisArr.push(thisLeftNum)
        }
        thisArr = thisArr.reverse()
        return thisArr
    })

    /** страницы справа от текущей */
    rightSideNums = computed(() => {
        const thisArr: number[] = []
        for(let p = 1; p <= 2; p++) {
            //@ts-ignore
            const thisRightNum = this.allPagesNums.value[this.thatPageIndex] + p
            if(thisRightNum > this.allPagesNums.value.length) break
            thisArr.push(thisRightNum)
        }
        return thisArr
    })

    /**
    данные по текущей странице.
    это массив из this.rowsPerPage строк
    */
    public currentPageData = computed(() => {
        const startIndex = (this.rowsPerPage.value * this.currentPage.value) - this.rowsPerPage.value
        return this.modifiedData.value.slice(
            startIndex,
            startIndex + this.rowsPerPage.value
        )
    })

    public setCurrentPage(newPage: number): void {
        this.currentPage.value = newPage
    }

    sortField(column: keyof GridColsDataTypes): void {
        const sortingColsMap = this.getColsMap()
        const thisCol = sortingColsMap.get(column)
        const sortingFn = thisCol?.sortFn
        const order = thisCol?.order

        if(thisCol === undefined || sortingFn === undefined || order === undefined) return

        this.resetColsSorting(sortingColsMap)
        this.switchColSortOrder(order, sortingColsMap, thisCol, column)

        this.rawData.value.sort((
            entity1: GridColsDataTypes,
            entity2: GridColsDataTypes
        ): number => {
            return sortingFn(entity1[column], entity2[column], order)
        })
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
    modifyRawData(){
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
                    item['companyIdValue'] = this.$userManager.company.name
                }
            break;
            case 'birth':
                item['birthValue'] = `${convertTSToStr(item.birth)} (${getAgeFromTS(item.birth)})`
            break;
            case 'reg_date':
                item['reg_dateValue'] = convertTSToStr(item.reg_date)
            break;
            case 'departmentId':
                if(item.departmentId !== null){
                    const thisDept: IDepartment = this.$userManager.company.departments.value.find((dept: IDepartment) => dept.id === item.departmentId)
                    item['departmentIdValue'] = thisDept.name
                }
            break;
            case 'positionId':
                if(item.positionId !== null){
                    const thisPosition: IPosition = this.$userManager.company.positions.value.find((pos: IPosition) => pos.id === item.positionId)
                    item['positionIdValue'] = thisPosition.position
                }
            break;
            case 'skills':
                item['skillsValue'] = item.skills.map((skill: any) => skill.skill).join(', ')
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

    getModifiedData(){
        return this.modifiedData
    }
}
