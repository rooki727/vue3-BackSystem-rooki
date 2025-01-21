import axios from 'axios'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import router from '@/router'
import { useLoginerStore } from '@/stores/LoginerStore'
import { refreshTokenAPI } from '@/apis/token'
const httpInstance = axios.create({
  baseURL: 'http://119.29.168.176:8080/library_ssm',
  // baseURL: 'http://localhost:8080/library_ssm',
  timeout: 5000
})

// 拦截器
// axios请求拦截器
httpInstance.interceptors.request.use(
  (config) => {
    const loginerStore = useLoginerStore()
    loginerStore.getUserInfo()
    const token = loginerStore.userInfo.token
    if (!token && config.url !== '/login') {
      router.push('/login')
    } else {
      // 在请求头中添加 token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 判断token是否过期
function isTokenAboutToExpire(token) {
  const payload = JSON.parse(atob(token.split('.')[1]))
  const exp = payload.exp * 1000 // 转换为毫秒
  console.log(exp)

  const currentTime = Date.now()
  return exp - currentTime < 60000 // 例如，提前 60 秒判断
}

// axios响应式拦截器
httpInstance.interceptors.response.use(
  async (response) => {
    const loginerStore = useLoginerStore()
    loginerStore.getUserInfo()
    // 处理 token 过期失效问题
    if (response.data.code === '-403') {
      if (isTokenAboutToExpire(loginerStore.userInfo.token)) {
        ElMessage({
          type: 'warning',
          message: 'Token已过期，尝试刷新token，当前操作若未生效，请重新尝试当前操作',
          duration: 5000
        })
        try {
          const res = await refreshTokenAPI(
            loginerStore.userInfo.id,
            loginerStore.userInfo.refreshToken
          )
          loginerStore.setUserInfo(res)
          // 重新前一请求
          await httpInstance.request(response.config).then((res1) => {
            loginerStore.getNewLoginer(loginerStore.userInfo.id)
            return res1.data
          })
        } catch (error) {
          console.error('Token 刷新失败', error)
          ElMessage({
            type: 'error',
            message: '刷新 token 失败，请重新登录'
          })
          loginerStore.clearUser()
          router.push('/login')
        }
      } else {
        ElMessage({
          type: 'warning',
          message: '身份信息过期或在异地登录'
        })
        loginerStore.clearUser()
        router.push('/login')
      }
    } else {
      return response.data
    }
  },
  (error) => {
    // 401 token失效处理
    if (error.response && error.response.status === 401) {
      ElMessage({
        type: 'warning',
        // 具体可写后端提供的错误信息
        message: '请检查您的网络或请求信息是否有误'
      })
      const loginerStore = useLoginerStore()
      loginerStore.clearUser()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default httpInstance
