<template>
    <grid-view
        :gridCols="gridCols"
        :sortField="gridCols.sortField.bind(gridCols)"
    >
        <template #actions_caption>
            <q-icon
                class="gv-edit_buttons-positive"
                name="edit"
            />
        </template>

        <template #actions_buttons="slotProps">
            <q-icon
                class="gv-edit_buttons-positive"
                name="visibility"
                @click="viewDealDetails"
                :size="'sm'"
                :data-itemId="slotProps.itemId"
            />
        </template>
    </grid-view>
</template>

<script setup lang="ts">
import GridView from '../grid/GridView.vue';
import { onMounted, ref } from 'vue';
import { GridCols } from '@/composables/gridView/GridColsManager';
import { dealAvailableCols } from '@/composables/gridView/GridColumnOptions';
import { Rbac } from '@/entities/Rbac';
import { inject } from 'vue';
import { rbacSym } from '@/utils/injecttionSymbols';

// const organizationStore = useOrganizationStore();
const $userManager = inject<Rbac>(rbacSym) as Rbac;

const deals = $userManager.company.deals

// Define required columns for deals grid
const requiredDealCols = ref(['partnerId', 'partnerCompanyId', 'reg_date', 'shipment_date', 'discount']);
// Create grid columns configuration for deals
const gridCols = new GridCols(
    requiredDealCols.value,
    dealAvailableCols,
    deals,
    'dealId',
    'deals',
    'view',
    8
);

// Function to view deal details
function viewDealDetails(e: MouseEvent) {
    if (!(e.target instanceof HTMLElement) || typeof e.target.dataset.itemid === 'undefined') return;
    const itemId: number = Number.parseInt(e.target.dataset.itemid);
    // TODO: Implement deal details view
    console.log('View deal details:', itemId);
}

// Load deals when component is mounted
onMounted(async () => {
    if (deals.length === 0) {
        await $userManager.company.getDeals();
    }
});
</script>
