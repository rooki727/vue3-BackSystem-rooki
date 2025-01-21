<script setup>
import { watch, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import LanguageChange from '@/components/languageChange.vue'
import { useLoginerStore } from '@/stores/LoginerStore'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { resetAdminTokenAPI } from '@/apis/user'
// 获取t方法才可以在js代码里使用
const { t } = useI18n()
const Router = useRouter()
const LoginerStore = useLoginerStore()
const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const route = useRoute()
const props = defineProps(['isCollapse'])
const emit = defineEmits(['changeCollapse'])
const changeOpen = () => {
  emit('changeCollapse')
}
const secondBreadName = ref('')
const thitdBreadName = ref('')
const secondBread = ref(true)
const changeBreadName = () => {
  if (route.path === '/') {
    secondBread.value = false
  } else {
    secondBread.value = true
    // 导航switch ，也可以采用数组渲染形式，v-for,这样还能实现国际化
    // （实现国际化借助route里的name，在数组上加上对应的name  $t(`messages.${v-name}`)）
    switch (route.path) {
      case '/user/adminlist':
        secondBreadName.value = t('messages.user_manage')
        thitdBreadName.value = t('messages.admin_list')
        break
      case '/user/userlist':
        secondBreadName.value = t('messages.user_manage')
        thitdBreadName.value = t('messages.user_list')
        break
      case '/book/booklist':
        secondBreadName.value = t('messages.book_manage')
        thitdBreadName.value = t('messages.book_List')
        break
      case '/book/bookcategory':
        secondBreadName.value = t('messages.book_manage')
        thitdBreadName.value = t('messages.book_catetory')
        break
      case '/order/orderlist':
        secondBreadName.value = t('messages.order_manage')
        thitdBreadName.value = t('messages.order_list')
        break
      case '/order/orderverify':
        secondBreadName.value = t('messages.order_manage')
        thitdBreadName.value = t('messages.order_check')
        break
      case '/order/orderLogistics':
        secondBreadName.value = t('messages.order_manage')
        thitdBreadName.value = t('messages.orderLogistics')
        break
      case '/loginInfo/basicinfo':
        secondBreadName.value = t('messages.LoginerInfo')
        thitdBreadName.value = t('messages.Basic_information')
        break
      case '/loginInfo/modifyawator':
        secondBreadName.value = t('messages.LoginerInfo')
        thitdBreadName.value = t('messages.Modify_Awator')
        break
      case '/loginInfo/passwordmanagement':
        secondBreadName.value = t('messages.LoginerInfo')
        thitdBreadName.value = t('messages.Password_management')
        break
      case '/loginInfo/cancelaccount':
        secondBreadName.value = t('messages.LoginerInfo')
        thitdBreadName.value = t('messages.Cancel_account')
        break
      case '/chat/chatservice':
        secondBreadName.value = t('messages.chatManager')
        thitdBreadName.value = t('messages.chatService')
        break
      default:
        // 默认情况下的处理逻辑
        break
    }
  }
}

watch(
  () => route.path,
  () => {
    changeBreadName()
  }
)

const dialogVisible = ref(false)
const showPopoverConfirm = () => {
  dialogVisible.value = true
}
const cancelExit = () => {
  dialogVisible.value = false
  // 取消退出操作
}
const confirmExit = async () => {
  // 执行退出登录操作，例如清除登录信息等
  dialogVisible.value = false
  // 确认退出操作
  const id = computed(() => LoginerStore.userInfo.id)
  await resetAdminTokenAPI(id.value)
  LoginerStore.clearUser()
  Router.push('/login')
}

onMounted(() => {
  changeBreadName()
})
</script>


<template>
  <!-- 对话框确定栏 -->
  <el-dialog v-model="dialogVisible" :title="$t('messages.Warning')" width="350">
    <span>{{ $t('messages.Confirm_Exit') }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelExit">{{ $t('messages.Cancel') }}</el-button>
        <el-button type="primary" @click="confirmExit"> {{ $t('messages.Confirm') }} </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 顶部栏 -->
  <el-row class="header">
    <el-col :span="4">
      <el-icon @click="changeOpen" v-show="!props.isCollapse" style="cursor: pointer"
        ><Fold
      /></el-icon>
      <el-icon @click="changeOpen" v-show="props.isCollapse" style="cursor: pointer"
        ><Expand
      /></el-icon>
    </el-col>

    <el-col :span="20">
      <div class="right">
        <div class="isLogin" v-if="LoginerStore.userInfo?.id">
          <div class="uerinfo">
            <el-dropdown size="small" split-button type="primary" style="background-color: skyblue">
              <!-- 增加头像 -->
              <el-avatar
                size="small"
                :src="LoginerStore.userInfo?.awatar ? LoginerStore.userInfo?.awatar : circleUrl"
              />
              <span style="margin-left: 0.1875rem">
                {{ LoginerStore.userInfo.name }}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push('/loginInfo/basicinfo')">{{
                    $t('messages.LoginerInfo')
                  }}</el-dropdown-item>

                  <el-dropdown-item @click="showPopoverConfirm">{{
                    $t('messages.Exit_Login')
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <el-divider direction="vertical" style="height: 24px" />
          <LanguageChange></LanguageChange>
        </div>
        <div class="noLogin" v-else>
          <RouterLink to="/login" style="text-decoration: none; color: white">{{
            $t('messages.pleaseLogin')
          }}</RouterLink>
          <el-divider direction="vertical" style="height: 24px" />
          <LanguageChange></LanguageChange>
        </div>
      </div>
    </el-col>
  </el-row>

  <el-breadcrumb :separator-icon="ArrowRight" style="margin-top: 8px">
    <el-breadcrumb-item :to="{ path: '/' }">{{ $t('messages.home') }}</el-breadcrumb-item>
    <el-breadcrumb-item v-show="secondBread">{{ secondBreadName }}</el-breadcrumb-item>
    <el-breadcrumb-item v-show="secondBread">{{ thitdBreadName }}</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider />
  <!-- router出口 -->
  <router-view></router-view>
</template>


<style scoped lang="scss">
.header {
  background-color: #409eff;
  position: relative;
  .right {
    position: absolute;
    top: 0.5rem;
    right: 3rem;
    .isLogin {
      display: flex;
    }
    .noLogin {
      display: flex;
    }
  }
  .el-icon {
    color: white;
    padding: 0.5rem 0;
    font-size: 1.6rem;
    line-height: 1.6rem;
  }
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 0.9375rem;
}

// 头像
.demo-type {
  display: flex;
}
.demo-type > div {
  flex: 1;
  text-align: center;
}

.demo-type > div:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}
</style>