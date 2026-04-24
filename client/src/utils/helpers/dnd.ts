export type TDropResult = {dropId: number | null, draggingItemId: number, dragFromId: number}  | boolean

export function dragItem (
    event          : DragEvent,
    draggingItemId : number, //id элемента, который тащим
    dragFromId    ?: number, //id контейнера, откуда тащим
){
    if(!event.dataTransfer || draggingItemId === null) return false
    // const eventTarget: HTMLElement = event.target as HTMLElement

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.setData('dragFromId', String(dragFromId))
    event.dataTransfer.setData('draggingItemId', String(draggingItemId))
    return true
}

export function dropItem(event: DragEvent): TDropResult | boolean {
    const dropTarget = event.currentTarget as HTMLElement
    const ds = dropTarget.dataset
    if(!event.dataTransfer || !event.target) return false

    const dragFromId = parseInt(event.dataTransfer.getData('dragFromId'))
    const draggingItemId = parseInt(event.dataTransfer.getData('draggingItemId'))

    let thisDropId = null
    if(ds.drop_id) thisDropId = parseInt(ds.drop_id)

    return {
        dropId        : thisDropId,
        draggingItemId: draggingItemId,
        dragFromId    : dragFromId
    }
}
