import type { TResult } from '@/interfaces/Error';
import type { INewProduct, IProduct } from '@/interfaces/ProductsDeals';
import { productStatesNames } from '@/interfaces/ProductsDeals';
import { UNKNOWN_ERROR } from '@/utils/constants/texts';
import { FiniteStateMachine, type ITransition, type TState } from '@/utils/FiniteStateMachine';
import { Rbac } from '../Rbac';

export const productStates: Record<productStatesNames, TState> = {
    [productStatesNames.inStock]: {
        name       : productStatesNames.inStock,
        isActive   : isInStock,
        label      : 'Товар на складе',
        icon       : 'fiber_new',
        color      : 'primary',
        transitions: [{
            name: productStatesNames.selled,
            action: 'sell'
        }],
    },
    [productStatesNames.selled]: {
        name       : productStatesNames.selled,
        isActive   : isSelled,
        label      : 'Товар продан',
        icon       : 'done',
        color      : 'positive',
        transitions: [{
            name: productStatesNames.deleted,
            action: 'delete'
        }],
    },
    [productStatesNames.deleted]: {
        name       : productStatesNames.deleted,
        isActive   : isSelled,
        label      : 'Товар продан',
        icon       : 'done',
        color      : 'positive',
        transitions: [],
    },
};

export default class Product extends FiniteStateMachine implements IProduct {
    public id: number = 0
    public companyId: number | null = null
    public readonly name: string
    public status: productStatesNames = productStatesNames.inStock

    public price: number | undefined
    public unitId: number | undefined
    public count: number | undefined

    public readonly _apiModule = 'warehouse/products'
    private readonly $um = Rbac.getInstance()

    constructor(newProduct: INewProduct) {
        const FSMTransitions: ITransition = {
            inStock: {//новый товар, хранящийся на складе. Может быть продан
                initState: function() {},
                sell: async function() {
                    this.changeStateTo(productStates.selled).dispatch('initState')
                }
            },
            selled: {//товар продан, но еще на складе
                initState: async function() {
                    await this.sellProduct()
                },
                delete: async function() {
                    this.changeStateTo(productStates.deleted).dispatch('initState')
                },
            },
            deleted: {//товар продан и убран со склада
                initState: async function() {
                    await this.deleteProduct()
                },
            },
        }
        super(productStates[productStatesNames.inStock], FSMTransitions)

        this.name = newProduct.name
        this.status = newProduct.status
        this.companyId = newProduct.companyId
        this.price = newProduct.price
        this.unitId = newProduct.unitId
        this.count = newProduct.count

        this.initNetwork(this._apiModule)
    }

    public isInStock() {
        return isInStock.call(this)
    }
    public isSelled() {
        return isSelled.call(this)
    }
    public isDeleted() {
        return isDeleted.call(this)
    }

    protected getModel(): IProduct {
        return {
            id       : this.id,
            companyId: this.companyId,
            name     : this.name,
            status   : this.status,
            price    : this.price,
            unitId   : this.unitId,
            count    : this.count
        }
    }

    async saveModel(): Promise<TResult<{id: number}>> {
        const modelSaveRes = await super.saveModel()
        if(!modelSaveRes.error) {
            this.id = modelSaveRes.res.id
            this.$um.company.addNewProduct(this)
            return { error: false, res: {id: modelSaveRes.res.id} }
        }
        return { error: true, errorMessage: UNKNOWN_ERROR }
    }

    async delete(): Promise<boolean> {
        console.log('NO DELETE IMPLEMENTATION!')
        if(this.id === null) return false
        if(await super.delete(this.id)) {
            return this.$um.company.deleteProduct(this)
        }
        return false
    }

    checkProductValid(): boolean {
        return this.name.length > 0
            && this.companyId !== null
            && (this.price !== undefined && this.price > 0)
            && (this.unitId !== undefined && this.unitId > 0)
            && (this.count !== undefined && this.count > 0)
    }
}

/** Товар на складе, просто на хранении */
function isInStock(): boolean {
    return this.status === productStatesNames.inStock
}
/** Товар на складе, но уже продан */
function isSelled(): boolean {
    return this.status === productStatesNames.selled
}
/** Товар уже продан и отгружен */
function isDeleted(): boolean {
    return this.status === productStatesNames.deleted
}
