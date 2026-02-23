<template>
    <div class="row">
        <template v-for="prop in skillsToRender" :key="prop.id">
            <q-chip
                :removable="removable"
                :size="size"
                color="teal"
                text-color="white"
                @remove="$emit('remove-skill', prop.id)"
            >
                {{ prop.skill }}
            </q-chip>
        </template>
        <div
            v-if="!alwaysShowAll && maxQuantity && skills.length > 0 && !showAll"
            class="row items-end pointer"
            @click="showAllProps"
        >
            . . .
        </div>
    </div>

    <div class="row assertion_block" v-if="needAssession">
        <q-form @submit="addSkill">
            <q-input v-model="newSkill" label="Добавить навык">
                <template #append>
                    <q-icon @click="addSkill" name="add" class="pointer" />
                </template>
            </q-input>
        </q-form>
    </div>
</template>

<script setup lang="ts">
import type { TSkill } from '@/interfaces/User';
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{
    skills        : TSkill[],
    needAssession : boolean,
    maxQuantity  ?: number,
    size         ?: string,
    removable    ?: boolean,
    alwaysShowAll?: boolean,
}>(),
{
    maxQuantity  : 3,
    size         : 'md',
    removable    : true,
    alwaysShowAll: false,
})
const emit = defineEmits(['remove-skill', 'add-skill'])

const showAll = ref(false)

const skillsToRender = computed(() => {
    if(props.alwaysShowAll === true || showAll.value === true) return props.skills
    return props.skills.slice(0, props.maxQuantity)
})

function showAllProps(){
    showAll.value = true
}

const newSkill = ref<string>('')
function addSkill() {
    emit('add-skill', newSkill.value)
    newSkill.value = ''
}

</script>
