import BookCategory from '@/views/Book/BookCategory/BookCategory.vue'
import BookIndex from '@/views/Book/BookIndex.vue'
import BookList from '@/views/Book/BookList/BookList.vue'
import HomeIndex from '@/views/Home/HomeIndex.vue'
import LayoutIndex from '@/views/Layout/LayoutIndex.vue'
import LoginIndex from '@/views/Login/LoginIndex.vue'
import OrderIndex from '@/views/Order/OrderIndex.vue'
import OrderList from '@/views/Order/OrderList/OrderList.vue'
import OrderVerify from '@/views/Order/OrderVerify/OrderVerify.vue'
import AdminList from '@/views/User/Admin/AdminList.vue'
import UserList from '@/views/User/User/UserList.vue'
import UserIndex from '@/views/User/UserIndex.vue'
import LoginInfo from '@/views/LoginInfo/LoginInfo.vue'
import BasicInfo from '@/views/LoginInfo/BasicInfo/BasicInfo.vue'
import CancelAccount from '@/views/LoginInfo/CancelAccount/CancelAccount.vue'
import ModifyAwator from '@/views/LoginInfo/ModifyAwator/ModifyAwator.vue'
import PasswordManagement from '@/views/LoginInfo/PasswordManagement/PasswordManagement.vue'
import OrderLogistics from '@/views/Order/OrderLogistics/OrderLogistics.vue'
import ChatIndex from '@/views/Chat/ChatIndex.vue'
import ChatService from '@/views/Chat/ChatService/ChatService.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { useLoginerStore } from '@/stores/LoginerStore'
import { computed } from 'vue'
const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      component: LayoutIndex,
      name: 'LayoutIndex',
      children: [
        {
          path: '/',
          component: HomeIndex,
          name: 'HomeIndex'
        },
        {
          path: '/loginInfo',
          component: LoginInfo,
          name: 'LoginInfo',
          children: [
            {
              path: 'basicinfo',
              component: BasicInfo,
              name: 'BasicInfo'
            },
            {
              path: 'modifyawator',
              component: ModifyAwator,
              name: 'ModifyAwator'
            },
            {
              path: 'passwordmanagement',
              component: PasswordManagement,
              name: 'PasswordManagement'
            },
            {
              path: 'cancelaccount',
              component: CancelAccount,
              name: 'CancelAccount'
            }
          ]
        },
        {
          path: '/user',
          component: UserIndex,
          name: 'UserIndex',
          children: [
            {
              path: 'adminlist',
              component: AdminList,
              name: 'AdminList'
            },
            {
              path: 'userlist',
              component: UserList,
              name: 'UserList'
            }
          ]
        },
        {
          path: '/book',
          component: BookIndex,
          name: 'BookIndex',
          children: [
            {
              path: 'booklist',
              component: BookList,
              name: 'BookList'
            },
            {
              path: 'bookcategory',
              component: BookCategory,
              name: 'BookCategory'
            }
          ]
        },
        {
          path: '/order',
          component: OrderIndex,
          name: 'OrderIndex',
          children: [
            {
              path: 'orderlist',
              component: OrderList,
              name: 'OrderList'
            },
            {
              path: 'orderverify',
              component: OrderVerify,
              name: 'OrderVerify'
            },
            {
              path: 'orderLogistics',
              component: OrderLogistics,
              name: 'OrderLogistics'
            }
          ]
        },
        {
          path: '/chat',
          component: ChatIndex,
          name: 'ChatIndex',
          children: [
            {
              path: 'chatservice',
              component: ChatService,
              name: 'ChatService'
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      component: LoginIndex,
      name: 'LoginIndex'
    }
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  const loginerStore = useLoginerStore()
  loginerStore.getUserInfo()
  const token = computed(() => loginerStore.userInfo.token) // 模拟用户是否登录
  // 如果访问的路由需要登录权限，并且用户未登录
  if (to.name !== 'LoginIndex' && !token.value) {
    next({ name: 'LoginIndex' }) // 重定向到登录页面
  } else {
    next() // 允许通过
  }
})
export default router
