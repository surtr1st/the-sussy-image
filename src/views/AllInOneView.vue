<template>
    <div class="row">
        <div class="flex-center col-12">
            <label 
                id="image-input-label"
                for="image-input" 
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
                Choose
            </label>
            <input 
                id="image-input"
                class="image-input-hidden" 
                type="file" 
                :disabled="isDone"
                @change="chosenDirectory()" 
                accept="image/*"
                webkitdirectory
                multiple>
            <label
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
                balance-x">
                <font-awesome-icon icon="fa-solid fa-trash" />
                Clear
            </label>
            <input
                id="clear-image" 
                class="image-input-hidden" 
                type="submit" 
                @click="clearImages()">
        </div>
        <div 
            id="scrollbar-style" 
            class="file-large-icon-full
            slide-upward
            col-12 
            drop-shadow-low 
            scrollbar 
            force-overflow">
            <div id="image-holder" class="image-container-full flex-center">
            </div>
        </div>
    </div>
</template>

<script setup>
import 'jszip'
import { onUnmounted, ref } from 'vue'
import { FileRetrieve } from '../services/AppReactivity'

const FILES_HASH = ref(new Array())
const SORTED_FILES = ref(new Array())
const isDone = ref(false)

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
                sizes.value[i] = sizes.value[i + 1];
                sizes.value[i + 1] = temp
                swapped = true
            }
        }

        if (swapped == false)
            break

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
        SORTED_FILES.value.push(file.fileValue)
    }

}

/** @DESC Get all images data from reactive array data **/
async function chosenDirectory() {

    addImagesFromDirectory()

    let imageHolder = document.getElementById('image-holder')

    for (const file of SORTED_FILES.value) {

        let image = document.createElement('img');
        image.setAttribute('id', 'image-full')
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
                    FILES_HASH.value.push(hashHex)
                })
                .catch((ex) => console.error(ex))
        }
        reader.onerror = function (err) {
            console.error("Failed to read file", err)
        }
        reader.readAsArrayBuffer(file)
        
    }
    doCompare(SORTED_FILES.value.length)
}

/** @DESC Archive duplicated file hash **/
function toFindDuplicates(array) {
    const uniqueElements = new Set(array);
    const filteredElements = array.filter(item => {
        if (uniqueElements.has(item)) {
            uniqueElements.delete(item)
        } else {
            return item
        }
    })

    return [...new Set(filteredElements)]
}

/** @DESC Proceed to make a comparison of the chosen image with other images **/
async function doCompare(len) {
    let images = document.querySelectorAll('#image-full')
    let a = FILES_HASH.value

    let data = toFindDuplicates(a)

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

        if (data.length > 0) {
            for (let j = 0; j < len; j++) {
                if (a[j] === data[i]) {
                    images[j].classList.remove('skip')
                    let promiseBeforeSkip = new Promise((resolve) => {
                        setTimeout(() => resolve((
                            images[j].classList.add('reveal')
                        )), 50)
                    })
                    await promiseBeforeSkip
                    FileRetrieve.duplicated.push(SORTED_FILES.value[j])
                }
            }
        }
    }

    isDone.value = true

    let label = document.getElementById('image-input-label')
    await new Promise(resolve => {
        setTimeout(() => resolve((
            [
                label.classList.remove('bg-gradient'),
                label.classList.remove('gradient-button'),
                label.classList.remove('slide-downward'),
                label.classList.add('slide-downward-reverse'),
            ]
        )), 100)
    })
    await new Promise(resolve => {
        setTimeout(() => resolve((
            [
                label.classList.remove('slide-downward-reverse'),
                label.classList.add('slide-downward'),
                label.classList.add('bg-gradient-disabled'),
                label.classList.add('gradient-button-disabled')
            ]
        )), 100)
    })
   
}

/** @DESC Clear all images from the container after finish the comparison **/
async function clearImages() {

    let imageHolder = document.getElementById('image-holder')
    let images = document.querySelectorAll('#image-full')

    const len = SORTED_FILES.value.length

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

    FILES_HASH.value = new Array()
    SORTED_FILES.value = new Array()
    FileRetrieve.duplicated = new Array()

    isDone.value = false

    let label = document.getElementById('image-input-label')
    await new Promise(resolve => {
        setTimeout(() => resolve((
            [
                label.classList.remove('bg-gradient-disabled'),
                label.classList.remove('gradient-button-disabled'),
                label.classList.remove('slide-downward'),
                label.classList.add('slide-downward-reverse'),
            ]
        )), 100)
    })
    await new Promise(resolve => {
        setTimeout(() => resolve((
            [
                label.classList.remove('slide-downward-reverse'),
                label.classList.add('slide-downward'),
                label.classList.add('bg-gradient'),
                label.classList.add('gradient-button')
            ]
        )), 100)
    })
}

onUnmounted(() => {
    
    let imageHolder = document.getElementById('image-holder')
    let images = document.querySelectorAll('#image-full')

    const len = SORTED_FILES.value.length

    for(let i = 0; i < len; i++) {
        images[i].removeAttribute('class')
        imageHolder.removeChild(images[i])
    }

    FILES_HASH.value = new Array()
    SORTED_FILES.value = new Array()
    FileRetrieve.duplicated = new Array()
})

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