<script setup>
const props = defineProps(['isCollapse'])
</script>

<template>
  <el-menu
    active-text-color="orange"
    background-color="rgb(25, 25, 130)"
    class="el-menu-vertical-demo"
    default-active="$route.path"
    :collapse="props.isCollapse"
    text-color="#fff"
  >
    <el-menu-item>
      <span>{{ $t('messages.title') }}</span>
    </el-menu-item>
    <router-link to="/" class="router-link-item">
      <el-menu-item :class="{ 'is-active': $route.path === '/' }">
        <el-icon><House /></el-icon>
        <template #title>
          <span>{{ $t('messages.home') }}</span>
        </template>
      </el-menu-item>
    </router-link>
    <el-sub-menu :class="{ 'is-active': $route.path.startsWith('/user') }">
      <template #title>
        <el-icon><Location /></el-icon>
        <span>{{ $t('messages.user_manage') }}</span>
      </template>
      <router-link to="/user/adminlist" class="router-link-item">
        <el-menu-item :class="{ 'is-active': $route.path === '/user/adminlist' }">{{
          $t('messages.admin_list')
        }}</el-menu-item>
      </router-link>
      <router-link to="/user/userlist" class="router-link-item">
        <el-menu-item :class="{ 'is-active': $route.path === '/user/userlist' }">{{
          $t('messages.user_list')
        }}</el-menu-item>
      </router-link>
    </el-sub-menu>
    <el-sub-menu :class="{ 'is-active': $route.path.startsWith('/book') }">
      <template #title>
        <el-icon><Location /></el-icon>
        <span>{{ $t('messages.book_manage') }}</span>
      </template>
      <router-link to="/book/booklist" class="router-link-item">
        <el-menu-item :class="{ 'is-active': $route.path === '/book/booklist' }">{{
          $t('messages.book_List')
        }}</el-menu-item>
      </router-link>
      <router-link to="/book/bookcategory" class="router-link-item">
        <el-menu-item :class="{ 'is-active': $route.path === '/book/bookcategory' }">{{
          $t('messages.book_catetory')
        }}</el-menu-item>
      </router-link>
    </el-sub-menu>
    <el-sub-menu :class="{ 'is-active': $route.path.startsWith('/order') }">
      <template #title>
        <el-icon><Location /></el-icon>
        <span>{{ $t('messages.order_manage') }}</span>
      </template>
      <router-link to="/order/orderlist" class="router-link-item">
        <el-menu-item :class="{ 'is-active': $route.path === '/order/orderlist' }">{{
          $t('messages.order_list')
        }}</el-menu-item>
      </router-link>
      <router-link to="/order/orderverify" class="router-link-item">
        <el-menu-item :class="{ 'is-active': $route.path === '/order/orderverify' }">{{
          $t('messages.order_check')
        }}</el-menu-item>
      </router-link>
      <router-link to="/order/orderLogistics" class="router-link-item">
        <el-menu-item :class="{ 'is-active': $route.path === '/order/orderLogistics' }">{{
          $t('messages.orderLogistics')
        }}</el-menu-item>
      </router-link>
    </el-sub-menu>
    <el-sub-menu :class="{ 'is-active': $route.path.startsWith('/chat') }">
      <template #title>
        <el-icon><Location /></el-icon>
        <span>{{ $t('messages.chatManager') }}</span>
      </template>
      <router-link to="/chat/chatservice" class="router-link-item">
        <el-menu-item :class="{ 'is-active': $route.path === '/chat/chatservice' }">{{
          $t('messages.chatService')
        }}</el-menu-item>
      </router-link>
    </el-sub-menu>
  </el-menu>
</template>



<style scoped lang="scss">
.router-link-item {
  text-decoration: none;
}
.el-menu {
  border-right: none;
  .is-active {
    background-color: rgb(112, 202, 238);
    color: white;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 12.5rem;
  min-height: 25rem;
}
</style>