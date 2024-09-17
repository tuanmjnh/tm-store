import type { App } from "vue";
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from "vue-router";
// import routes from "./routes";
import { routes, rootRoute } from './routes.inner'
import { staticRoutes } from './routes.static'
import { initMiddleware } from "./middleware";
import { arrayToTree } from '@/utils/tree'

export const isInitAuthRoutes = false
// console.log(routes)
// import { useCachedViewStoreHook } from "@/store/modules/cachedView";
// import NProgress from "@/utils/progress";
// import setPageTitle from "@/utils/set-page-title";
const { VITE_APP_SERVER, VITE_APP_ROUTER_MODE, VITE_APP_ROUTER_BASE, VITE_APP_MODE } = import.meta.env

const createHistory = VITE_APP_SERVER ? createMemoryHistory : VITE_APP_ROUTER_MODE == 'history' ? createWebHistory : createWebHashHistory
// const router = createRouter({
//   history: createHistory(VITE_APP_MODE === 'ssr' ? void 0 : VITE_APP_ROUTER_BASE),
//   routes
// });


const reCreateRouter = () => createRouter({
  // scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: routes,

  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(VITE_APP_MODE === 'ssr' ? void 0 : VITE_APP_ROUTER_BASE)
})

const router = reCreateRouter()

// initMiddleware(router);
// export interface toRouteType extends RouteLocationNormalized {
//   meta: {
//     title?: string;
//     noCache?: boolean;
//   };
// }

// router.beforeEach((to: toRouteType, from, next) => {
//   NProgress.start();
//   useCachedViewStoreHook().addCachedView(to);
//   setPageTitle(to.meta.title);
//   next();
// });

// router.afterEach(() => {
//   NProgress.done();
// });

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export const resetRouter = () => {
//   const newRouter = reCreateRouter()
//   router.matcher = newRouter.matcher // reset router
// }

// export const addRoutes = (routers, replace = true) => {
//   // console.log(router)
//   routers = routers.filter(x => {
//     if (!router.includes(x.name)) return x
//   })
//   router.addRouter(routers)
// }

export const initAuthRoutes = async (authRoutes: Array<string>) => {
  const isAppRootRoutes = router.hasRoute('appRoot')
  if (!isAppRootRoutes && authRoutes && authRoutes.length) {
    const rs = staticRoutes.filter(x => {
      if (x.meta.requiresAuth) return authRoutes.indexOf(x.name.toString()) > -1
      else return true
    })
    rootRoute.children = arrayToTree(rs, { parentProperty: 'meta.parent', customID: 'name' })
    router.addRoute(rootRoute)
    // return rootRoute
  }
  return isAppRootRoutes
}

export const routesTree = arrayToTree(staticRoutes, { parentProperty: 'meta.parent', customID: 'name' })

// Install Vue Router
export async function installRouter(app: App) {
  // Adding a route guard
  initMiddleware(router)
  app.use(router)
  await router.isReady() // https://router.vuejs.org/zh/api/index.html#isready
}

export const historyBack = () => {
  if (window.history.state.back) history.back()
  else router.replace('/')
}

export default router;
export { router }
