import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/changepw',
    component: () => import('@/views/login/changepw'),
    hidden: true,
    name:"changepw"
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message',
    hidden: true,
    children: [{
      path: '/message',
      name: 'Message',
      component: () => import('@/views/message/index'),
      meta: { title: '消息', icon: 'dashboard' }
    }]
  },
  {
    path: '/newDashboard',
    component: Layout,
    redirect: '/newDashboard',
    children: [{
      path: '/newDashboard',
      name: 'newDashboard',
      component: () => import('@/views/newDashboard/index'),
      meta: { title: '大屏', icon: 'dashboard' }
    }]
  },
  // {
  //   path: '/scanCode',
  //   component: Layout,
  //   redirect: '/scanCode',
  //   children: [{
  //     path: '/scanCode',
  //     name: 'ScanCode',
  //     component: () => import('@/views/scanCode/index'),
  //     meta: { title: "扫码", icon: 'el-icon-full-screen' }
  //   }]
  // },
  {
    path: '/addUser',
    component: Layout,
    name: 'addUser',
    children: [{
      path: '/addUser',
      name: 'AddUser',
      component: () => import('@/views/system/users/add/index'),
    }],
    hidden: true, // (默认 false)
    meta: { title: '新增用户' }

  },
  {
    path: '/uploadUser',
    component: Layout,
    name: 'uploadUser',
    children: [{
      path: '/uploadUser',
      name: 'UploadUser',
      component: () => import('@/views/system/users/uploadUser/index'),
    }],
    hidden: true, // (默认 false)
    meta: { title: '上传用户信息表' }

  },
  {
    path: '/comfirmStore',
    component: Layout,
    name: 'comfirmStore',
    children: [{
      path: '/comfirmStore',
      name: 'ComfirmStore',
      component: () => import('@/views/project/program/confirm'),
    }],
    hidden: true, // (默认 false)
    meta: { title: '入库确认' }
  },
  {
    path: '/updateUser',
    redirect: '/updateUser',
    component: Layout,
    name: 'updateUser',
    children: [{
      path: '/updateUser',
      name: 'UpdateUser',
      component: () => import('@/views/system/users/update/index'),
    }],
    hidden: true, // (默认 false)
    meta: { title: '编辑用户' }
  },
]
export const scynRoutes = {

  'admin': {
    'path': '/system',
    'redirect': '/system',
    'component': 'Layout',
    'meta': {
      'title': '系统管理',
      'icon': 'el-icon-setting'
    },

    'children': [
      {
        'path': '/users',
        'name': 'users',
        'component': 'system/users/index',
        'meta': {
          'title': '用户管理',
          'icon': 'el-icon-setting'
        }
      }
    ]
  },
  'information': {
    'path': '/information',
    'name': 'information',
    'component': 'Layout',
    'redirect': '/information',
    'meta': {
      'title': '基础资料',
      'icon': 'el-icon-folder-opened'
    },
    'children': [
      {
        'path': '/vendorInfo',
        'name': 'vendorInfo',
        'component': 'VendorInfo/index',
        'meta': {
          'title': '委托商管理',
          // 'icon': 'table'
        }
      }, {
        'path': '/trialDispatch',
        'name': 'trialDispatch',
        'component': 'TrialDispatch/index',
        'meta': {
          'title': '试验派工类型',
          // 'icon': 'table'
        }
      },{
        'path': '/fileMaintain',
        'name': 'fileMaintain',
        'component': 'fileMaintain/index',
        'meta': {
          'title': '模板文件维护',
          // 'icon': 'table'
        }
      }]
  },
  'equipment': {
    'path': '/equipment',

    'component': 'Layout',
    'redirect': '/equipments',

    'children': [
      {
        'path': '/equipment',
        'name': 'equipment',
        'component': 'equipment/index',
        'meta': {
          'title': '设备管理',
          'icon': 'el-icon-set-up'
        }
      }]
  },
  'warehouse': {
    'path': '/inStore',
    'redirect': '/inStore',
    'component': 'Layout',
    'meta': {
      'title': '仓库管理',
      'icon': 'el-icon-house'
    },
    'children': [
      {
        'path': '/inStore',
        'name': 'inStore',
        'component': 'inStore/index',
        'meta': {
          'title': '入库管理',
          // 'icon': 'el-icon-shopping-cart-1'
        }
      },
      {
        'path': '/newInStore',
        'name': 'newInStore',
        'component': 'inStore/newInStore',
        'hidden':true,
        'meta': {
          'title': '新增入库',
          // 'icon': 'el-icon-shopping-cart-full'
        }
      }, {
        'path': '/inputCode',
        'name': 'inputCode',
        'component': 'inStore/putCode',
        'hidden':true,
        'meta': {
          'title': '试验件编码录入',
          // 'icon': 'el-icon-edit'
        }
      }, 
      {
        'path': '/scanInStore',
        'name': 'scanInStore',
        'component': 'inStore/scanCode',
        'hidden':true,
        'meta': {
          'title': '扫码入库',
          // 'icon': 'el-icon-aim'
        }
      },{
        'path': '/outStore',
        'name': 'outStore',
        'component': 'outStore/index',
        'meta': {
          'title': '出库管理',
          // 'icon': 'el-icon-shopping-cart-1'
        }
      },
      {
        'path': '/newOutStore',
        'name': 'newOutStore',
        'component': 'outStore/newOutStore',
        hidden: true,
        'meta': {
          'title': '新增出库',
          // 'icon': 'el-icon-sold-out'
        }
      }
    ]
  },
  "laboratory": {
    'path': '/laboratory',
    'name': 'laboratory',
    'redirect': '/project/laboratory/',
    'component': 'Layout',
    'meta': {
      'title': '工单-实验室',
      'icon': 'el-icon-files'
    },
    children: [
      {
        path: '/incidentOverview',
        component: 'project/laboratory/incidentOverview/index',
        name: 'incidentOverview',
        meta: { title: '工单 实验室主管' }
      },
      {
        path: '/assignIncident',
        component: 'project/laboratory/assignIncident/index',
        name: 'assignIncident',
        'hidden':true,
        meta: { title: '实验室主管-工单分配' }
      },
      {
        path: '/detailIncident',
        component: 'project/laboratory/incidentDetail/index',
        name: 'detailIncident',
        'hidden':true,
        meta: { title: '实验室主管-工单详情' }
      }
    ]

  },
  "experimenter":
  {
    'path': 'experimenter',
    'name': 'experimenter',
    'redirect': '/project/experimenter/',
    'component': 'Layout',
    'meta': {
      'title': '工单-试验员',
      'icon': 'table'
    },
    children: [
      {
        path: '/experIncident',
        component: 'project/experimenter/incident/index',
        name: 'experIncident',
        meta: { title: '工单-试验员' }
      },
      {
        path: '/incidentprocess',
        component: 'project/experimenter/process/index',
        name: 'incidentprocess',
        'hidden':true,
        meta: { title: '领取工单任务' }
      }
    ]
  },
  'project': {
    'path': '/project',
    'redirect': '/project/project',
    'component': 'Layout',
    'name': "project",
    'meta': {
      'title': '项目管理',
      'icon': 'el-icon-edit'
    },
    'children': [
      {
        path: '/newPoject',
        component: 'project/project/newProject/index',
        name: 'newPoject',
        'hidden':true,
        meta: { title: '新建项目' }
      },
      {
        path: '/projectList',
        component: 'project/project/projectList/index',
        name: 'projectList',
        meta: { title: '项目管理' }
      }
    ]
  },
  'program': {
    'path': '/managepro',
    'redirect': '/managepro',
    'component': 'Layout',
    'name': "program",
    'meta': {
      'title': '试验项目',
      'icon': 'form'
    },
    'children': [
      {
        path: '/managepro',
        component: 'project/program/management/index',
        name: 'management',
        meta: { title: '试验任务管理' }
      },
      {
        path: '/newpro',
        component: 'project/program/newProgram/index',
        name: 'newProgram',
        'hidden':true,
        meta: { title: '新建试验任务' }
      },
      {
        path: '/newProincident',
        component: 'project/program/newIncident/index',
        name: 'newProincident',
        'hidden':true,
        meta: { title: '创建工单' }
      },
      {
        path: '/newmanageOut',
        component: 'project/program/outStore/newOutStore',
        name: 'newmanageOut',
        'hidden':true,
        meta: { title: '创建出库' }
      },
      {
        path: '/incident',
        component: 'project/program/incident/index',
        name: 'incident',
        meta: { title: '工单' }
      },
      {
        path: '/manageOutStore',
        component: 'project/program/outStore/index',
        name: 'manageOutStore',
        meta: { title: '出库管理' }
      }
      // {

      //   'path': 'program',
      //   'name': 'program',
      //   'redirect': 'project/program/management/index',
      //   component: 'project/program/index', // Parent router-view
      //   'meta': {
      //     'title': '实验项目',
      //     'icon': 'table'
      //   },
      //   children: [

      //   ]
      // },


    ]
  }
}

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
