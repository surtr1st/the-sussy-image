<template>
    <label for="image-input" 
        class="button-choose-directory 
            btn-w-large
            bg-gradient gradient-button bg-size
            rounded-small
            fade-all
            slide-downward
            image-upload
            grid
            mt-medium
            balance-x">
            <font-awesome-icon icon="fa-solid fa-folder-open" />
            {{ title }}
    </label>
    <input id="image-input" 
        class="image-input-hidden" 
        type="file" 
        @change="$emit('images-from-directory', addImagesFromDirectory())" 
        accept="image/*"
        multiple>
</template>

<script setup>

import { FileRetrieve } from '../services/AppReactivity'
import { ref } from 'vue'

defineProps({
    title: String
})



/** @DESC Get and add images from chosen directory **/
const addImagesFromDirectory = () => {

    const sizes = ref([])

    let fileInput = document.getElementById("image-input")

    if(fileInput.files[0] == undefined)
        return

    // #- Cocktail Sort -#
    let swapped = true
    let start = 0
    let end = fileInput.files.length

    // Use `sizes` to add size and file data for sorting purposes
    for(let i = 0; i < fileInput.files.length; i++) {
        sizes.value.push({
            key: fileInput.files[i].size,
            fileValue: fileInput.files[i]
        })
    }

    while (swapped == true) {

        swapped = false

        for (let i = start; i < end - 1; ++i) {
            if (sizes.value[i].key > sizes.value[i + 1].key) {
                let temp = sizes.value[i]
                sizes.value[i] = sizes.value[i + 1]
                sizes.value[i + 1] = temp
                swapped = true
            }
        }

        if (swapped == false)
            break;

        swapped = false

        end = end - 1

        for (let i = end - 1; i >= start; i--) {
            if (sizes.value[i].key > sizes.value[i + 1].key) {
                let temp = sizes.value[i]
                sizes.value[i] = sizes.value[i + 1]
                sizes.value[i + 1] = temp
                swapped = true
            }
        }
        start = start + 1
    }
    // #- Cocktail Sort -#

    // Add sorted data into the reactive data array
    for(const file of sizes.value) {
        FileRetrieve.sortedFile.push(file.fileValue)
        FileRetrieve.filesSize.push(file.key)
    }
}

</script>

<style lang="scss" scoped>

@import "../assets/sass/global.sass";
@import "../assets/sass/choose-button.sass";
</style>