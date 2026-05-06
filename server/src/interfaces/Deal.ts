export interface INewDeal {
    reg_date                 : number,
    shipment_date            : number,
    discount                 : number,
    isNeedDocument           : boolean,
    partnerId                : number,
    partnerCompanyId         : number,
    ownerId                  : number,
    ownerCompanyId           : number,
    deferredWarehouseTransfer: TdeferredWarehouseTransfer
}

export type TdeferredWarehouseTransfer = { id: number, count: number }[]