import { createRouter, createWebHistory } from 'vue-router'
import { changeHeadTitle } from '@/router/navigationGuards'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SpotifyAuthRedirectView from '@/views/SpotifyAuthRedirectView.vue'
import NotFound from '@/views/NotFound.vue'
import i18n from '@/plugins/i18n'

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    // isAdmin?: boolean
    // must be declared by every route
    // requiresAuth: boolean,
    // is optional
    head?: {
      title: string
    }
  }
}
const { t } = i18n.global

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        head: {
          title: t('pages.home.meta.title')
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        head: {
          title: t('pages.login.meta.title')
        }
      }
    },
    {
      path: '/callback',
      name: 'callback',
      component: SpotifyAuthRedirectView,
      meta: {
        head: {
          title: t('pages.redirect.meta.title')
        }
      }
    },
    {
      path: '/profil/:id',
      name: 'profil',
      component: () => import('@/views/ProfilView.vue'),
      meta: {
        head: {
          title: t('pages.profil.meta.title')
        }
      }
    },
    /*{
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue')
    },*/
    // will match everything and put it under `$route.params.pathMatch`
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { head: { title: t('pages.notFound.meta.title') } }
    }
  ]
})

router.beforeEach(changeHeadTitle)

export default router
