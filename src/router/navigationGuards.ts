import type { NavigationGuard } from 'vue-router'

import { useHead } from '@vueuse/head'

/*export const checkAuthentication: NavigationGuard = async () => {
  const store = useUserStore();
  if (store.isUserConnected) return true;

  // authenticate method will change url if not authenticated, so don't need to
  // return false to prevent the navigation
  await store.authenticate();
  return true;
};*/

export const changeHeadTitle: NavigationGuard = async (to, from, next) => {
  useHead({
    title: to.meta?.head?.title || ''
  })

  return next()
}
