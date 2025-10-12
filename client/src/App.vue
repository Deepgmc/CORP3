<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
    <h1 class="green">{{ msg }}</h1>
    <q-btn label="Do something" class="bg-positive text-deep-orange-14"></q-btn>

    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <q-btn label="Do something" class="bg-positive text-deep-orange-14"></q-btn>
    <!-- Хороший пример резиновой вёрстки, но без указания точного количества столбцов -->
    <div class="q-mt-xl">
      <div class="row">
        <div class="col-12 col-md-8">.col-12 .col-md-8</div>
        <div class="col-12 col-md-4">.col-12 .col-md-4</div>
      </div>
      <div class="row">
        <div class="col-12 col-md">.col-12 .col-md</div>
        <div class="col-12 col-md">.col-12 .col-md</div>
        <div class="col-12 col-md">.col-12 .col-md</div>
      </div>
    </div>
    <!--END Хороший пример резиновой вёрстки, но без указания точного количества столбцов -->
</template>

<style lang="scss">
.test-variables{
  color: $negative;
  border:1px solid $warning;
}
.row{
  border:1px solid blue;
  div {
    border:1px solid red;
    color: $secondary;
  }
  .content-center{
    justify-content: center;
    text-align: center;
  }
}
</style>
