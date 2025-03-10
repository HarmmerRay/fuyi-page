<template>
  <div class="admin-header">
    <div class="left">
    </div>
    <div class="right">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="avatar-container">
          <img :src="userInfo.avatar" class="avatar" alt="">
          <span class="username">{{ userInfo.userName || '管理员' }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="security">
            <i class="fas fa-shield-alt"></i> 安全配置
          </el-dropdown-item>
          <el-dropdown-item command="frontend">
            <i class="fas fa-home"></i> 返回前台
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <i class="fas fa-sign-out-alt"></i> 退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 安全配置弹窗 -->
    <el-dialog
      title="安全配置"
      :visible.sync="securityDialogVisible"
      width="500px"
      custom-class="security-dialog">
      <el-form :model="securityForm" :rules="securityRules" ref="securityForm" label-width="120px">
        <el-form-item label="密钥" prop="currentKey">
          <el-input
            v-model="securityForm.currentKey"
            placeholder="请输入密钥"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newKey">
          <el-input
            v-model="securityForm.newKey"
            placeholder="请输入新密码"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmKey">
          <el-input
            v-model="securityForm.confirmKey"
            placeholder="请再次输入新密码"
            show-password>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="securityDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveConfig('securityForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { safe_settings } from '@/api/admin.js'

const store = useStore()
const router = useRouter()

// Data
const securityDialogVisible = ref(false)
const securityForm = ref({
  currentKey: '',
  newKey: '',
  confirmKey: ''
})
const securityFormRef = ref(null)

// Computed
const userInfo = computed(() => store.state.user.userInfo)

// Methods
const handleCommand = (command) => {
  switch (command) {
    case 'security':
      handleSecurity()
      break
    case 'frontend':
      router.push('/')
      break
    case 'logout':
      ElMessageBox.confirm('确认退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout')
        router.push('/auth')
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消'
        })
      })
      break
  }
}

const handleSecurity = () => {
  securityDialogVisible.value = true
}

const handleSaveConfig = () => {
  securityFormRef.value.validate((valid) => {
    if (valid) {
      const { currentKey, newKey } = securityForm.value
      safe_settings(currentKey, newKey).then(res => {
        ElMessage.success(res.message)
        securityDialogVisible.value = false
        securityFormRef.value.resetFields()
      }).catch(() => {})
    }
  })
}

// Validation rules
const validateConfirmKey = (rule, value, callback) => {
  if (value !== securityForm.value.newKey) {
    callback(new Error('两次输入的密钥不一致'))
  } else {
    callback()
  }
}

const securityRules = {
  currentKey: [
    { required: true, message: '请输入当前密钥', trigger: 'blur' }
  ],
  newKey: [
    { required: true, message: '请输入新密钥', trigger: 'blur' },
    { min: 6, message: '密钥长度不能小于6位', trigger: 'blur' }
  ],
  confirmKey: [
    { required: true, message: '请再次输入新密钥', trigger: 'blur' },
    { validator: validateConfirmKey, trigger: 'blur' }
  ]
}
</script>

<style scoped>
.admin-header {
  height: 60px;
  background: #1a1a1a;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.left {
  /* 移除 .left h2 相关样式 */
}

.avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.avatar-container:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.username {
  color: #fff;
  font-size: 14px;
  margin-right: 4px;
}

:deep(.el-dropdown-menu) {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #f5f7fa;
  color: #5436a8;
}

:deep(.el-dropdown-menu__item i) {
  font-size: 14px;
  color: #909399;
}

:deep(.el-dropdown-menu__item.el-dropdown-menu__item--divided) {
  margin-top: 0;
  border-top: 1px solid #e4e7ed;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item.el-dropdown-menu__item--divided:hover) {
  background: #fef0f0;
  color: #f56c6c;
}

:deep(.el-dropdown-menu__item.el-dropdown-menu__item--divided i) {
  color: #f56c6c;
}

:deep(.el-dropdown-menu__item--divided:before) {
  display: none;
}

:deep(.security-dialog) {
  background: #1f2937;
}

:deep(.el-dialog__title) {
  color: #fff;
}

:deep(.el-form-item__label) {
  color: #8f9ba8;
}

:deep(.el-input__inner) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

:deep(.el-input__inner:focus) {
  border-color: #5436a8;
}
</style>
