<template>
<div class="row q-col-gutter-md deals-form-row">
        <!-- Левый столбец: контрагент и выбор товаров -->
        <div class="col-12 col-md-3">
            <q-card flat bordered class="full-height">
                <q-card-section>
                    <div class="text-h6 text-weight-medium q-mb-md">
                        Моя компания
                        {{ dealForm.companyName || 'Название компании' }}
                    </div>
                    <div class="text-caption text-grey-7 q-mb-sm">Товары на складе</div>
                    <q-list dense padding class="rounded-borders">
                        <q-item
                            v-for="item in lineItems"
                            :key="item.id"
                            dense
                            class="q-px-none"
                        >
                            <q-item-section side>
                                <q-checkbox
                                    v-model="item.selected"
                                    dense
                                    color="primary"
                                />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>{{ item.name }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </div>

        <!-- Центр: параметры сделки -->
        <div class="col-12 col-md-6">
            <q-card flat bordered class="full-height">
                <q-card-section>
                    <div class="text-subtitle1 text-weight-medium q-mb-md">Информация о сделке</div>
                    <q-form class="q-gutter-y-sm" @submit.prevent="onConcludeDeal">
                        <q-input
                            v-model="dealForm.companyName"
                            label="Название компании"
                            outlined
                            dense
                        />
                        <q-input
                            v-model="dealForm.representatives"
                            label="Имена представителей компании"
                            outlined
                            dense
                            type="textarea"
                            autogrow
                        />
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-sm-6">
                                <q-input
                                    v-model="dealForm.dealDate"
                                    label="Дата сделки"
                                    outlined
                                    dense
                                    type="date"
                                />
                            </div>
                            <div class="col-12 col-sm-6">
                                <q-input
                                    v-model="dealForm.shipmentDate"
                                    label="Дата отгрузки"
                                    outlined
                                    dense
                                    type="date"
                                />
                            </div>
                        </div>
                        <q-input
                            v-model.number="dealForm.discountPercent"
                            label="Размер скидки, %"
                            outlined
                            dense
                            type="number"
                            :rules="[val => val >= 0 && val <= 100 || '0–100']"
                        />
                        <div class="row justify-end q-mt-md">
                            <q-btn
                                type="submit"
                                color="primary"
                                unelevated
                                icon="handshake"
                                label="Заключить сделку"
                            />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>

        <!-- Правый столбец: те же товары с удалением -->
        <div class="col-12 col-md-3">
            <q-card flat bordered class="full-height">
                <q-card-section>
                    <div class="text-caption text-grey-7 q-mb-sm">Позиции (удаление)</div>
                    <q-list dense padding class="rounded-borders">
                        <q-item
                            v-for="item in lineItems"
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
                                    @click="removeLineItem(item.id)"
                                />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </div>
    </div>

    <q-separator class="q-my-lg" />

    <div class="text-subtitle2 q-mb-sm">Существующие сделки</div>
    <div v-for="deal in deals" :key="deal.dealId" class="text-body2 q-mb-xs">
        {{ deal.dealId }} — {{ deal.ownerId }} — {{ deal.partnerId }}, скидка: {{ deal.discount }}
    </div>
</template>

<script setup lang="ts">
import { inject, reactive, ref } from 'vue';
import { Rbac } from '@/entities/Rbac';
import { rbacSym } from '@/utils/injecttionSymbols';

const $userManager = inject<Rbac>(rbacSym) as Rbac
const deals = $userManager.company.deals;

interface LineItem {
    id: number;
    name: string;
    selected: boolean;
}

const lineItems = ref<LineItem[]>([
    { id: 1, name: 'Ноутбук ProBook 15"', selected: false },
    { id: 2, name: 'Монитор 27" IPS', selected: false },
    { id: 3, name: 'Клавиатура механическая', selected: false },
    { id: 4, name: 'Сетевой коммутатор 24 порта', selected: false },
    { id: 5, name: 'Кабель питания IEC 1.8 м', selected: false },
]);

const dealForm = reactive({
    companyName: 'Dummy company',
    representatives: '',
    dealDate: '',
    shipmentDate: '',
    discountPercent: 0,
});

function removeLineItem(id: number): void {
    lineItems.value = lineItems.value.filter((i) => i.id !== id);
}

function onConcludeDeal(): void {
    // заглушка: сюда позже можно подключить сохранение сделки
}
</script>
