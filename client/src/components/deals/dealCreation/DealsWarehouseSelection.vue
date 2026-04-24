<template>
<div class="row q-col-gutter-md">
    <div class="col-12">
        <span class="text-h5">{{ props.caption || '' }}</span>
    </div>
</div>
<div class="row">
    <!-- Левый столбец: контрагент и выбор товаров -->
    <div class="col-12 col-md-4">
        <div class="row">
            <div class="col-12">
                <q-card>
                    <q-card-section>
                        <div class="text-h6 text-weight-medium q-mb-md">
                            {{ ownerCompany?.name || 'Название компании' }}
                        </div>
                        <div class="text-caption q-mb-sm">Товары на складе</div>
                        <q-list dense padding class="rounded-borders">
                            <q-item
                                v-for="item in myWarehouse"
                                :key="item.id"
                                dense
                                class="q-px-none underlined-line pointer dnd-line"
                            >
                                <q-item-section
                                    draggable="true"
                                    @drop="dropItem($event)"
                                    @dragstart="dragItem($event, item.id)"
                                >
                                    <q-item-label>
                                        {{ item.getTextWithUnit(unitsDict as Dictionary<IUnit>) }}
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>

    <!-- Центр: параметры сделки -->
    <div class="col-12 col-md-4 center_container">
        <div class="row center_row">
            <div
                class="block_dnd q-pa-xl"
                droppable="true"
                @drop="dropProduct($event)"
                @dragenter.prevent=""
                @dragover.prevent=""
            >
                Перетащите материалы сюда
            </div>
        </div>
    </div>

    <!-- Правый столбец: те же товары с удалением -->
    <div class="col-12 col-md-4">
        <q-card flat bordered>
            <q-card-section>
                <div class="text-h6 text-weight-medium q-mb-md">
                    {{ partnerCompany?.name || 'Название компании' }}
                </div>
                <div class="text-caption q-mb-sm">Товары в сделке</div>
                <q-list dense padding class="rounded-borders">
                    <q-item
                        v-for="item in deal.deferredWarehouse"
                        :key="item.id"
                        dense
                        class="q-px-none"
                    >
                        <q-item-section>
                            <q-item-label>{{ item.getTextWithUnit(unitsDict as Dictionary<IUnit>) }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn
                                flat
                                round
                                dense
                                icon="close"
                                color="negative"
                                aria-label="Удалить позицию"
                                @click="removeProductFromDeferred(item.id)"
                            />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </div>
</div>

<div class="row">
    <div class="col-12 col-md-4 offset-md-4 pointer">Drop product quantity: {{ dropProductQuantity }}</div>
</div>


 <q-dialog v-model="dropProductPrompt" persistent>
    <q-card style="min-width: 350px">
        <q-card-section>
            <div class="text-h6">Количество к поставке</div>
            <div v-if="draggingProduct && draggingProduct.id">
                {{ draggingProduct.getTextWithUnit(unitsDict as Dictionary<IUnit>) }}
            </div>
        </q-card-section>

        <q-form @submit.prevent="submitQuantity">
            <q-card-section class="q-pt-none">
            <q-input
                type="number"
                dense
                persistent="true"
                maximized="true"
                autofocus
                v-model="dropProductQuantity"
                :rules="[val => draggingProduct && draggingProduct.checkIsRequestedQuantityValid(val) || 'Столько товара нет на складе']"
                @keyup.enter="resetDragging"
            />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Отмена" @click="resetDragging" />
                <q-btn flat label="Подтвердить" type="submit" />
            </q-card-actions>
        </q-form>
    </q-card>
</q-dialog>
</template>

<script setup lang="ts">
    import { computed, inject, ref } from 'vue';
    import { dragItem, dropItem, type TDropResult } from '@/utils/helpers/dnd'
    import { Rbac } from '@/entities/Rbac';
    import { rbacSym } from '@/utils/injecttionSymbols';
    import type { IDeal } from '@/interfaces/ProductsDeals';
    import { useDictStore } from '@/stores/dictStore'
    import Dictionary from '@/utils/Dictionary';
    import type { IUnit } from '@/interfaces/Company';
    import Product from '@/entities/warehouse/Product';
    import { notifyTypes, useNotify } from '@/composables/notifyQuasar';
    import { UNKNOWN_ERROR } from '@/utils/constants/texts';
    const notify = useNotify()
    const dropProductPrompt = ref(false)
    const dropProductQuantity = ref<number>()
    const draggingItemId = ref<number>(0)

    const $userManager = inject<Rbac>(rbacSym) as Rbac
    const myWarehouse = $userManager.company.warehouse
    const { units: unitsDict, companies: companiesDict } = useDictStore()

    const props = defineProps<{
        caption?: string,
        deal: IDeal
    }>()
    const emit = defineEmits(['add-product-to-deferred'])

    const draggingProduct = computed(() => {
        return myWarehouse.find((product: Product) => product.id === draggingItemId.value)
    })

    if(!props.deal.partnerCompanyId) {
        throw new Error('Unexpected error')
    }

    const ownerCompany = companiesDict.getItemById(props.deal.ownerCompanyId)
    const partnerCompany = companiesDict.getItemById(props.deal.partnerCompanyId)

    function dropProduct(event: DragEvent): void {
        //непосредственно днд обрабатываем тут
        const dropResult: TDropResult = dropItem(event)
        if(typeof dropResult === 'boolean') {
            throw new Error('Error dnd')
        }
        draggingItemId.value = dropResult.draggingItemId
        dropProductPrompt.value = true

    };

    /** Подтверждаем переносимый в сделку товар, устанавливаем количество */
    function submitQuantity(): void {
        if(!draggingProduct.value || !dropProductQuantity.value) {
            notify.run(UNKNOWN_ERROR, notifyTypes.err)
            return
        }

        //отнять количество
        //обновить список склада
        //обновить список поставки
        //проделать тоже самое при сохранении сделки - уже на сервере (возможно)

        emit('add-product-to-deferred', new Product({...draggingProduct.value, count: dropProductQuantity.value}))
        draggingProduct.value.decreaseQuantity(dropProductQuantity.value)
        resetDragging()
    }

    /** удаляем добавленный к поставке товар */
    function removeProductFromDeferred(id: number) {
        const quantity = props.deal.removeDeferredProduct(id)
        if(!quantity) return
        const warehouseProduct = myWarehouse.find((product: Product) => product.id === id)
        if(warehouseProduct){
            warehouseProduct.increaseQuantity(+quantity)
        }
    }

    /** Отменяем перенос товара, откатываем всё назад */
    function resetDragging() {
        dropProductPrompt.value = false
        draggingItemId.value = 0
        dropProductQuantity.value = undefined
    }

</script>

<style lang="scss">
    .dnd-line {
        &:hover {
            background-color: rgb(192, 255, 255);
        }
    }

    .center_container {
        display: flex;
    }

    .center_row {
        flex: 1;
        min-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .block_dnd {
        border: 2px dotted lightgrey
    }
</style>
