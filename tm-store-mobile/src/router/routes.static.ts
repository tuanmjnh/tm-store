import type { RouteRecordRaw } from 'vue-router'
export const staticRoutes: RouteRecordRaw[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: 'Dashboard',
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
      icon: 'icon-park-outline:analysis',
      menuType: 'dir',
      parent: null,
      level: 1
    }
  },
  {
    name: 'profile',
    path: '/profile',
    component: () => import('@/views/profile/index.vue'),
    meta: {
      title: 'profile',
      requiresAuth: false,
      icon: 'icon-park-outline:analysis',
      menuType: 'dir',
      parent: null,
      level: 1
    }
  },
  {
    name: 'setting',
    path: '/setting',
    component: () => import('@/views/setting/index.vue'),
    meta: {
      title: 'setting',
      requiresAuth: false,
      icon: 'icon-park-outline:analysis',
      menuType: 'dir',
      parent: null,
      level: 2,
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
    name: 'news',
    path: '/news',
    component: null,
    meta: {
      title: 'news',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'dir',
      parent: null,
      level: 2
    }
  },
  {
    name: 'news-list',
    path: '/news/list',
    component: null,
    meta: {
      title: 'news-list',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'dir',
      parent: 'news',
      level: 2,
    }
  },
  {
    name: 'news-list-view',
    path: '/news/list/view',
    component: () => import('@/views/news/list.vue'),
    meta: {
      title: 'list',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'news-list',
      level: 2,
    }
  },
  {
    name: 'news-list-add',
    path: '/news/list/add',
    component: () => import('@/views/news/add.vue'),
    meta: {
      title: 'add',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'news-list',
      level: 2,
    }
  },
  {
    name: 'news-list-edit',
    path: '/news/list/edit/:id?',
    component: () => import('@/views/news/add.vue'),
    meta: {
      title: 'edit',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'news-list',
       level: 2,
    }
  },
  {
    name: 'news-list-trash',
    path: '/news/list/trash',
    component: () => import('@/views/news/list.vue'),
    meta: {
      title: 'trash',
      requiresAuth: true,
      icon: 'icon-park-outline:list',
      menuType: 'page',
      parent: 'news-list',
      level: 2,
    }
  }
]
