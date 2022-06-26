<template>
    <div class="">
        <div class="text-center mt-xlarge slide-downward">
            <h2>DUPLICATED FILES</h2>
        </div>
        <div id="scrollbar-style" 
            class="file-large-icon-duplicated
            drop-shadow-low 
            scrollbar 
            force-overflow">
            <div id="image-holder" 
                class="image-container-duplicated flex-center">
            </div>
        </div>
        <div id="scrollbar-style" 
            class="
            source-text
            drop-shadow-low 
            scrollbar 
            force-overflow">
            <div id="source-holder" 
                class="flex flex-cols">
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "@vue/runtime-core";
import { FileRetrieve } from "../services/AppReactivity";

const getFile = ref(FileRetrieve.duplicated)

const retrieveDuplicated = async (files) => {

    let imageHolder = document.getElementById('image-holder')
    let sourceHolder = document.getElementById('source-holder')

    for(const file of files) {
        let source = document.createElement('p')
        source.setAttribute('id', 'text-box')
        source.innerText = file.path
        sourceHolder.appendChild(source)

        let image = document.createElement('img')
        image.setAttribute('id', 'image-duplicated')
        image.src = URL.createObjectURL(file)
        imageHolder.appendChild(image)

        await new Promise((resolve) => {
            setTimeout(() => resolve(
                image.setAttribute('class', 'border fading-in')
            ), 25)
        })

        await new Promise((resolve) => {
            setTimeout(() => resolve(
                source.setAttribute('class', 'slide-downward')
            ), 25)
        })
    }
}

onMounted(() => {
    retrieveDuplicated(getFile.value)
})

onUnmounted(() => {
    getFile.value = null
})


</script>

<style lang="scss" scoped>
@import "../assets/sass/choose-button.sass";
@import "../assets/sass/file-container.sass";
@import "../assets/sass/duplicated.sass";
@import "../assets/sass/animations.sass";
h2 {
    color: white;
}
</style>