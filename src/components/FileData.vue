<template>
    <div class="flex-center flex-cols slide-upward">
        <div class="file-input flex-center drop-shadow-low">
            <img id="image-placeholder" style="object-fit: cover;">
        </div>
        <div class="text-center">
            <label class="upload" for="imageInput">
                <font-awesome-icon icon="fa-solid fa-image" />
                Upload File
            </label>
            <input 
                id="imageInput" 
                class="upload-photo" 
                type="file" 
                @change="importFile()">
        </div>
    </div>
</template>

<script setup>

import 'jszip'
import { check, FileRetrieve, HASH_DATA } from '../services/AppReactivity'

/** @DESC Import chosen image **/ 
function importFile() {
    let input = document.querySelector('#imageInput')
    let imageShow = document.querySelector('#image-placeholder')
    const [file] = input.files
    if (file) {
        imageShow.src = URL.createObjectURL(file)
    }
    FileRetrieve.chosenFile = input.files[0].size
    getFileHash(input)
    check.isClick = true
}

/** @DESC Read hash function type SHA256 of a file **/ 
const getFileHash = (fileInput) => {

    if (fileInput.files[0] == undefined)
        return;

    var reader = new FileReader()
    reader.onload = function (ev) {
        //
        crypto.subtle
            .digest("SHA-256", ev.target.result)
            .then((hashBuffer) => {
                // Convert hex to hash, see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
                const hashArray = Array.from(new Uint8Array(hashBuffer))
                const hashHex = hashArray
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join(""); // convert bytes to hex string

                // Add the hash of each file to the reactive array
                HASH_DATA.retrieve.FileHash = hashHex
                // console.log(hashHex);
            })
            .catch((ex) => console.error(ex))
    }
    reader.onerror = function (err) {
        console.error("Failed to read file", err)
    }
    reader.readAsArrayBuffer(fileInput.files[0])
}


</script>

<style lang="scss" scoped>
@import '../assets/sass/file-data.sass';
@import "../assets/sass/animations.sass";
</style>