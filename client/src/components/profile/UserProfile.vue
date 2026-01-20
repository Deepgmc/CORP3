<template>
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <!-- Заголовок -->
    <div class="text-h6 q-mb-md">Профиль пользователя</div>

    <!-- Email -->
    <div class="row">
      <div class="col-12" style=" border:1px solid magenta;">
        ЛОГИН/ПАРОЛЬ ТУТ
      </div>
    </div>

    <!-- Имя и Фамилия в строку -->
    <div class="row">
      <!-- Имя -->
      <div class="col-12">
        <q-input
          v-model="form.firstName"
          label="Имя *"
          :rules="[val => !!val || 'Поле обязательно для заполнения']"
          outlined
          dense
        />
      </div>

      <!-- Фамилия -->
      <div class="col-12">
        <q-input
          v-model="form.lastName"
          label="Фамилия *"
          :rules="[val => !!val || 'Поле обязательно для заполнения']"
          outlined
          dense
        />
      </div>
    </div>

    <!-- Email -->
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="form.email"
          label="Email *"
          type="email"
          :rules="[
            val => !!val || 'Поле обязательно для заполнения',
            val => /.+@.+\..+/.test(val) || 'Введите корректный email'
          ]"
          outlined
          dense
        />
      </div>
    </div>

    <!-- Телефон -->
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="form.phone"
          label="Телефон"
          mask="+# (###) ###-##-##"
          fill-mask
          hint="Формат: +7 (123) 456-78-90"
          :rules="[
            val => !val || /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(val) || 'Неверный формат телефона'
          ]"
          outlined
          dense
        />
      </div>
    </div>

    <!-- Дата рождения -->
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="form.birthDate"
          label="Дата рождения"
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="form.birthDate" mask="DD.MM.YYYY" today-btn>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="OK" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <!-- Город (с авто-предложением) -->
    <div class="row">
      <div class="col-12">
        <q-select
          v-model="form.city"
          :options="cityOptions"
          label="Город"
          use-input
          @filter="filterCities"
          outlined
          dense
        />
      </div>
    </div>

    <!-- О себе (текстовое поле) -->
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="form.bio"
          label="О себе"
          type="textarea"
          autogrow
          outlined
          dense
          :rules="[
            val => !val || val.length <= 500 || 'Максимум 500 символов'
          ]"
          counter
        />
      </div>
    </div>

    <!-- Пол (радио-кнопки) -->
    <div class="row">
      <div class="col-12">
        <div class="q-mt-sm">
          <div class="q-mb-xs text-caption">Пол</div>
          <q-option-group
            v-model="form.gender"
            :options="genderOptions"
            color="primary"
            inline
          />
        </div>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="row q-gutter-sm">
      <q-btn label="Сохранить" type="submit" color="primary" />
      <q-btn label="Сбросить" type="reset" color="grey" flat />
      <q-btn label="Отмена" @click="onCancel" color="negative" flat />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Модель формы
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  city: null,
  bio: '',
  gender: null,
})

// Опции для полей
const genderOptions = [
  { label: 'Мужской', value: 'male' },
  { label: 'Женский', value: 'female' },
  { label: 'Другой', value: 'other' }
]

const allCities = ref([
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
  'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону'
])
const cityOptions = ref(allCities.value)

// Методы
const filterCities = (val: string, update: (...args: any[]) => any) => {
  update(() => {
    const needle = val.toLowerCase()
    cityOptions.value = allCities.value.filter(
      v => v.toLowerCase().indexOf(needle) > -1
    )
  })
}

const onSubmit = async () => {
  try {
    // Здесь обычно API-запрос
    console.log('Данные формы:', JSON.stringify(form, null, 2))

    $q.notify({
      type: 'positive',
      message: 'Профиль успешно сохранен!',
      position: 'top'
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка сохранения профиля',
      position: 'top'
    })
  }
}

const onReset = () => {
  Object.assign(form, {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    city: null,
    bio: '',
    gender: null,
  })
}

const onCancel = () => {
  $q.dialog({
    title: 'Отмена',
    message: 'Все несохраненные изменения будут потеряны. Продолжить?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    onReset()
    // Здесь может быть переход на другую страницу
    $q.notify('Действие отменено')
  })
}
</script>

<style scoped lang="scss">
/* Дополнительные стили при необходимости */
.q-form {
  max-width: 600px;
}
</style>
