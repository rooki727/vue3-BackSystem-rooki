import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserListAPI,
  getAdminListAPI,
  addAdminListAPI,
  updateAdminListAPI,
  deleteAdminAPI,
  getCommonUserAPI,
  addCommonUserAPI,
  updateUserByAdminrAPI,
  deleteCommonUserAPI
} from '@/apis/user'
export const useUserStore = defineStore('user', () => {
  const user = ref({})
  const adminList = ref([])
  const commonUserList = ref([])
  // 加上api请求
  const getUser = async () => {
    const res = await getUserListAPI()
    user.value = res
  }
  //获取管理员
  const getAdminList = async () => {
    const res = await getAdminListAPI()
    // 使用深拷贝函数将 res 的内容复制到 adminList 中
    adminList.value = res.result
  }
  // 添加管理员
  const addAdmin = async (admin, login_id) => {
    await addAdminListAPI(admin, login_id)
    getAdminList()
  }
  // 修改管理员信息
  const updateAdmin = async (admin, login_id) => {
    await updateAdminListAPI(admin, login_id)
    getAdminList()
  }
  // 删除管理员
  const deleteAdmin = async (admin, login_id) => {
    await deleteAdminAPI(admin, login_id)
    getAdminList()
  }

  // 普通用户部分
  const getCommonUser = async () => {
    const res = await getCommonUserAPI()
    commonUserList.value = res.result
  }

  // 添加普通用户
  const addCommonUser = async (
    name,
    account,
    password,
    verify,
    gender,
    phone,
    email,
    buildTime
  ) => {
    await addCommonUserAPI(name, account, password, verify, gender, phone, email, buildTime)
    getCommonUser()
  }
  // 修改普通用户信息
  const updateCommonUser = async (
    user_id,
    name,
    account,
    password,
    verify,
    gender,
    phone,
    email
  ) => {
    await updateUserByAdminrAPI(user_id, name, account, password, verify, gender, phone, email)
    getCommonUser()
  }
  // 删除普通用户
  const deleteCommonUser = async (user_id) => {
    await deleteCommonUserAPI(user_id)
    getCommonUser()
  }
  return {
    user,
    adminList,
    commonUserList,
    getUser,
    getAdminList,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    getCommonUser,
    addCommonUser,
    updateCommonUser,
    deleteCommonUser
  }
})
