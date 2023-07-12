<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import logo from '../assets/logo.svg'


</script>

<template>
    <v-app-bar
        color="#1F4997"
        absolute
        height="88"
        flat
        class="app-bar"
    >
        <div class="responsive-header d-flex align-center flex-grow-1" >
            <v-icon style="width: 7rem; height: 2rem; ">
                <img :src="logo" alt="">
            </v-icon>
            <v-app-bar-title class="responsive-text text-sm-right">
                <p style="color: #fff;">Formulário de Comissionamento</p>
            </v-app-bar-title>
        </div>
    </v-app-bar>
</template>

<style>
    .responsive-header{
        padding: 9.5rem;
    }
    @media screen and (max-width:920px) {
        .app-bar{
            height: 6.5rem;
            padding: 1rem 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .responsive-header{
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            justify-content: center;
            padding: 0rem;
        }
        .responsive-text{
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
