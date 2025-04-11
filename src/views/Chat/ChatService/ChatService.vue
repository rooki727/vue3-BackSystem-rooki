<template>
  <div class="chat-service">
    <div class="chat-content">
      <div class="chat-left">
        <div
          class="chat-user"
          v-for="item in chatUserList"
          :key="item"
          :class="{ 'is-active': item === currentUser }"
          @click="switchUser(item)"
        >
          用户id：{{ item }}
        </div>
      </div>
      <!-- 聊天区 -->
      <div class="chat-right">
        <div class="chat-box-header">用户id：{{ currentUser }}</div>
        <div class="chat-box-content" ref="scrollContainer">
          <div
            v-for="msg in chatContentList"
            :key="msg"
            :class="['perMessage', msg.admin_id ? 'server-message' : 'user-message']"
          >
            <div class="time">{{ msg.sendTime.toLocaleString() }}</div>
            <div class="profileImg">
              <img
                class="profileImg"
                :src="msg.admin_id ? profile.awatar : '/avatar.jpg'"
                mode="aspectFit"
              />
            </div>

            <div class="msgBox">
              <div class="proName">
                {{ msg.admin_id ? profile.name || profile.account : `用户${currentUser}` }}
              </div>
              <div class="msgContent">{{ msg.message }}</div>
            </div>
          </div>
        </div>
        <div class="chat-box-footer">
          <el-input
            v-model="message"
            class="textareaInput"
            :rows="6"
            type="textarea"
            placeholder="点击输入消息..."
          />
          <el-button type="primary" @click="sendMessage" class="sendBtn">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onBeforeUnmount, nextTick } from 'vue'
import { getUniqueUserIdsAPI } from '@/apis/chat'
import { useLoginerStore } from '@/stores/LoginerStore'
const LoginerStore = useLoginerStore()
const profile = computed(() => LoginerStore.userInfo)
const admin_id = computed(() => LoginerStore.userInfo.id)
const currentUser = ref(0)
const chatUserList = ref([])
const websocket = ref(null)
const chatContentList = ref([])
const message = ref('')
// 判读是否手动关闭
const isHandClose = ref(false)
let reconnectTimer = null
const reconnectInterval = 3000
// 滚动
const scrollContainer = ref(null)
// 确保滚动条滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      const height = scrollContainer.value.scrollHeight
      scrollContainer.value.scrollTop = height
    }
  })
}
const getUniqueUserIds = async () => {
  const res = await getUniqueUserIdsAPI()
  chatUserList.value = res
  currentUser.value = chatUserList.value[0]
}
// 切换用户
const switchUser = (id) => {
  currentUser.value = id
  if (websocket.value) {
    websocket.value.close()
  }
  connectWebSocket()
  chatContentList.value = []
}
const connectWebSocket = () => {
  // 用你的WebSocket服务端地址替换下面的URL
  const wsUrl = `ws://119.29.168.176:8080/library_ssm/chat?user_id=${currentUser.value}&admin_id=${admin_id.value}`
  // 创建WebSocket实例
  websocket.value = new WebSocket(wsUrl)
  // 监听WebSocket事件
  websocket.value.onopen = function (event) {
    console.log('WebSocket连接已打开', event)
    clearReconnectTimer()
  }

  websocket.value.onmessage = function (res) {
    // 处理收到的消息
    // 使用正则表达式提取所有 ChatMessage 中的括号内容
    const matches = res.data.match(/\((.*?)\)/g)
    const resultArray = matches?.map((match) => {
      // 去掉括号并拆分参数
      const params = match
        .slice(1, -1)
        .split(', ')
        .map((param) => {
          const [key, value] = param.split('=')
          return { [key]: value === 'null' ? null : value } // 处理 null 值
        })

      // 将参数转换为对象
      return Object.assign({}, ...params)
    })
    resultArray?.forEach((msg) => {
      msg.sendTime = new Date(msg.sendTime)
      chatContentList.value.push(msg)
    })
    scrollToBottom()
    message.value = ''
  }

  websocket.value.onerror = function (event) {
    console.error('WebSocket发生错误', event)
  }

  websocket.value.onclose = function (event) {
    console.log('WebSocket连接已关闭', event)
    if (!isHandClose.value) {
      reconnect()
    }
    isHandClose.value = false
  }
}
// 清空重连定时器
const clearReconnectTimer = () => {
  if (reconnectTimer) {
    clearInterval(reconnectTimer)
    reconnectTimer = null
  }
}
// 重连
const reconnect = () => {
  if (!reconnectTimer) {
    reconnectTimer = setInterval(() => {
      console.log('正在重连...')
      chatContentList.value = []
      connectWebSocket()
    }, reconnectInterval)
  }
}
// 发送消息

const sendMessage = async () => {
  if (chatContentList.value) {
    await websocket.value.send(message.value)
  }
}
onMounted(async () => {
  await getUniqueUserIds()
  connectWebSocket()
  scrollToBottom()
})
onBeforeUnmount(() => {
  if (websocket.value) {
    websocket.value.close()
    isHandClose.value = true
    clearReconnectTimer()
  }
})
</script>

<style lang="scss" scoped>
.chat-service {
  width: 100%;
  height: 40rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  .chat-content {
    width: 68%;
    height: 100%;
    border: 0.5px solid gray;
    display: flex;
    .chat-left {
      overflow-y: auto; /* 当内容超出容器的高度时，垂直方向上出现滚动条 */
      max-height: 95%; /* 可以设置一个最大高度，例如100%表示容器高度不超过父容器的高度 */
      padding: 10px 0;
      width: 26%;
      border-right: 1px solid rgba(128, 128, 128, 0.052);
      background-color: #c0baba1f;
      .chat-user {
        padding: 20px;
        border-bottom: 1px solid gray;
        cursor: pointer;
        &:hover {
          background-color: #bab5b553;
        }
      }
      .is-active {
        background-color: #8783835c;
      }
    }
    .chat-right {
      padding: 20px 0;
      flex: 1;
      // 头部名字
      .chat-box-header {
        padding-left: 20px;
        height: 7%;
        max-width: 100%;
        border-bottom: 1px solid rgb(237, 231, 231);
      }
      // 消息队列
      .chat-box-content {
        padding-left: 20px;
        height: 72%;
        overflow-y: auto; /* 当内容超出高度时显示垂直滚动条 */
        max-width: 100%;
        border-bottom: 1px solid rgb(237, 231, 231);
        .user-message {
          flex-direction: row-reverse;
          text-align: right;
        }
        .server-message {
          text-align: left;
        }
        .perMessage {
          height: 90px;
          color: rgb(33, 32, 32);
          display: flex;
          position: relative;
          .time {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            color: rgb(109, 108, 108);
          }
          .profileImg {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            margin-right: 5px;
          }

          .msgBox {
            width: 100%;
            .proName {
              margin-right: 5px;
              margin-bottom: 5px;
              font-size: 13px;
              color: #616060;
            }

            .msgContent {
              display: inline-block; /* Adjust width based on content */
              max-width: 80%;
              background-color: rgb(244, 239, 239);
              border-radius: 6px;
              font-size: 15px;
              color: #373636;
              padding: 5px 10px;
              text-align: left;
              overflow-wrap: break-word; /* 兼容其他浏览器 */
              white-space: normal; /* 确保文本在需要时换行 */
            }
          }
        }
      }
      .chat-box-footer {
        padding-top: 10px;
        position: relative;
        .textareaInput {
          width: 100%;
          border: none;
        }
        .sendBtn {
          position: absolute;
          right: 10px;
          bottom: 10px;
          background-color: #ffffff00;
          color: rgb(76, 187, 231);
        }
      }
    }
  }
}
</style>