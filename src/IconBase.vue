<script setup lang="ts">
  type IconsProp ={
    width:string,
    height:string,
    iconName: string,
    iconColor:string
  }

  const props = defineProps<IconsProp>()
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="props.width"
    :height="props.height"
    viewBox="0 0 18 18"
    :aria-labelledby="props.iconName"
    role="presentation"
  >
    <title
      :id="iconName"
      lang="en"
    >{{ props.iconName }} icon</title>
    <g :fill="props.iconColor">
      <slot />
    </g>
  </svg>
</template>