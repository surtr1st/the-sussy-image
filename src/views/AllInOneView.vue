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
                accept="image/.gif,.jpg,.png"
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
            <label
                for="file-count" 
                v-show="isLoaded"
                class="button-start
                bg-gradient-no-hover gradient-button-no-hover bg-size
                btn-w-large
                rounded-small
                fade-all
                slide-downward
                image-upload
                grid
                mt-medium
                balance-x">
                {{ total }}
            </label>
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
import { onMounted, onBeforeUnmount, onUnmounted, ref } from 'vue'
import { FileRetrieve } from '../services/AppReactivity'

const FILES_HASH = ref(new Array()) 
const SORTED_FILES = ref(new Array())
const isLoaded = ref(false)
const isDone = ref(false)
const total = ref(0)
const current = ref(new Array())

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
const chosenDirectory = async () => {

    addImagesFromDirectory()

    isLoaded.value = true

    let imageHolder = document.getElementById('image-holder')

    for (const file of SORTED_FILES.value) {
        let image = null
        await new Promise(resolve => {
            setTimeout(() => resolve((
                [
                    image = document.createElement('img'),
                    image.setAttribute('id', 'image-full'),
                    image.src = URL.createObjectURL(file),
                    imageHolder.appendChild(image)
                ]
            )), 10)
        })

        await new Promise((resolve) => {
            setTimeout(() => resolve(
                image.setAttribute('class', 'border fading-in')
            ), 25)
        })

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

    total.value = SORTED_FILES.value.length

    exportDuplicated()

}

/** @DESC Archive duplicated file hash **/
const toFindDuplicates = (array) => {
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
const exportDuplicated = async () => {

    isDone.value = true

    disabledButton()

    const len = SORTED_FILES.value.length

    let a = FILES_HASH.value

    const data = toFindDuplicates(a)

    let images = document.querySelectorAll('#image-full')

    let imageHolder = document.getElementById('image-holder')

    let index = 0

    do {
        if (data.length > 0) {
            for (let i = 0; i < len; i++) {
                if (a[i] === data[index]) {
                    FileRetrieve.duplicated.push(SORTED_FILES.value[i])
                    index++
                }
                else {
                    await new Promise((resolve) => {
                        setTimeout(() => resolve(
                            images[i].classList.add('fading-out')
                        ), 10)
                    })
                    .then(() => imageHolder.removeChild(images[i]))
                }
            }
        }
    }
    while(index < data.length)

    total.value = current.value.length = imageHolder.childElementCount
}


/** @DESC Clear all images from the container after finish the comparison **/
const clearImages = async () => {

    let imageHolder = document.getElementById('image-holder')
    let images = document.querySelectorAll('#image-full')

    const len = images.length
    console.log(len)

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

    total.value = 0

    isDone.value = false

    normalizeButton()
}

// Change button status
const disabledButton = async () => {
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

const normalizeButton = async () => {
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

onBeforeUnmount(() => {
    let holder = document.getElementById('image-holder')
    let imgs = document.querySelectorAll('#image-full') 

    for(let i = 0; i < current.value.length; i++) {
        holder.removeChild(imgs[i])
    }
})

onUnmounted(() => {
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