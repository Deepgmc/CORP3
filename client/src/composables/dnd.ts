export function dragItem (
    event: DragEvent,
    item : any,
){
    if(!event.dataTransfer || item === null) return false
    const eventTarget: HTMLElement = event.target as HTMLElement

    let thisId: number
    if(typeof item.id !== 'undefined'){
        thisId = item.id
    } else {
        thisId = item.userId
    }

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.setData('dragItemId', String(thisId))
    event.dataTransfer.setData('dragDeptId', String(eventTarget.dataset.deptid))
    return true
}

export function dropItem(event: DragEvent): {dropId: number, dragItemId: number, dragFromId: number} | boolean {
    const dropTarget = event.currentTarget as HTMLElement
    const ds = dropTarget.dataset
    if(!event.dataTransfer || !event.target || typeof ds.deptid === 'undefined') return false

    const thisDropId = parseInt(ds.deptid)
    const dragItemId = parseInt(event.dataTransfer.getData('dragItemId'))
    const dragDeptId = parseInt(event.dataTransfer.getData('dragDeptId'))

    return {
        dropId    : thisDropId,
        dragItemId: dragItemId,
        dragFromId: dragDeptId
    }
}
