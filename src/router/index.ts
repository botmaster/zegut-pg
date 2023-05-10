import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SpotifyAuthRedirectView from '@/views/SpotifyAuthRedirectView.vue'
import NotFound from '@/views/NotFound.vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/callback',
      name: 'callback',
      component: SpotifyAuthRedirectView
    },
    {
      path: '/profil/:id',
      name: 'profil',
      component: () => import('@/views/ProfilView.vue'),
      beforeEnter: (to, from, next) => {
        // Check if the user id is the same as the one in the store
        const userStore = useUserStore()
        const { user } = storeToRefs(userStore)
        if (user.value?.id !== to.params.id) {
          next({ name: 'NotFound' })
        } else {
          next()
        }
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue')
    },
    // will match everything and put it under `$route.params.pathMatch`
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
})

export default router
