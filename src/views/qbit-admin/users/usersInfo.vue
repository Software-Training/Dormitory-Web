<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-input
        v-model="idInput"
        clearable
        placeholder="请输入学号"
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
      <!-- <el-button size="small" type="success" plain @click="addDialog()">
        新增
      </el-button> -->
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
        <el-table-column align="center" label="学号" prop="numberId" />
        <el-table-column align="center" label="姓名" prop="name" />
         <el-table-column align="center" label="性别" prop="sex" />
          <el-table-column align="center" label="专业" prop="subject" />
           <el-table-column align="center" label="邮箱" prop="email" />
            <el-table-column align="center" label="宿舍楼栋" prop="dormitoryName"/>
        <!-- <el-table-column align="center" :label="$t('table.actions')" width="200px">
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
        </el-table-column> -->
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.size"
      />

      <!-- 新增弹窗
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
      </el-dialog> -->

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
import {getUserinfo,getUserinfoBynumberId} from '@/api/userinfo'
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
    const res = await getUserinfo()
    this.list = res.data
    this.total = res.data.total
    this.initData()
    this.listLoading = false
  }
  private async getUsersById(numberId: string) {
    const res = await getUserinfoBynumberId(numberId)
    this.list = res.data
  }
  /**
   * 点击查询按钮
   */
  public searchBtcClickAction() {
    let numberId = this.idInput
    if (numberId !== '') {
      this.getUsersById(numberId)
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
      if (item.userId === row.userId) {
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
