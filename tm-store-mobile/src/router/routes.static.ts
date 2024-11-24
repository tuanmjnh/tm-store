import type { RouteRecordRaw } from 'vue-router'
export const staticRoutes: RouteRecordRaw[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: 'dashboard',
      requiresAuth: false,
      icon: 'icon-park-outline:analysis',
      menuType: 'dir',
      parent: null,
      level: 1
    }
  },
  {
    name: 'search',
    path: '/search',
    component: () => import('@/views/search/index.vue'),
    meta: {
      title: 'search',
      requiresAuth: false,
      icon: 'icon-park-outline:search',
      menuType: 'dir',
      parent: null,
      level: 1,
      hide: true
    }
  },
  {
    name: 'profile',
    path: '/profile',
    component: () => import('@/views/profile/index.vue'),
    meta: {
      title: 'profile',
      requiresAuth: false,
      icon: 'user-o',
      menuType: 'dir',
      parent: null,
      level: 1,
      hide: true
    }
  },
  {
    name: 'setting',
    path: '/setting',
    component: () => import('@/views/setting/index.vue'),
    meta: {
      title: 'setting',
      requiresAuth: false,
      icon: 'icon-park-outline:setting',
      menuType: 'dir',
      parent: null,
      level: 2,
      hide: true
    }
  },
  {
    name: 'test',
    path: '/test',
    component: null,
    meta: {
      title: 'Multi-level menu demo',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'dir',
      parent: null,
      level: 2
    }
  },
  {
    name: 'test1',
    path: '/test/test1',
    component: () => import('@/views/test/test1/index.vue'),
    meta: {
      title: 'Multi-level menu demo',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'test',
      level: 2,
    }
  },
  {
    name: 'test2',
    path: '/test/test2',
    component: () => import('@/views/test/test2/index.vue'),
    meta: {
      title: 'Multi-level menu demo',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'test',
      level: 2,
    }
  },
  {
    name: 'test2-detail',
    path: '/test/test2/detail',
    component: () => import('@/views/test/test2/detail/index.vue'),
    meta: {
      title: 'Multi-level menu demo',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'test2',
      level: 2,
    }
  },
  {
    name: 'test3',
    path: '/test/test3',
    component: () => import('@/views/test/test3/index.vue'),
    meta: {
      title: 'Multi-level menu demo',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'test',
      level: 2,
    }
  },
  {
    name: 'types',
    path: '/types',
    component: null,
    meta: {
      title: 'types',
      requiresAuth: true,
      icon: 'list-switch',
      menuType: 'dir',
      parent: null,
      level: 2
    }
  },
  {
    name: 'types-list',
    path: '/types/list',
    component: () => import('@/views/types/list.vue'),
    meta: {
      title: 'list',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'types',
      level: 2,
    }
  },
  {
    name: 'types-add',
    path: '/types/add',
    component: () => import('@/views/types/add.vue'),
    meta: {
      title: 'add',
      requiresAuth: true,
      icon: 'add-o',
      menuType: 'page',
      parent: 'types',
      level: 2,
    }
  },
  {
    name: 'types-edit',
    path: '/types/edit/:id',
    component: () => import('@/views/types/add.vue'),
    meta: {
      title: 'edit',
      requiresAuth: true,
      icon: 'edit',
      menuType: 'page',
      parent: 'types',
      level: 2,
      hide: true
    }
  },
  {
    name: 'types-trash',
    path: '/types/trash',
    component: () => import('@/views/types/list.vue'),
    meta: {
      title: 'trash',
      requiresAuth: true,
      icon: 'icon-park-outline:delete-one',
      menuType: 'page',
      parent: 'types',
      level: 2,
      hide: true
    }
  },
  {
    name: 'roles',
    path: '/roles',
    component: null,
    meta: {
      title: 'roles',
      requiresAuth: true,
      icon: 'shield-o',
      menuType: 'dir',
      parent: null,
      level: 2
    }
  },
  {
    name: 'roles-list',
    path: '/roles/list',
    component: () => import('@/views/roles/list.vue'),
    meta: {
      title: 'list',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'roles',
      level: 2,
    }
  },
  {
    name: 'roles-add',
    path: '/roles/add',
    component: () => import('@/views/roles/add.vue'),
    meta: {
      title: 'add',
      requiresAuth: true,
      icon: 'add-o',
      menuType: 'page',
      parent: 'roles',
      level: 2,
    }
  },
  {
    name: 'roles-edit',
    path: '/roles/edit/:id?',
    component: () => import('@/views/roles/add.vue'),
    meta: {
      title: 'edit',
      requiresAuth: true,
      icon: 'edit',
      menuType: 'page',
      parent: 'roles',
      level: 2,
      hide: true
    }
  },
  {
    name: 'roles-trash',
    path: '/roles/trash',
    component: () => import('@/views/roles/list.vue'),
    meta: {
      title: 'trash',
      requiresAuth: true,
      icon: 'icon-park-outline:delete-one',
      menuType: 'page',
      parent: 'roles',
      level: 2,
      hide: true
    }
  },
  {
    name: 'users',
    path: '/users',
    component: null,
    meta: {
      title: 'users',
      requiresAuth: true,
      icon: 'friends-o',
      menuType: 'dir',
      parent: null,
      level: 2
    }
  },
  {
    name: 'users-list',
    path: '/users/list',
    component: () => import('@/views/users/list.vue'),
    meta: {
      title: 'list',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'users',
      level: 2,
    }
  },
  {
    name: 'users-add',
    path: '/users/add',
    component: () => import('@/views/users/add.vue'),
    meta: {
      title: 'add',
      requiresAuth: true,
      icon: 'add-o',
      menuType: 'page',
      parent: 'users',
      level: 2,
    }
  },
  {
    name: 'users-edit',
    path: '/users/edit/:id?',
    component: () => import('@/views/users/add.vue'),
    meta: {
      title: 'edit',
      requiresAuth: true,
      icon: 'edit',
      menuType: 'page',
      parent: 'users',
      level: 2,
      hide: true
    }
  },
  {
    name: 'users-trash',
    path: '/users/trash',
    component: () => import('@/views/users/list.vue'),
    meta: {
      title: 'trash',
      requiresAuth: true,
      icon: 'icon-park-outline:delete-one',
      menuType: 'page',
      parent: 'users',
      level: 2,
      hide: true
    }
  },
  {
    name: 'connect',
    path: '/connect',
    redirect: { name: 'connect-list' },
    // component: null,
    meta: {
      title: 'connect',
      requiresAuth: true,
      icon: 'link-o',
      menuType: 'dir',
      parent: null,
      level: 2,
      hide: true
    }
  },
  {
    name: 'connect-list',
    path: '/connect/list',
    component: () => import('@/views/connect/index.vue'),
    meta: {
      title: 'list',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'dir',
      parent: 'connect',
      level: 2,
      hide: true
    }
  },
  {
    name: 'connect-google-add',
    path: '/connect/google-add',
    component: () => import('@/views/connect/google-add.vue'),
    meta: {
      title: 'google-add',
      requiresAuth: true,
      icon: 'add-o',
      menuType: 'page',
      parent: 'connect',
      level: 2,
      hide: true
    }
  },
  {
    name: 'connect-google-remove',
    path: '/connect/google-remove',
    component: () => import('@/views/connect/google-remove.vue'),
    meta: {
      title: 'google-remove',
      requiresAuth: true,
      icon: 'close',
      menuType: 'page',
      parent: 'connect',
      level: 2,
      hide: true
    }
  },
  {
    name: 'group-news',
    path: '/group-news',
    component: null,
    meta: {
      title: 'groupNews',
      requiresAuth: true,
      icon: 'icon-park-outline:category-management',
      menuType: 'dir',
      parent: null,
      level: 2,
      module: 'news'
    }
  },
  {
    name: 'group-news-list',
    path: '/group-news/list',
    component: () => import('@/views/groups/list.vue'),
    meta: {
      title: 'list',
      label: 'groupNews',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'group-news',
      level: 2,
      module: 'news'
    }
  },
  {
    name: 'group-news-add',
    path: '/group-news/add',
    component: () => import('@/views/groups/add.vue'),
    meta: {
      title: 'add',
      label: 'groupNews',
      requiresAuth: true,
      icon: 'add-o',
      menuType: 'page',
      parent: 'group-news',
      level: 2,
      module: 'news'
    }
  },
  {
    name: 'group-news-edit',
    path: '/group-news/edit/:id?',
    component: () => import('@/views/groups/add.vue'),
    meta: {
      title: 'edit',
      label: 'groupNews',
      requiresAuth: true,
      icon: 'edit',
      menuType: 'page',
      parent: 'group-news',
      level: 2,
      hide: true,
      module: 'news'
    }
  },
  {
    name: 'group-news-trash',
    path: '/group-news/trash',
    component: () => import('@/views/groups/list.vue'),
    meta: {
      title: 'trash',
      label: 'groupNews',
      requiresAuth: true,
      icon: 'icon-park-outline:delete-one',
      menuType: 'page',
      parent: 'group-news',
      level: 2,
      hide: true,
      module: 'news'
    }
  },
  {
    name: 'news',
    path: '/news',
    component: null,
    meta: {
      title: 'news',
      requiresAuth: true,
      icon: 'icon-park-outline:newspaper-folding',
      menuType: 'dir',
      parent: null,
      level: 2
    }
  },
  {
    name: 'news-list',
    path: '/news/list',
    component: () => import('@/views/news/list.vue'),
    meta: {
      title: 'list',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'news',
      level: 2,
    }
  },
  {
    name: 'news-add',
    path: '/news/add',
    component: () => import('@/views/news/add.vue'),
    meta: {
      title: 'add',
      requiresAuth: true,
      icon: 'add-o',
      menuType: 'page',
      parent: 'news',
      level: 2,
    }
  },
  {
    name: 'news-edit',
    path: '/news/edit/:id?',
    component: () => import('@/views/news/add.vue'),
    meta: {
      title: 'edit',
      requiresAuth: true,
      icon: 'edit',
      menuType: 'page',
      parent: 'news',
      level: 2,
      hide: true
    }
  },
  {
    name: 'news-trash',
    path: '/news/trash',
    component: () => import('@/views/news/list.vue'),
    meta: {
      title: 'trash',
      requiresAuth: true,
      icon: 'icon-park-outline:delete-one',
      menuType: 'page',
      parent: 'news',
      level: 2,
      hide: true
    }
  },
  {
    name: 'group-product',
    path: '/group-product',
    component: null,
    meta: {
      title: 'groupProduct',
      requiresAuth: true,
      icon: 'icon-park-outline:tree-list',
      menuType: 'dir',
      parent: null,
      level: 2,
      module: 'product'
    }
  },
  {
    name: 'group-product-list',
    path: '/group-product/list',
    component: () => import('@/views/groups/list.vue'),
    meta: {
      title: 'list',
      label: 'groupProduct',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      module: 'product',
      parent: 'group-product',
      level: 2,
    }
  },
  {
    name: 'group-product-add',
    path: '/group-product/add',
    component: () => import('@/views/groups/add.vue'),
    meta: {
      title: 'add',
      label: 'groupProduct',
      requiresAuth: true,
      icon: 'add-o',
      menuType: 'page',
      parent: 'group-product',
      level: 2,
      module: 'product'
    }
  },
  {
    name: 'group-product-edit',
    path: '/group-product/edit/:id?',
    component: () => import('@/views/groups/add.vue'),
    meta: {
      title: 'edit',
      label: 'groupProduct',
      requiresAuth: true,
      icon: 'edit',
      menuType: 'page',
      parent: 'group-product',
      level: 2,
      hide: true,
      module: 'product'
    }
  },
  {
    name: 'group-product-trash',
    path: '/group-product/trash',
    component: () => import('@/views/groups/list.vue'),
    meta: {
      title: 'trash',
      label: 'groupProduct',
      requiresAuth: true,
      icon: 'icon-park-outline:delete-one',
      menuType: 'page',
      parent: 'group-product',
      level: 2,
      hide: true,
      module: 'product'
    }
  },
  {
    name: 'product',
    path: '/product',
    component: null,
    meta: {
      title: 'product',
      requiresAuth: true,
      icon: 'icon-park-outline:view-grid-list',
      menuType: 'dir',
      parent: null,
      level: 2
    }
  },
  {
    name: 'product-list',
    path: '/product/list',
    component: () => import('@/views/products/list.vue'),
    meta: {
      title: 'list',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'product',
      level: 2,
    }
  },
  {
    name: 'product-add',
    path: '/product/add',
    component: () => import('@/views/products/add.vue'),
    meta: {
      title: 'add',
      requiresAuth: true,
      icon: 'add-o',
      menuType: 'page',
      parent: 'product',
      level: 2,
    }
  },
  {
    name: 'product-edit',
    path: '/product/edit/:id?',
    component: () => import('@/views/products/add.vue'),
    meta: {
      title: 'edit',
      requiresAuth: true,
      icon: 'edit',
      menuType: 'page',
      parent: 'product',
      level: 2,
      hide: true
    }
  },
  {
    name: 'product-trash',
    path: '/product/trash',
    component: () => import('@/views/products/list.vue'),
    meta: {
      title: 'trash',
      requiresAuth: true,
      icon: 'icon-park-outline:delete-one',
      menuType: 'page',
      parent: 'product',
      level: 2,
      hide: true
    }
  }
]
