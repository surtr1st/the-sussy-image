import { createRouter, createWebHistory } from 'vue-router'
import SpecificPlace from '../views/SpecificPlaceView.vue'
import AllInOne from '../views/AllInOneView.vue'
import DuplicatedFound from '../views/DuplicatedFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/specific-place',
      name: 'specific-place',
      component: SpecificPlace
    },
    {
      path: '/all-in-one',
      name: 'all-in-one',
      component: AllInOne
    },
    {
      path: '/duplicated-found',
      name: 'duplicated-found',
      component: DuplicatedFound
    }
  ]
})

export default router