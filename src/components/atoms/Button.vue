<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
type ButtonProps = {
  title: string
}

const props = defineProps<ButtonProps>()
</script>

<template>
  <button type="button">{{ props.title }}</button>
</template>

<style>
  button{
    width: 8rem;
    padding: 1rem;
    border: none;
    border-radius: 6px;
    background-color: #FFF;
    color: rgb(74, 117, 181);
    cursor: pointer;

    &:hover{
      opacity: .8;
    }
  }
</style>