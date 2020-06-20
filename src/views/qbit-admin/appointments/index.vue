<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-input
        v-model="idInput"
        placeholder="请输入用户id"
        style="width: 220px; margin: 0 20px 0 0px"
        class="filter-item"
      />
      <el-input
        v-model="nameInput"
        placeholder="请输入用户名称"
        style="width: 220px; margin: 0 20px 0 0px"
        class="filter-item"
      />
      <el-input
        v-model="phoneInput"
        placeholder="请输入用户手机号"
        style="width: 220px; margin: 0 20px 0 0px"
        class="filter-item"
      />
      <el-input
        v-model="emailInput"
        placeholder="请输入用户邮箱"
        style="width: 220px; margin: 0 20px 0 0px"
        class="filter-item"
      />
      <el-date-picker
        v-model="dateInput"
        type="daterange"
        align="center"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        style="width: 250px;margin: 0 20px 0 0"
      />
      <el-button
        class="button-new-tag"
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="searchBtcClickAction"
      >
        搜索
      </el-button>
      <el-table
        ref="singleTable"
        v-loading="listLoading"
        style="width: 100%;margin-top:20px"
        :data="list"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          type="index"
          width="40"
          align="center"
        />
        <el-table-column
          align="center"
          label="用户id"
          width="205px"
          prop="_id"
        />
        <el-table-column
          align="center"
          label="姓名"
          prop="nickname"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
            >
              <p>{{ scope.row.nickname }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <router-link
                  :to="{name: 'Merchant', params: {userId: scope.row._id}}"
                >
                  <el-link
                    type="primary"
                  >
                    <span>{{ scope.row.nickname }}</span>
                  </el-link>
                </router-link>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="手机号"
          prop="phone"
        />
        <el-table-column
          align="center"
          label="邮箱"
          min-width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
            >
              <p>{{ scope.row.email }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <span>{{ scope.row.email }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="账户类型"
          prop="accountType"
        />
        <el-table-column
          align="center"
          label="业务类型"
          prop="businessType"
        />
        <el-table-column
          align="center"
          label="渠道方"
          prop="refererInfo"
        />
        <el-table-column
          align="center"
          label="备注"
          show-overflow-tooltip
          prop="accountApplicationMemo"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
            >
              <p>{{ scope.row.accountApplicationMemo }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <span>{{ scope.row.accountApplicationMemo }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="150px"
          label="最近重置密码邮件的发送时间"
          prop="accountActivationLinkSentAt"
        />
        <el-table-column
          align="center"
          label="创建时间"
          width="150px"
          prop="createdAt"
        />
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          width="180"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="submitBtnDisabled"
              size="small"
              type="primary"
              plain
              @click="openDialog(scope.row)"
            >
              确认开户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="pagination"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Pagination from '@/components/Pagination/index.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getUsers, sendAccountActivationLink } from '@/api/qbit'
import { formatNumber, deleteNullProperty, parseTime, pickerOptions } from '@/utils/index'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Appointments',
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
  private nameInput: string = '';
  private phoneInput: string = '';
  private emailInput: string = '';
  private dateInput: any = [];
  private submitBtnDisabled = false;
  private listQuery = {
    page: 1,
    limit: 10
  };
  private accountType: any = {
    individuals: '个人',
    corp: '企业/组织'
  };
  private businessType: any = {
    platform_seller: '电商平台卖家',
    direct_seller: '电商平台/独立站',
    goods_trade: '一般货物贸易',
    logistics: '物流行业',
    ads: '广告市场推广',
    others: '其他'
  };
  private pickerOptions = pickerOptions

  created() {
    this.getAppointments()
  }

  /**
   * 获取预约商户
   */
  private async getAppointments(filterData: any = null) {
    this.listLoading = true

    const filter = Object.assign(
      { role: 300, status: 'Verifying' },
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
    let filterData = { _id: this.idInput, nickname: this.nameInput, phone: this.phoneInput, email: this.emailInput }
    if (this.dateInput && this.dateInput.length > 0) {
      const filter = { createdAt: { $gte: this.dateInput[0].getTime(), $lte: this.dateInput[1].getTime() } }
      filterData = Object.assign(filterData, filter)
    }
    deleteNullProperty(filterData)
    this.getAppointments(filterData)
  }

  /**
   * 翻页查询
   */
  private async pagination() {
    let filter = { inviteId: null }
    if (this.dateInput && this.dateInput.length > 0) {
      const filterObj = { createdAt: { $gte: this.dateInput[0].getTime(), $lte: this.dateInput[1].getTime() } }
      filter = Object.assign(filter, filterObj)
    }
    await this.getAppointments(filter)
  }

  /**
   * 初始化数据
   */
  private initData() {
    this.userIdList = []
    this.list.forEach((item: any) => {
      if (item.accountActivationLinkSentAt) {
        item.accountActivationLinkSentAt = parseTime(
          item.accountActivationLinkSentAt
        )
      } else {
        item.accountActivationLinkSentAt = '/'
      }
      if (!item.accountApplicationMemo) {
        item.accountApplicationMemo = '/'
      }
      item.createdAt = parseTime(item.createdAt)
      item.refererInfo = item.refererInfo ? item.refererInfo.nickname : '无'
      item.accountType = this.accountType[item.accountType]
      item.businessType = this.businessType[item.businessType]
    })
  }

  /**
   * 确认开户
   */
  private async confirmAccountBtnClick(row: any) {
    this.submitBtnDisabled = true
    if (row) {
      const res = await sendAccountActivationLink(row._id)
      if (res.data.sendAccountActivationLink) {
        this.$message({
          message: '邮件发送成功',
          type: 'success'
        })
        await this.getAppointments()
        this.selectTableSomeRow(row)
      }
    }
    this.submitBtnDisabled = false
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
   * 选择确定框
   */
  private openDialog(row:any) {
    this.$confirm('是否要给该商户发开户邮件哦？亲！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.confirmAccountBtnClick(row)
    }).catch(() => {
    })
  }
}
</script>
