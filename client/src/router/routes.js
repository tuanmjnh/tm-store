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
    redirect: 'product-list',
    meta: { title: 'product', icon: 'perm_media' },
    component: 'layout',
    children: [
      {
        path: 'product-list',
        name: 'product-list',
        meta: { title: 'list', icon: 'collections' },
        component: 'products/index',
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
            path: 'edit/:?id',
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
      }
    ]
  },
  {
    path: '/manager',
    name: 'manager',
    redirect: 'manager-users',
    meta: { title: 'manager', icon: 'security' },
    component: 'layout',
    children: [
      {
        path: 'users',
        name: 'manager-users',
        meta: { title: 'users', icon: 'account_box' },
        component: 'users/index',
        children: [
          {
            path: 'view',
            name: 'manager-users-view',
            meta: { title: 'view', hidden: true, noCache: true, flag: 1 },
            component: 'users/index'
          },
          {
            path: 'add',
            name: 'manager-users-add',
            meta: { title: 'add', hidden: true },
            component: 'users/add'
          },
          {
            path: 'edit/:?id',
            name: 'manager-users-edit',
            meta: {
              title: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/users/view'
            },
            component: 'users/add'
          },
          {
            path: 'trash',
            name: 'manager-users-trash',
            meta: { title: 'trash', hidden: true, noCache: true, flag: 0 },
            component: 'users/index'
          }
        ]
      },
      {
        path: 'roles',
        name: 'manager-roles',
        meta: { title: 'roles', icon: 'verified_user' },
        component: 'roles/index',
        children: [
          {
            path: 'view',
            name: 'manager-roles-view',
            meta: { title: 'view', hidden: true, noCache: true, flag: 1 },
            component: 'roles/index'
          },
          {
            path: 'add',
            name: 'manager-roles-add',
            meta: { title: 'add', hidden: true },
            component: 'roles/add'
          },
          {
            path: 'edit/:?id',
            name: 'manager-roles-edit',
            meta: {
              title: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/roles/view'
            },
            component: 'roles/add'
          },
          {
            path: 'trash',
            name: 'manager-roles-trash',
            meta: { title: 'trash', hidden: true, noCache: true, flag: 0 },
            component: 'roles/index'
          }
        ]
      },
      {
        path: 'types',
        name: 'manager-types',
        meta: { title: 'types', icon: 'scatter_plot' },
        component: 'types/index',
        children: [
          {
            path: 'view',
            name: 'manager-types-view',
            meta: { title: 'view', hidden: true, noCache: true, flag: 1 },
            component: 'types/index'
          },
          {
            path: 'add',
            name: 'manager-types-add',
            meta: { title: 'add', hidden: true },
            component: 'types/add'
          },
          {
            path: 'edit/:?id',
            name: 'manager-types-edit',
            meta: {
              title: 'edit',
              hidden: true,
              noCache: true,
              activeMenu: '/types/view'
            },
            component: 'types/add'
          },
          {
            path: 'trash',
            name: 'manager-types-trash',
            meta: { title: 'trash', hidden: true, noCache: true, flag: 0 },
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
