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
                                    <q-item-label>{{ item.name }} ({{ item.count }} {{ getUnitLabel(item.unitId, unitsDict as Dictionary<IUnit>) }})</q-item-label>
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
                class="block_dnd q-pa-lg br"
                droppable="true"
                @drop="dropProduct($event)"
                @dragenter.prevent=""
                @dragover.prevent=""
            >
                center dnd
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
                        v-for="item in deferredWarehouse"
                        :key="item.id"
                        dense
                        class="q-px-none"
                    >
                        <q-item-section>
                            <q-item-label>{{ item.name }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn
                                flat
                                round
                                dense
                                icon="close"
                                color="negative"
                                aria-label="Удалить позицию"
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
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="dropProductQuantity"
            autofocus
            @keyup.enter="dropProductPrompt = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Подтвердить" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
    import { inject, reactive, ref } from 'vue';
    import { dragItem, dropItem, type TDropResult } from '@/utils/helpers/dnd'
    import { Rbac } from '@/entities/Rbac';
    import { rbacSym } from '@/utils/injecttionSymbols';
    import type { IDeal, IProduct } from '@/interfaces/ProductsDeals';
    import { useDictStore } from '@/stores/dictStore'
    import Dictionary, { getUnitLabel } from '@/utils/Dictionary';
    import type { IUnit } from '@/interfaces/Company';
    const dropProductPrompt = ref(false)
    const dropProductQuantity = ref(null)



    const $userManager = inject<Rbac>(rbacSym) as Rbac
    const myWarehouse = $userManager.company.warehouse
    const { units: unitsDict, companies: companiesDict } = useDictStore()

    const props = defineProps<{
        caption?: string,
        deal: IDeal
    }>()

    if(!props.deal.partnerCompanyId) {
        throw new Error('Unexpected error')
    }

    const ownerCompany = companiesDict.getItemById(props.deal.ownerCompanyId)
    const partnerCompany = companiesDict.getItemById(props.deal.partnerCompanyId)

    const deferredWarehouse = reactive<IProduct[]>([])

    function dropProduct(event: DragEvent): void {
        //непосредственно днд обрабатываем тут
        const dropResult: TDropResult = dropItem(event)
        if(typeof dropResult === 'boolean') {
            throw new Error('Error dnd')
        }
        const { draggingItemId } = dropResult
        console.log('DraggedItem:', draggingItemId)
        dropProductPrompt.value = true
        dropProductQuantity.value = null

        //и тут пересчет массивов
    };
</script>

<style lang="scss">
    .dnd-line {
        &:hover {
            background-color: rgb(192, 255, 255);;
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
</style>
