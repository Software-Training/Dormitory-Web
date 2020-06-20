<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-input
        v-model="nameInput"
        placeholder="输入姓名"
        style="width: 220px; margin: 0 20px 0 0px"
        class="filter-item"
      />
      <el-input
        v-model="phoneInput"
        placeholder="输入手机号"
        style="width: 220px; margin: 0 20px 0 0px"
        class="filter-item"
      />
      <el-button
        class="button-new-tag"
        size="small"
        type="primary"
        style="margin: 0 20px 0 0px"
        icon="el-icon-search"
        @click="searchBtcClickAction"
      >
        搜索
      </el-button>
      <el-button
        class="button-new-tag"
        size="small"
        type="primary"
        plain
        icon="el-icon-edit"
        style="margin: 0 20px 0 0px"
        @click="dialogClickAction"
      >
        生成邀请码
      </el-button>
      <el-table
        ref="singleTable"
        v-loading="listLoading"
        style="width: 100%;margin-top:20px"
        :data="list"
        border
        fit
        highlight-current-row
        @row-click="tableRowSelected"
      >
        <el-table-column
          type="index"
          width="40"
          align="center"
        />
        <el-table-column
          align="center"
          label="渠道方编号"
          width="205px"
          prop="_id"
        />
        <el-table-column
          align="center"
          label="姓名"
          prop="nickname"
        />
        <el-table-column
          align="center"
          label="手机号"
          prop="phone"
        />
        <el-table-column
          align="center"
          label="邀请码"
          prop="phone"
        >
          <template slot-scope="scope">
            <el-tag
              v-for="tag in scope.row.authCodes"
              :key="tag.value"
              style="margin: 0 10px 0 0px"
              effect="plain"
            >
              {{ tag.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createdAt"
          width="160px"
        />
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="pagination"
      />
      <el-table
        v-if="bottomTableVisible"
        v-loading="listLoading"
        style="width: 100%;"
        :data="authCodesList"
        fit
        size="small"
        highlight-current-row
      >
        <el-table-column
          type="index"
          width="40"
          align="center"
        />
        <el-table-column
          align="center"
          label="渠道方编号"
          prop="name"
        />
        <el-table-column
          align="center"
          label="渠道方编号"
          prop="url"
        />
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-tooltip
              content="点击复制链接"
              placement="top"
              effect="light"
            >
              <el-button
                icon="el-icon-document-copy"
                circle
                @click="handleClipboard(scope.row.url,$event)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--dialog-->
      <el-dialog
        title="生成邀请码"
        :visible.sync="dialogVisible"
        width="45%"
      >
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
        >
          <el-form-item
            label="姓名："
            prop="name"
            :rules="[
              {required: true, message: '姓名不能为空'}
            ]"
          >
            <el-input
              v-model="form.name"
              placeholder="输入姓名"
            />
          </el-form-item>
          <el-form-item
            label="手机号："
            prop="phone"
            :rules="[
              {required: true, message: '手机号不能为空'}
            ]"
          >
            <el-input
              v-model="form.phone"
              placeholder="输入手机号"
            />
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            :disabled="submitBtnDisabled"
            type="primary"
            @click="submitForm('form')"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import Pagination from '@/components/Pagination/index.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getUsers, creatInvitationCode } from '@/api/qbit'
import { handleClipboard } from '@/utils/clipboard'
import { formatNumber, deleteNullProperty, parseTime } from '@/utils/index'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Channels',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0;
  private list: any = [];
  private userList: any = [];
  private listBackups: any = [];
  private authCodesList:any = [];
  private listLoading = false;
  private userIdList: string[] = [];
  private currentRow: any = null;
  private nameInput: string = '';
  private phoneInput: string = '';
  private dialogVisible: boolean = false;
  private bottomTableVisible: boolean = false;
  private form = { name: '', phone: '' };
  private submitBtnDisabled = false;
  private handleClipboard = handleClipboard
  private listQuery = {
    page: 1,
    limit: 10
  };

  created() {
    this.getChannels()
  }

  /**
   * 获取预约商户
   */
  private async getChannels(filterData: any = null) {
    this.listLoading = true

    const filter = Object.assign(
      { role: 400, status: 'Verifying' },
      filterData
    )
    const page = { num: this.listQuery.page, size: this.listQuery.limit }
    const res = await getUsers({ filter, page })
    this.list = res.data.users
    this.total = res.data.userCount
    this.initData()

    this.listLoading = false
  }

  /**
   * 点击查询按钮
   */
  private searchBtcClickAction() {
    const filterData = { nickname: this.nameInput, phone: this.phoneInput }
    deleteNullProperty(filterData)
    this.getChannels(filterData)
  }

  /**
   * 翻页查询
   */
  private async pagination() {
    this.authCodesList = []
    const filter = { inviteId: null }
    await this.getChannels()
  }

  /**
   * 初始化数据
   */
  private initData() {
    this.userIdList = []
    this.list.forEach((item: any) => {
      item.createdAt = parseTime(item.createdAt)
    })
  }

  /**
   * 显示对话框
   */
  private dialogClickAction() {
    this.dialogVisible = true
    this.resetForm()
  }

  /**
   * 创建邀请码
   */
  private async CreatCode() {
    this.submitBtnDisabled = true
    this.dialogVisible = false
    const res = await creatInvitationCode(this.form.name, this.form.phone)
    if (res.data.authCode) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      await this.getChannels()
      const row = this.list.find((s:any) => s.phone === this.form.phone)
      this.selectTableSomeRow(row)
    }
    this.submitBtnDisabled = true
  }

  /**
   * 提交表单
   */
  private submitForm(formName: string) {
    const form: any = this.$refs[formName]
    form.validate((valid: any) => {
      if (valid) {
        this.CreatCode()
      }
    })
  }

  /**
   * 重置表单
   */
  private resetForm() {
    const form: any = this.$refs['form']
    if (form) {
      form.resetFields()
    }
  }

  /**
   * 选中表格某行
   */
  private selectTableSomeRow(row: any) {
    let index = 0
    this.list.forEach((item: any, i: number) => {
      if (item._id === row._id) {
        index = i
      }
    })

    const table = this.$refs.singleTable as any
    table.setCurrentRow(this.list[index])
  }

  /**
   * 表格选中行事件
   */
  private tableRowSelected(row:any) {
    this.authCodesList = []
    this.bottomTableVisible = true
    if (row.authCodes && row.authCodes.length > 0) {
      row.authCodes.forEach((item:any) => {
        let url = 'https://www.qbitnetwork.com/#/sign-up?inviteCode='
        url += item.value
        const name = row.nickname
        this.authCodesList.push({ url, name })
      })
    }
  }
}
</script>
