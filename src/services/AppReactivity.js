import { reactive } from "vue";

export const StateProcess = reactive({
    STATUS: {
        OFF: false,
        ON: true
    }
})

export const FileRetrieve = reactive({
    chosenFile: null,
    sortedFile: new Array(),
    duplicated: new Array(),
    filesSize: new Array()
})

export const HASH_DATA = reactive({
    retrieve: {
        FileHash: null,
        FilesHash: new Array()
    }
})

export const check = reactive({
    isClick: false
})