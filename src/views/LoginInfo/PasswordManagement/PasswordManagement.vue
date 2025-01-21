<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoginerStore } from '@/stores/LoginerStore'
import { updatePasswordAPI } from '@/apis/login'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getCaptchaAPI, checkPasswordAPI } from '@/apis/user'
// 获取t方法才可以在js代码里使用
const { t } = useI18n()
const ruleForm = reactive({
  Oripass: '',
  pass: '',
  checkPass: '',
  captcha: ''
})
const isPassOrigin = ref(false)
const router = useRouter()
const LoginerStore = useLoginerStore()
const LoginerId = computed(() => LoginerStore.userInfo.id)
// 图片验证码
const getcaptcha = ref([])
const captchaString = computed(() => getcaptcha.value.map((item) => item.value).join(''))
// 对象dom
const ruleFormRef = ref()
// 确定密码函数
const validateConfirm = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(t('messages.input_again')))
  } else if (value !== ruleForm.pass) {
    callback(new Error(t('messages.checkpass_match')))
  } else {
    callback()
  }
}
const checkPassword = async () => {
  const res = await checkPasswordAPI(LoginerId.value, ruleForm.Oripass)
  isPassOrigin.value = res.result
}
// 提醒框组件功能使用
const centerDialogVisible = ref(false)
const changeDialogVisible = (value) => {
  centerDialogVisible.value = value
}
const submitForm = (formRef) => {
  // 调用表单的 validate 方法进行验证
  formRef.validate(async (valid) => {
    if (valid) {
      // 如果表单验证通过，可以继续执行提交逻辑
      // 进行api提交
      await checkPassword()
      if (isPassOrigin.value) {
        await updatePasswordAPI(LoginerId.value, ruleForm.pass)
        ElMessage({
          message: '修改密码成功',
          type: 'success',
          plain: true
        })
        router.replace('/login')
        LoginerStore.clearUser()
      } else {
        ElMessage({
          message: '原密码错误',
          type: 'error',
          plain: true
        })
      }
    } else {
      // 如果表单验证不通过，出现dialog并且提醒
      centerDialogVisible.value = true
    }
  })
}
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
const rules = {
  Oripass: [{ required: true, message: t('messages.input_originPass_required'), trigger: 'blur' }],
  pass: [
    { required: true, message: t('messages.input_pass'), trigger: 'blur' },
    { min: 8, message: t('messages.pass_rule'), trigger: 'blur' },
    {
      // 正则表达式
      pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
      message: t('messages.pass_rele_second'),
      trigger: 'blur'
    }
  ],
  checkPass: [
    { required: true, message: t('messages.checkpass_input'), trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: t('messages.captcha_input'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== captchaString.value) {
          callback(new Error(t('messages.captcha_check')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 假设一个验证功能：具体得用后端的接口提供的验证码

const generateCaptcha = async () => {
  const res = await getCaptchaAPI()
  getcaptcha.value = res
}

onMounted(() => generateCaptcha())
</script>

<template>
  <DialogTip
    :TipMessage="$t('messages.passSubmit_tip')"
    :centerDialogVisible="centerDialogVisible"
    @changeDialogVisible="changeDialogVisible"
  ></DialogTip>
  <div class="passwordDiv">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('messages.Original_password')" prop="Oripass">
        <el-input
          v-model="ruleForm.Oripass"
          type="password"
          autocomplete="off"
          :placeholder="$t('messages.input_originPass_required')"
        />
      </el-form-item>
      <el-form-item :label="$t('messages.Password')" prop="pass">
        <el-input
          v-model="ruleForm.pass"
          type="password"
          autocomplete="off"
          :placeholder="$t('messages.input_pass')"
        />
      </el-form-item>
      <el-form-item :label="$t('messages.Confirm_Password')" prop="checkPass">
        <el-input
          v-model="ruleForm.checkPass"
          type="password"
          autocomplete="off"
          :placeholder="$t('messages.checkpass_input')"
        />
      </el-form-item>
      <el-form-item :label="$t('messages.Captcha')" prop="captcha">
        <el-input
          v-model="ruleForm.captcha"
          style="width: 7rem"
          :placeholder="$t('messages.captcha_input')"
        />
        <el-button class="captcha-box" @click="generateCaptcha">
          <el-link
            v-for="(char, index) in getcaptcha"
            :key="index"
            class="captcha-char"
            :style="{
              transform: `rotate(${char.rotation}deg) translateX(${char.position}px)`
            }"
            >{{ char.value }}</el-link
          >
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">{{
          $t('messages.update')
        }}</el-button>
        <el-button @click="resetForm(ruleFormRef)">{{ $t('messages.reset') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<style scoped lang="scss">
.passwordDiv {
  margin: 5rem;
}
.captcha-box {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  display: inline-block;
  font-family: Arial, sans-serif;
  position: relative;
  margin-left: 6rem;
  font-size: 1rem;
  height: 1.6rem;
}

.captcha-char {
  display: inline-block;
  margin: 0 5px;
  transform: rotate(-20deg);
}
</style>