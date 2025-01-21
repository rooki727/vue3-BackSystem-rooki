<script  setup>
import { reactive, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import { checkAdminAccountAPI } from '@/apis/user'
import { useLoginerStore } from '@/stores/LoginerStore'
const userStore = useUserStore()
const LoginerStore = useLoginerStore()
const login_id = computed(() => LoginerStore.userInfo.id)
// 获取t方法才可以在js代码里使用
const { t } = useI18n()
// 弹框功能设置
const props = defineProps(['dialogFormVisible', 'title'])
const centerDialogVisible = computed(() => props.dialogFormVisible)
const title = computed(() => props.title)
const emit = defineEmits(['changeDialogVisible'])
const verifyChoose = [
  { id: 1, verify: 'first' },
  { id: 2, verify: 'second' }
]
const addForm = ref(null)
const addform = reactive({
  name: '',
  account: null,
  password: '',
  verify: '',
  gender: '',
  phone: null,
  email: ''
})
// 判断账号存在是否
const accountExists = ref(false)

const rules = {
  name: [
    {
      required: true,
      message: t('messages.base_nameinput'),
      trigger: 'blur'
    },
    { min: 5, message: t('messages.base_namerule'), trigger: 'blur' }
  ],
  account: [
    {
      required: true,
      message: t('messages.account_input'),
      trigger: 'blur'
    },
    {
      min: 5,
      message: t('messages.account_min'),
      trigger: 'blur'
    },
    {
      pattern: /^[0-9]+$/, // 使用正则表达式限制输入只能为数字字符
      message: t('messages.base_accountNum'), // 自定义提示消息
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('messages.input_pass'),
      trigger: 'blur'
    },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      message: t('messages.password_inputAll'),
      trigger: 'blur'
    }
  ],
  gender: [{ required: true }],
  verify: [{ required: true }],
  phone: [
    {
      required: true,
      message: t('messages.base_phoneinput'),
      trigger: 'blur'
    },
    { min: 11, message: t('messages.base_phonerule'), trigger: 'blur' },
    {
      pattern: /^[0-9]+$/, // 使用正则表达式限制输入只能为数字字符
      message: t('messages.base_digitsonly'), // 自定义提示消息
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: t('messages.email_required'), // 如果未输入电子邮件地址，则显示此消息
      trigger: 'blur'
    },
    {
      type: 'email',
      message: t('messages.email_invalid'), // 如果输入的电子邮件地址格式不正确，则显示此消息
      trigger: ['blur', 'change']
    }
  ]
}

// 重置表单函数
const resetForm = () => {
  addform.name = ''
  addform.account = null
  addform.password = ''
  addform.verify = ''
  addform.gender = ''
  addform.phone = null
  addform.email = ''
}

const changeDialogVisible = () => {
  emit('changeDialogVisible', false)
  resetForm()
}

const submitadd = (addForm) => {
  addForm.validate((valid) => {
    if (valid && accountExists.value === false) {
      // api数据请求，添加该用户的信息
      emit('changeDialogVisible', false)
      const date = new Date()
      addform.buildTime = date
      userStore
        .addAdmin(addform, login_id.value)
        .then((res) => {
          if (res.result) {
            ElMessage({ type: 'success', message: '添加成功' })
            resetForm()
          } else {
            ElMessage({ type: 'success', message: '请确认您的权限或信息' })
          }
        })
        .catch(() => {
          // 处理请求失败的情况
          ElMessage({ type: 'error', message: '添加失败！请检查输入信息' })
          // 在此处可以添加相应的错误处理逻辑，例如提示用户登录失败等
        })
    } else {
      // 如果表单验证不通过，提醒
      ElMessage({ type: 'error', message: '添加失败！请检查输入信息' })
    }
  })
}

// 检查是否存在account

const checkAccountExist = async () => {
  // 判断单个检验
  addForm.value.validateField(['account'], async (valid) => {
    if (valid) {
      const res = await checkAdminAccountAPI(parseInt(addform.account))
      if (res.result == 'account存在') {
        accountExists.value = true
        ElMessage({ type: 'error', message: '该账号已存在' })
      } else {
        accountExists.value = false
        ElMessage({ type: 'success', message: '该账号可用' })
      }
    }
  })
}
</script>

<template>
  <el-dialog
    :model-value="centerDialogVisible"
    :title="title"
    width="500"
    align-center
    :show-close="false"
    :lock-scroll="false"
    :close-on-click-modal="false"
  >
    <el-form :model="addform" :rules="rules" ref="addForm">
      <el-form-item :label="$t('messages.name')" label-width="8.75rem" prop="name">
        <el-input v-model="addform.name" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="$t('messages.account')" label-width="8.75rem" prop="account">
        <el-input v-model="addform.account" autocomplete="off" @blur="checkAccountExist" />
      </el-form-item>
      <el-form-item :label="$t('messages.Password')" label-width="8.75rem" prop="password">
        <el-input v-model="addform.password" autocomplete="off" type="password" show-password />
      </el-form-item>
      <!-- 使用下拉框选择权限 -->
      <el-form-item :label="$t('messages.verify')" label-width="8.75rem" prop="verify">
        <el-select v-model="addform.verify" :placeholder="$t('messages.please_Choose')">
          <el-option
            v-for="item in verifyChoose"
            :key="item.id"
            :label="item.verify"
            :value="item.verify"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('messages.gender')" label-width="8.75rem" prop="gender">
        <el-radio-group v-model="addform.gender">
          <el-radio value="男">{{ $t('messages.man') }}</el-radio>
          <el-radio value="女">{{ $t('messages.woman') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('messages.phone')" label-width="8.75rem" prop="phone">
        <el-input v-model="addform.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="$t('messages.email')" label-width="8.75rem" prop="email">
        <el-input type="email" v-model="addform.email" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="changeDialogVisible">{{ $t('messages.Cancel') }}</el-button>
        <el-button type="primary" @click="submitadd(addForm)">
          {{ $t('messages.addUser') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>


