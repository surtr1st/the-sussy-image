<template>
    <div class="flex-center">
        <ChooseDirectoryButton 
            id="choose-label"
            title="Choose" 
            @images-from-directory="chosenDirectory()" />
        <label
            id="start-progress-label"
            for="start-progress"
            class="button-start
                btn-w-large
                bg-gradient-success gradient-button-success bg-size
                rounded-small
                fade-all
                slide-downward
                image-upload
                grid
                mt-medium
                balance-x"
            v-show="check.isClick && isChosen">
            <font-awesome-icon icon="fa-solid fa-circle-play" />
            Start
        </label>
        <input id="start-progress" 
            class="image-input-hidden" 
            type="submit" 
            @click="doCompare()">
        <label
            id="clear-image-label"
            for="clear-image"
            class="button-start
                btn-w-large
                bg-gradient-danger gradient-button-danger bg-size
                rounded-small
                fade-all
                slide-downward
                image-upload
                grid
                mt-medium
                balance-x"
            v-show="isDone">
            <font-awesome-icon icon="fa-solid fa-trash" />
            Clear
        </label>
        <input id="clear-image" 
            class="image-input-hidden" 
            type="submit" 
            @click="clearImages()">
    </div>
    <div id="scrollbar-style"
        class="file-large-icon
            slide-upward
            col-12 
            drop-shadow-low 
            scrollbar 
            force-overflow">
        <div id="image-holder" 
            class="image-container flex-center">
        </div>
    </div>
</template>

<script setup>

import 'jszip'
import ChooseDirectoryButton from './ChooseDirectoryButton.vue'
import { check, FileRetrieve, HASH_DATA } from '../services/AppReactivity'
import { ref } from 'vue'


// # Define variables
const isChosen = ref(false)
const isDone = ref(false)

/** @DESC Get all images data from reactive array data **/
async function chosenDirectory() {

    let imageHolder = document.getElementById('image-holder')

    for (const file of FileRetrieve.sortedFile) {

        let image = document.createElement('img')
        image.setAttribute('id', 'image')
        image.src = URL.createObjectURL(file)
        imageHolder.appendChild(image)

        let promise = new Promise((resolve) => {
            setTimeout(() => resolve(
                image.setAttribute('class', 'border fading-in')
            ), 25)
        })
        await promise

        // Read hash function type SHA256 of a file
        var reader = new FileReader()
        reader.onload = function (ev) {
            //
            crypto.subtle
                .digest("SHA-256", ev.target.result)
                .then((hashBuffer) => {
                    // Convert hex to hash, see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join(""); // convert bytes to hex string

                    // Add the hash of each file to the reactive array
                    HASH_DATA.retrieve.FilesHash.push(hashHex)
                })
                .catch((ex) => console.error(ex))
        }
        reader.onerror = function (err) {
            console.error("Failed to read file", err)
        }
        reader.readAsArrayBuffer(file)
    }

    isChosen.value = true

}


/** @DESC Proceed to make a comparison of the chosen image with other images **/
async function doCompare() {
    let images = document.querySelectorAll('#image')
    const len = HASH_DATA.retrieve.FilesHash.length
    const imageChosen = HASH_DATA.retrieve.FileHash

    for (let i = 0; i < len; i++) {
        let promiseStart = new Promise((resolve) => {
            setTimeout(() => resolve((
                images[i].classList.add('find')
            )), 10)
        })
        await promiseStart

        let promiseBeforeSkip = new Promise((resolve) => {
            setTimeout(() => resolve((
                images[i].classList.remove('find')
            )), 150)
        })
        await promiseBeforeSkip

        let promiseSkip = new Promise((resolve) => {
            setTimeout(() => resolve((
                images[i].classList.add('skip')
            )), 10)
        })
        await promiseSkip

        if (imageChosen === HASH_DATA.retrieve.FilesHash[i] || FileRetrieve.chosenFile === FileRetrieve.filesSize[i]) {
            let promiseFinal = new Promise((resolve) => {
                setTimeout(() => resolve((
                    images[i].classList.add('reveal')
                )), 20)
            })
            await promiseFinal
        }
    }

    isDone.value = true

}

/** @DESC Clear all images from the container after finish the comparison **/
async function clearImages() {

    let imageHolder = document.getElementById('image-holder')
    let images = document.querySelectorAll('#image')
    const len = FileRetrieve.sortedFile.length

    for(let i = 0; i < len; i++) {
        let promiseBeforeStart = new Promise((resolve) => {
            setTimeout(() => resolve(
                images[i].classList.add('fading-out')
            ), 25)
        })
        await promiseBeforeStart
    }

    for(let i = 0; i < len; i++) {
        images[i].removeAttribute('class')
        imageHolder.removeChild(images[i])
    }

    HASH_DATA.retrieve.FilesHash = new Array()
    FileRetrieve.sortedFile = new Array()
}

</script>

<style lang="scss">
@import "../assets/sass/choose-button.sass";
@import "../assets/sass/file-container.sass";
@import "../assets/sass/animations.sass";

.find {
    border: 1px solid hsl(0, 92%, 63%);
    background: hsl(0, 92%, 63%);
    transform: scale(0.7);
    transition: all 1.5s cubic-bezier(0,0,1,.15)
}

.skip {
    border: 1px solid hsl(239, 92%, 63%);
    transform: scale(1);
    background: none;
    transition: all 1.5s cubic-bezier(0,0,1,.15)
}

.reveal {
    width: 30%;
    border: 10px solid hsl(156, 100%, 50%);
    transition: all 1.5s cubic-bezier(0,0,1,.15)
}

</style>