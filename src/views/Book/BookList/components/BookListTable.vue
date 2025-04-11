<template>
  <editDialog
    :cannotInpId="cannotInpId"
    :clickRow="clickRow"
    :title="dialogTitle"
    :dialogFormVisible="dialogFormVisible"
    @updateClickRow="updateClickRow"
    @changeDialogVisible="changeDialogVisible"
  ></editDialog>
  <div>
    <el-table :data="currentPageData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column width="40" type="selection" />
      <el-table-column fixed prop="book_id" label="book_id" width="150" />

      <el-table-column fixed prop="book_name" :label="$t('messages.book_name')" width="200" />

      <el-table-column prop="author" :label="$t('messages.author')" width="220" />
      <el-table-column prop="category" :label="$t('messages.category')" width="120" />
      <el-table-column prop="price" :label="$t('messages.price')" width="120" />
      <el-table-column prop="stock" :label="$t('messages.stock_quantity')" width="120" />
      <el-table-column prop="sale_number" :label="$t('messages.sale_number')" width="120" />
      <el-table-column
        prop="formattedBuildTime"
        :label="$t('messages.book_build_time')"
        width="250"
      />
      <el-table-column fixed="right" :label="$t('messages.operations')" width="160">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">{{
            $t('messages.edit')
          }}</el-button>
          <el-popconfirm :title="$t('messages.confirmToDetele')" @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button link type="primary" size="small">{{ $t('messages.delete') }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageDiv">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[6, 8, 10, 12]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRowSize"
      />
    </div>
  </div>
</template>

<script setup>
import editDialog from './editDialog.vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBookStore } from '@/stores/BookStore'
import { ElMessage } from 'element-plus'
// 获取t方法才可以在js代码里使用
const { t } = useI18n()
// 添加对话框
const BookStore = useBookStore()
const dialogTitle = ref('')
const dialogFormVisible = ref(false)
const clickRow = ref({})
const cannotInpId = ref(true)
const changeDialogVisible = (value) => {
  dialogFormVisible.value = value
}
// 取消按钮时重置点击行
const updateClickRow = (newValue) => {
  clickRow.value = newValue
}
const props = defineProps(['BookList'])
// 分页功能
const pageSize = ref(8)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const currentPage = ref(1)
// 将代码table监听获值
const computedtable = computed(() => props.BookList)
const totalAdmin = ref([])
const totalRowSize = computed(() => totalAdmin.value?.length)
const currentPageData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return totalAdmin.value.slice(startIndex, endIndex)
})
watch(
  () => computedtable.value,
  (newVal) => {
    totalAdmin.value = newVal
  },
  {
    deep: true
  }
)

// 获取选择框的内容
const multipleSelection = ref([])
const emit = defineEmits(['getDelTable'])

// 获取多选框的数据
const handleSelectionChange = (val) => {
  multipleSelection.value = val
  if (multipleSelection.value.length > 0) {
    // 使用map方法遍历multipleSelection.value数组，并将每个选中项的id存储到一个新的数组中
    const selectedIds = multipleSelection.value.map((item) => item.book_id)

    // 将所选数据提供给父组件
    emit('getDelTable', selectedIds)
  }
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = t('messages.edit')
  changeDialogVisible(true)
  // 在这里使用 row 数据执行编辑操作
  clickRow.value = row
}

const handleDelete = async (row) => {
  // 在这里使用 row 数据执行删除操作
  // api服务器删除后重新获取列表
  await BookStore.deleteBookList(row.book_id)
    .then(() => {
      // 如果 deleteBookList 没有报错，则执行成功提示
      ElMessage({ type: 'success', message: '删除成功' })
    })
    .catch(() => {
      ElMessage({ type: 'error', message: '删除失败' })
    })
}
</script>

<style lang="scss" scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
.pageDiv {
  margin-top: 2rem;
  margin-left: 28rem;
}
</style>
