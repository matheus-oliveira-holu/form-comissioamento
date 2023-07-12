<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">

type PropsLabel ={
  text: string
  nameInput: string
}
const props = defineProps<PropsLabel>()
  
</script>

<template>
  <label class="label-styled">{{ props.text}}</label>
</template>

<style>
  .label-styled {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    color: #333;
    letter-spacing: 0.05em;

    &::first-letter{
      text-transform: capitalize;
    }
  }
  
</style>