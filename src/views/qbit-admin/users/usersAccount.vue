<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-input
        v-model="idInput"
        clearable
        placeholder="请输入账号"
        style="width: 220px; margin: 0 20px 0 0px"
        class="filter-item"
      />
      <el-button
        class="button-new-tag"
        size="small"
        type="primary"
        plain
        icon="el-icon-search"
        @click="searchBtcClickAction()"
      >
        搜索
      </el-button>
      <el-button size="small" type="success" plain @click="addDialog()">
        新增
      </el-button>
      <el-table
        ref="singleTable"
        v-loading="listLoading"
        style="margin-top:20px"
        :data="list"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="用户编号" width="100px" prop="userId" />
        <el-table-column align="center" label="账户" prop="userAccount" />
        <el-table-column align="center" label="密码" prop="password" />
        <el-table-column align="center" :label="$t('table.actions')" width="200px">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.btnDisabled"
              size="small"
              type="danger"
              plain
              @click="deleteUsers(scope.row)"
            >
              刪除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
      />

      <!-- 新增弹窗 -->
      <el-dialog title="新增账户" :visible.sync="dialogVisible" width="45%">
        <el-form ref="form" label-width="100px" :model="form" :rules="rules">
          <el-form-item label="账户：" prop="account">
            <el-input v-model="form.userAccount" placeholder="输入账户" clearable />
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="form.password" placeholder="输入密码" clearable type="password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              v-model="form.checkPass"
              type="password"
              placeholder="再次输入密码"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item style="margin-bottom:20px;">
            <el-button @click="dialogVisible = false">
              取 消
            </el-button>
            <el-button
              type="primary"
              :disabled="submitBtnDisabled"
              style="margin-left:20px"
              @click="submitForm()"
            >
              确 定
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 修改密码弹窗 -->
      <!-- <el-dialog title="修改密码" :visible.sync="updateDialogVisible" width="45%">
        <el-form ref="updateForm" label-width="100px" :model="updateForm" :rules="rules2">
          <el-form-item label="账户：" prop="account">
            <el-input v-model="updateForm.account" clearable disabled />
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input
              v-model="updateForm.password"
              placeholder="输入密码"
              autocomplete="off"
              clearable
              type="password"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              v-model="updateForm.checkPass"
              type="password"
              autocomplete="off"
              clearable
              placeholder="再次输入密码"
            />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-input v-model="updateForm.role" disabled autocomplete="off" />
          </el-form-item>
          <el-form-item style="margin-bottom:20px;">
            <el-button @click="updateDialogVisible = false">
              取 消
            </el-button>
            <el-button
              type="primary"
              :disabled="submitBtnDisabled"
              style="margin-left:20px"
              @click="submitUpdateForm()"
            >
              确 定
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog> -->
    </div>
  </div>
</template>
<script lang="ts">
import Pagination from '@/components/Pagination/index.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import {getUsers,addUsers,deleteUsers,getUsersById} from '@/api/users'
import {
  formatNumber,
  deleteNullProperty,
  parseTime,
  pickerOptions,
  isNumber
} from '@/utils/index'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Users',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0;
  private list: any = [];
  private userList: any = [];
  private listBackups: any = [];
  private listLoading = false;
  private userIdList: string[] = [];
  private currentRow: any = null;
  private idInput: string = '';
  private dialogVisible: any = false;
  private updateDialogVisible: any = false;
  private submitBtnDisabled = false;
  private pickerOptions = pickerOptions;
  private form: any = {
    userAccount: '',
    password: '',
    checkPass: '',
  };
  // private updateForm: any = {
  //   account: '',
  //   password: '',
  //   checkPass: '',
  //   role: ''
  // };
  private listQuery = {
    page: 1,
    size: 10
  };
  private validatePass0 = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else {
      if (this.form.checkPass !== '') {
        const form: any = this.$refs['form']
        form.validateField('checkPass')
      }
      callback()
    }
  };
  private validatePass1 = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== this.form.password) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  };
  private rules = {
    password: [{ validator: this.validatePass0, trigger: 'blur' }],
    checkPass: [{ validator: this.validatePass1, trigger: 'blur' }]
  };
  created() {
    this.getUsers()
  }
  private async addDialog() {
    this.dialogVisible = true
  }
  // private async updateDialog(row: any) {
  //   this.updateDialogVisible = true
  //   this.updateForm.account = row.account
  //   this.updateForm.role = row.role
  // }
  /**
   * 获取用户
   */
  private async getUsers(filterData: any = null) {
    this.listLoading = true
    const res = await getUsers()
    this.list = res.data
    this.total = res.data.total
    this.initData()
    this.listLoading = false
  }
  private async getUsersById(userAccount: string) {
    const res = await getUsersById(userAccount)
    console.log(res.data)
    this.list = res.data
  }
  /**
   * 新增用户
   */
  private async addUsers(filterData: any = null) {
    const res = await addUsers(filterData)
    if (res) {
      this.$message({
        message: '新增成功',
        type: 'success'
      })
      await this.getUsers()
    }
  }
  /**
   * 提交新增表单
   */
  private async submitForm() {
    this.addUsers(this.form)
    this.dialogVisible = false
  }

  /**
   * 删除用户
   */
  private async deleteUsers(row: any) {
    let id = row.userId
    const res = await deleteUsers(id)
    if (res) {
      await this.getUsers()
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    }
  }
  /**
   * 点击查询按钮
   */
  public searchBtcClickAction() {
    let userAccount = this.idInput
    if (userAccount !== '') {
      this.getUsersById(userAccount)
    } else {
      this.getUsers()
    }
  }

  /**
   * 选中表格某行
   */
  private selectTableSomeRow(row: any) {
    let index = 0
    this.list.forEach((item: any, i: number) => {
      if (item.id === row.id) {
        index = i
      }
    })

    const table = this.$refs.singleTable as any
    table.setCurrentRow(this.list[index])
  }
  /**
   * 初始化数据
   */
  private initData() {
  }
}
</script>
