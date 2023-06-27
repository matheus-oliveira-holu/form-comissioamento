<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import { Field, ErrorMessage, useField } from 'vee-validate'

  type PropsInput ={
    typeInput: string,
    placeholderInput: string
    requiredInput: boolean,
    nameInput: string

  }
  
  function getFileAcceptValue(){
    if(props.typeInput === 'file'){
      return 'images/*'
    }else{
      return null
    }
  }

  const props = defineProps<PropsInput>()
  const { errorMessage, value } = useField(props.nameInput)
</script>

<template>
  <Field 
    class="input-styled" 
    :class="{'input-error':!!errorMessage}"
    :name="props.nameInput"
    v-model="value" 
    :type="props.typeInput" 
    :placeholder="props.placeholderInput" 
    :required="props.requiredInput"
    multiple  
    :accept="getFileAcceptValue"
  />
  <ErrorMessage
    class="erro-message"
    :name="props.nameInput"
  />
</template>

<style>
  .input-styled{
    width: 50%;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #3f3f3f;
    padding: 0.5rem;
    outline: none;
  }
  .input-error{
    border-bottom:1px solid  rgb(217,48,37);
    
  }
  .erro-message{
    padding: .5rem;
    color: rgb(217,48,37);
    font-weight: medium;
    font-size: 12px;
  }
</style>