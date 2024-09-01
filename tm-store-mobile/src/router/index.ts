import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from "vue-router";
// import routes from "./routes";
import { routes } from './routes.inner'
import { setupRouterGuard } from "./guard";
import type { App } from "vue";
// import { useCachedViewStoreHook } from "@/store/modules/cachedView";
// import NProgress from "@/utils/progress";
// import setPageTitle from "@/utils/set-page-title";
const { VITE_APP_SERVER, VITE_APP_ROUTER_MODE, VITE_APP_ROUTER_BASE, VITE_APP_MODE } = import.meta.env

const createHistory = VITE_APP_SERVER ? createMemoryHistory : VITE_APP_ROUTER_MODE == 'history' ? createWebHistory : createWebHashHistory
const router = createRouter({
  history: createHistory(VITE_APP_MODE === 'ssr' ? void 0 : VITE_APP_ROUTER_BASE),
  routes
});
// setupRouterGuard(router);
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

// Install Vue Router
export async function installRouter(app: App) {
  // Adding a route guard
  setupRouterGuard(router)
  app.use(router)
  await router.isReady() // https://router.vuejs.org/zh/api/index.html#isready
}

export default router;
export { router }
