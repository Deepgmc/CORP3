<script setup lang="ts">
//import { useQuasar } from 'quasar'

defineProps<{
  msg: string
}>()
function doSomething(){
  console.log('%c doSomething:', 'color:rgb(182, 86, 158);', 123)
}
// const $q = useQuasar()
// console.log($q.version)
</script>

<template>
    <h1 class="green">{{ msg }}</h1>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

      <q-btn @click="doSomething" label="Do something" class="bg-positive text-deep-orange-14" />
      <q-icon name="alarm" />

      <div class="test-variables q-mb-md q-mt-md q-ml-md q-mr-md">GGG</div>

      <div class="row q-mt-xl">
        <div class="col-8">two thirds</div>
        <div class="col-4">one sixth</div>
        <div class="col-auto">auto size based on content and available space</div>
        <div class="col">fills remaining available space</div>
        <div class="col-12">111</div>
        <div class="col-auto">222</div>
      </div>

      <div class="row q-mt-xl">
        <div class="col-lg-4 col-md-6 col-xs-12">111</div>
        <div class="col-lg-4 col-md-6 col-xs-12">111</div>
        <div class="col-lg-4 col-md-12 col-xs-12">222</div>
      </div>


      <!--!!!!!!!! Хороший пример резиновой вёрстки, но без указания точного количества столбцов -->
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



      <q-badge>height</q-badge>
      <div class="q-pa-md example-row-horizontal-alignment">
        <q-badge>justify-start</q-badge>
        <div class="row justify-start">
          <div class="col-4">
            One of two cols
          </div>
          <div class="col-4">
            One of two cols
          </div>
        </div>

        <q-badge>justify-center</q-badge>
        <div class="row justify-center">
          <div class="col-4">
            One of two cols
          </div>
          <div class="col-4">
            One of two cols
          </div>
        </div>

        <q-badge>justify-end</q-badge>
        <div class="row justify-end">
          <div class="col-4">
            One of two cols
          </div>
          <div class="col-4">
            One of two cols
          </div>
        </div>

        <q-badge>justify-around</q-badge>
        <div class="row justify-around">
          <div class="col-4">
            One of two cols
          </div>
          <div class="col-4">
            One of two cols
          </div>
        </div>

        <q-badge>justify-between</q-badge>
        <div class="row justify-between">
          <div class="col-4">
            One of two cols
          </div>
          <div class="col-4">
            One of two cols
          </div>
        </div>

        <q-badge>justify-evenly</q-badge>
        <div class="row justify-evenly">
          <div class="col-4">
            One of two cols
          </div>
          <div class="col-4">
            One of two cols
          </div>
        </div>
      </div>
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
