import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faRectangleList } from '@fortawesome/free-solid-svg-icons/faRectangleList'
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons/faFolderPlus'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons/faCirclePlay'
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons/faFolderOpen'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'

/* add icons to the library */
library.add(
    faUserSecret,
    faRectangleList,
    faFolderPlus,
    faCirclePlay,
    faImage,
    faFolderOpen,
    faTrash,
    faCircleXmark,
    faCopy
)

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .mount('#app')