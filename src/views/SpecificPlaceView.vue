<template>
    <div class="row mt-large">
        <Navbar class="col-12"/>
        <div class="col-6 mt-large">
            <FileData />
        </div>
        <div class="col-6">
            <FileContainer />
        </div>
    </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import FileData from '../components/FileData.vue';
import FileContainer from '../components/FileContainer.vue';
</script>

<style lang="scss" scoped>
@import '../assets/sass/global.sass';
@import '../assets/sass/responsive.sass';
</style>