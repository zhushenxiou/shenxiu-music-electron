<template>
  <div class="toLogin">
    <!-- 未登录时展示 -->
    <div v-if="!cookie" class="clickLogin">
      <span @click="loginDialogIsVisible = true">点击登录</span>
    </div>
    <!-- 登录时展示 -->
    <div v-if="cookie" class="flex gap-5" @click="toUserDetails">
      <!-- 用户信息 -->
      <div
        class="cursor-pointer flex items-center gap-2"
        @click="$router.push('/userDetails' + '/' + userStore.userInfo.userId)"
      >
        <img :src="accountInfo.avatarUrl" alt="用户头像" />
        <!-- 用户名称 -->
        <span>{{ accountInfo.nickname }}</span>
      </div>
      <!-- 退出登录 -->
      <div v-if="cookie">
        <el-popconfirm
          title="请问是否确认退出登录？"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="toLogout"
        >
          <template #reference>
            <el-button plain size="large">退出登录</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <!-- 登录页面弹窗 -->
    <el-dialog
      v-model="loginDialogIsVisible"
      width="30%"
      :modal="false"
      :center="true"
      :draggable="true"
      top="10vh"
      @close="closeDialog"
    >
      <Login
        ref="loginRef"
        :login-dialog-is-visible="loginDialogIsVisible"
        :close-dialog="closeDialog"
      ></Login>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getAccountInfoApi, logoutApi } from '@/api/login'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import Login from '@/components/Login/index.vue'

const userStore = useUserStore()

const loginDialogIsVisible = ref(false)
// 处理弹窗关闭事件
function closeDialog() {
  loginDialogIsVisible.value = false
}

/** 退出登录 */
async function toLogout() {
  const res = await logoutApi()
  console.log(res)
  if (res.code === 200) {
    ElMessage.success('已退出登录')
    // 清空cookie token
    localStorage.removeItem('cookie')
    localStorage.removeItem('token')
  }
  // 刷新页面
  router.go(0)
}

// 账户信息
const accountInfo = ref({ avatarUrl: '', nickname: '' })

const cookie = computed(() => {
  return localStorage.getItem('cookie')
})

async function getAccountInfo() {
  if (!localStorage.getItem('cookie')) {
    return
  }
  const res = await getAccountInfoApi()
  if (res.profile === null) {
    await logoutApi()
    localStorage.removeItem('cookie')
    localStorage.removeItem('token')
    ElMessage.warning('登录异常,已退出登录！')
    return
  }
  accountInfo.value = res.profile
  userStore.uid = res.profile.userId
  userStore.getUserData()
}

function toUserDetails() {
  router.push({
    name: 'myMusic'
  })
}

getAccountInfo()
</script>

<style lang="less" scoped>
.toLogin {
  display: flex;

  .clickLogin {
    cursor: pointer;
  }

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;

    img {
      width: 40px;
      border-radius: 50%;
      vertical-align: middle;
      margin: 0 5px;
      cursor: pointer;
    }

    span {
      color: black;
      font-family: '等线';
      font-size: 15px;
    }
  }
}
</style>
