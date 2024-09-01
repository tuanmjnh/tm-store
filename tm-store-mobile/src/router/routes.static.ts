export const staticRoutes: AppRoute.RowRoute[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    requiresAuth: true,
    icon: 'icon-park-outline:analysis',
    menuType: 'dir',
    componentPath: null,
    parent: null
  },
  {
    name: 'test',
    path: '/test',
    title: 'Multi-level menu demo',
    requiresAuth: true,
    icon: 'icon-park-outline:list',
    menuType: 'dir',
    componentPath: null,
    parent: null
  },
  {
    name: 'test2',
    path: '/test/test2',
    title: 'Multi-level menu subpages',
    requiresAuth: true,
    icon: 'icon-park-outline:list',
    menuType: 'page',
    componentPath: '/test/test2/index.vue',
    parent: 'test'
  },
  {
    name: 'test2Detail',
    path: '/test/test2/detail',
    title: 'Details page of multi-level menu',
    requiresAuth: true,
    icon: 'icon-park-outline:list',
    hide: true,
    activeMenu: '/test/test2',
    menuType: 'page',
    componentPath: '/test/test2/detail/index.vue',
    parent: 'test2'
  },
  {
    name: 'test3',
    path: '/test/test3',
    title: 'Multi-level menu',
    requiresAuth: true,
    icon: 'icon-park-outline:list',
    menuType: 'dir',
    componentPath: null,
    parent: 'test'
  },
  {
    name: 'test4',
    path: '/test/test3/test4',
    title: 'Multi-level menu 3-1',
    requiresAuth: true,
    icon: 'icon-park-outline:list',
    componentPath: '/test/test3/test4/index.vue',
    parent: 'test'
  }
]
