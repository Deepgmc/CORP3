<template>
    <div class="row">
        <template v-for="prop in props.skills" :key="prop.id">
            <q-chip
                removable
                color="teal"
                text-color="white"
                @remove="$emit('remove-skill', prop.id)"
            >
                {{ prop.skill }}
            </q-chip>
        </template>
    </div>

    <div class="row" v-if="needAssession">
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
import { ref } from 'vue';

const props = defineProps<{
    skills: TSkill[],
    needAssession: boolean,
}>()
const emit = defineEmits(['remove-skill', 'add-skill'])

const newSkill = ref<string>('')

function addSkill() {
    emit('add-skill', newSkill.value)
    newSkill.value = ''
}

</script>
