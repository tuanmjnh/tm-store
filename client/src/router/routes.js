// import fakeLayout from '@/layouts/fake-layout';

export const constant = [
  {
    path: '',
    redirect: 'dashboard',
    meta: { hidden: true, constant: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'dashboard', icon: 'dashboard', constant: true },
    component: () => import('@/views/dashboard')
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      title: 'profile',
      icon: 'assignment_ind',
      hidden: true,
      constant: true
    },
    component: () => import('@/views/profile'),
    children: [
      {
        path: 'information',
        name: 'profile-information',
        meta: { title: 'information', icon: 'assignment', constant: true },
        component: () => import('@/views/profile/information')
      },
      {
        path: 'security',
        name: 'profile-security',
        meta: { title: 'security', icon: 'security', constant: true },
        component: () => import('@/views/profile/security')
      },
      {
        path: 'setting',
        name: 'profile-setting',
        meta: { title: 'userSetting', icon: 'settings', constant: true },
        component: () => import('@/views/profile/setting')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: 'login', icon: 'login', hidden: true, constant: true },
    component: () => import('@/views/login')
  }
];

export const dynamic = [
  {
    path: '/product',
    name: 'product',
    redirect: 'product/list/view',
    meta: { title: 'product', icon: 'perm_media' },
    component: 'layout',
    children: [
      {
        path: 'list',
        name: 'product-list',
        meta: { title: 'list', icon: 'collections' },
        component: 'layout',
        redirect: 'list/view',
        children: [
          {
            path: 'view',
            name: 'product-list-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1
            },
            component: 'products/index'
          },
          {
            path: 'add',
            name: 'product-list-add',
            meta: { title: 'add', icon: 'add', hidden: true },
            component: 'products/add'
          },
          {
            path: 'edit/:id',
            name: 'product-list-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/product-list/view'
            },
            component: 'products/add'
          },
          {
            path: 'trash',
            name: 'product-list-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0
            },
            component: 'products/index'
          }
        ]
      },
      {
        path: 'category',
        name: 'category-product',
        meta: { title: 'category', icon: 'category', type: 'product' },
        component: 'layout',
        redirect: 'category/view',
        children: [
          {
            path: 'view',
            name: 'category-product-view',
            meta: {
              title: 'view',
              icon: 'list',
              type: 'product',
              hidden: true,
              noCache: true,
              flag: 1
            },
            component: 'category/index'
          },
          {
            path: 'add',
            name: 'category-product-add',
            meta: { title: 'add', icon: 'add', type: 'product', hidden: true },
            component: 'category/add'
          },
          {
            path: 'edit/:id',
            name: 'category-product-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              type: 'product',
              hidden: true,
              noCache: true,
              activeMenu: '/category-product/view'
            },
            component: 'category/add'
          },
          {
            path: 'trash',
            name: 'category-product-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              type: 'product',
              hidden: true,
              noCache: true,
              flag: 0
            },
            component: 'category/index'
          }
        ]
      },
      {
        path: 'orders',
        name: 'product-orders',
        meta: { title: 'orders', icon: 'class' },
        component: 'orders',
        children: [
          {
            path: 'view',
            name: 'product-orders-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1
            },
            component: 'orders/index'
          },
          {
            path: 'add',
            name: 'product-orders-add',
            meta: { title: 'add', icon: 'add', hidden: true },
            component: 'orders/add'
          },
          {
            path: 'edit/:id',
            name: 'product-orders-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/product-orders/view'
            },
            component: 'orders/add'
          },
          {
            path: 'trash',
            name: 'product-orders-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0
            },
            component: 'orders/index'
          }
        ]
      }
    ]
  },
  {
    path: '/news',
    name: 'news',
    redirect: 'news-list',
    meta: { title: 'news', icon: 'library_books' },
    component: 'layout',
    children: [
      {
        path: 'list',
        name: 'news-list',
        meta: { title: 'list', icon: 'collections_bookmark' },
        component: 'layout',
        redirect: 'list/view',
        children: [
          {
            path: 'view',
            name: 'news-list-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1
            },
            component: 'news/index'
          },
          {
            path: 'add',
            name: 'news-list-add',
            meta: { title: 'add', icon: 'add', hidden: true },
            component: 'news/add'
          },
          {
            path: 'edit/:id',
            name: 'news-list-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/news-list/view'
            },
            component: 'news/add'
          },
          {
            path: 'trash',
            name: 'news-list-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0
            },
            component: 'news/index'
          }
        ]
      },
      {
        path: 'category',
        name: 'category-news',
        meta: { title: 'category', icon: 'category', type: 'news' },
        component: 'layout',
        redirect: 'category/view',
        children: [
          {
            path: 'view',
            name: 'category-news-view',
            meta: {
              title: 'view',
              icon: 'list',
              type: 'news',
              hidden: true,
              noCache: true,
              flag: 1
            },
            component: 'category/index'
          },
          {
            path: 'add',
            name: 'category-news-add',
            meta: { title: 'add', icon: 'add', type: 'news', hidden: true },
            component: 'category/add'
          },
          {
            path: 'edit/:id',
            name: 'category-news-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              type: 'news',
              hidden: true,
              noCache: true,
              activeMenu: '/category-news/view'
            },
            component: 'category/add'
          },
          {
            path: 'trash',
            name: 'category-news-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              type: 'news',
              hidden: true,
              noCache: true,
              flag: 0
            },
            component: 'category/index'
          }
        ]
      }
    ]
  },
  {
    path: '/store',
    name: 'store',
    redirect: 'store-warehouse',
    meta: { title: 'store', icon: 'store' },
    component: 'layout',
    children: [
      {
        path: 'warehouse',
        name: 'store-warehouse',
        meta: { title: 'data', icon: 'home_work' },
        component: 'store/index'
      },
      {
        path: 'report',
        name: 'store-report',
        meta: { title: 'report', icon: 'pie_chart' },
        component: 'store/report'
      },
      {
        path: 'import',
        name: 'store-import',
        meta: { title: 'import', icon: 'playlist_add' },
        component: 'store/import'
      },
      {
        path: 'export',
        name: 'store-export',
        meta: { title: 'export', icon: 'double_arrow' },
        component: 'store/export'
      }
    ]
  },
  {
    path: '/manager',
    name: 'manager',
    redirect: 'manager/users/view',
    meta: { title: 'manager', icon: 'security' },
    component: 'layout',
    children: [
      {
        path: 'users',
        name: 'manager-users',
        meta: { title: 'users', icon: 'account_box' },
        component: 'layout',
        redirect: 'users/view',
        children: [
          {
            path: 'view',
            name: 'manager-users-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1
            },
            component: 'users/index'
          },
          {
            path: 'add',
            name: 'manager-users-add',
            meta: { title: 'add', icon: 'add', hidden: true },
            component: 'users/add'
          },
          {
            path: 'edit/:id',
            name: 'manager-users-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/users/view'
            },
            component: 'users/add'
          },
          {
            path: 'trash',
            name: 'manager-users-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0
            },
            component: 'users/index'
          },
          {
            path: 'import',
            name: 'manager-users-import',
            meta: {
              title: 'import',
              icon: 'cloud_upload',
              hidden: true,
              noCache: true,
              flag: 0
            },
            component: 'users/import'
          }
        ]
      },
      {
        path: 'roles',
        name: 'manager-roles',
        meta: { title: 'roles', icon: 'verified_user' },
        component: 'layout',
        redirect: 'roles/view',
        children: [
          {
            path: 'view',
            name: 'manager-roles-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1
            },
            component: 'roles/index'
          },
          {
            path: 'add',
            name: 'manager-roles-add',
            meta: { title: 'add', icon: 'add', hidden: true },
            component: 'roles/add'
          },
          {
            path: 'edit/:id',
            name: 'manager-roles-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/roles/view'
            },
            component: 'roles/add'
          },
          {
            path: 'trash',
            name: 'manager-roles-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0
            },
            component: 'roles/index'
          }
        ]
      },
      {
        path: 'types',
        name: 'manager-types',
        meta: { title: 'types', icon: 'scatter_plot' },
        component: 'layout',
        redirect: 'types/view',
        children: [
          {
            path: 'view',
            name: 'manager-types-view',
            meta: {
              title: 'view',
              icon: 'list',
              hidden: true,
              noCache: true,
              flag: 1
            },
            component: 'types/index'
          },
          {
            path: 'add',
            name: 'manager-types-add',
            meta: { title: 'add', icon: 'add', hidden: true },
            component: 'types/add'
          },
          {
            path: 'edit/:id',
            name: 'manager-types-edit',
            meta: {
              title: 'edit',
              icon: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/types/view'
            },
            component: 'types/add'
          },
          {
            path: 'trash',
            name: 'manager-types-trash',
            meta: {
              title: 'trash',
              icon: 'delete',
              hidden: true,
              noCache: true,
              flag: 0
            },
            component: 'types/index'
          }
        ]
      }
    ]
  }
];

export const exception = [];
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  constant.push({
    path: '*',
    name: '404',
    constant: true,
    meta: { title: 'error404', icon: '404', hidden: true },
    component: () => import('@/pages/error404')
  });
}

export default constant;
