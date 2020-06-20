<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-input
        v-model="bankAccountNoInput"
        placeholder="请输入批次号"
        style="width: 220px; margin: 0 20px 0 0px"
        class="filter-item"
      />
      <el-input
        v-model="nameInput"
        placeholder="请输入用户名称"
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
        :span-method="arraySpanMethod"
        highlight-current-row
        @row-click="tableRowSelected"
      >
        <el-table-column
          type="index"
          width="40"
          align="center"
        />
        <el-table-column
          label="批次编号"
          width="285"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
            >
              <p>{{ scope.row.batchNo }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <span>{{ scope.row.batchNo }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="商户名称"
          prop="userId"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
            >
              <p>{{ scope.row.userId }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <router-link
                  :to="{name: 'Merchant', params: {userId: scope.row.userIdBackUp}}"
                >
                  <el-link
                    type="primary"
                  >
                    <span>{{ scope.row.userId }}</span>
                  </el-link>
                </router-link>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="币种"
          prop="currency"
        />
        <el-table-column
          align="center"
          label="批量付款总金额($)"
          prop="batchTradeSumTotalCost"
        />
        <el-table-column
          align="center"
          label="红包总金额($)"
          prop="batchTradeSumUseVirtualCurrency"
        />
        <el-table-column
          align="center"
          label="创建时间"
          prop="createdAt"
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
        ref="singleTable"
        v-loading="tradeListLoading"
        style="width: 100%;"
        :data="tradeList"
        border
        fit
        highlight-current-row
        @expand-change="expandChange"
      >
        <el-table-column
          type="index"
          width="40"
          align="center"
        />
        <el-table-column
          align="center"
          label="换汇订单编号"
          width="210px"
          prop="_id"
        />
        <el-table-column
          align="center"
          label="姓名"
          prop="userName"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          min-width="110"
          label="预计付款金额(￥)"
          prop="batchPaymentCNYAmount"
        />
        <el-table-column
          align="center"
          label="总交易金额($)"
          prop="expectCost"
        />
        <el-table-column
          align="center"
          label="实付金额($)"
          prop="cost"
        />
        <el-table-column
          align="center"
          label="费用($)"
          prop="fee"
        />
        <el-table-column
          align="center"
          label="汇率"
          prop="qbitExchangeRate"
        />
        <el-table-column
          align="center"
          min-width="100"
          label="使用红包金额($)"
          prop="discountCost"
        />
        <el-table-column
          align="center"
          label="交易状态"
        >
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              :type="scope.row.type"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="收款人账户"
          align="center"
          width="140"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-popover
              placement="bottom"
              width="330"
              trigger="click"
            >
              <el-row>
                <el-tag>
                  收款人姓名：{{ scope.row.destination.payerName }}
                </el-tag>
                <el-button
                  icon="el-icon-document-copy"
                  circle
                  size="mini"
                  style="float: right"
                  @click="handleClipboard(scope.row.destination.payerName,$event)"
                />
              </el-row>
              <el-row style="margin-top:5px">
                <el-tag>银行卡号：{{ scope.row.destination.bankAccountNum }}</el-tag>
                <el-button
                  icon="el-icon-document-copy"
                  circle
                  size="mini"
                  style="float: right;"
                  @click="handleClipboard(scope.row.destination.bankAccountNum,$event)"
                />
              </el-row>
              <el-row style="margin-top:5px">
                <el-tag>开户行：{{ scope.row.destination.bankName }}</el-tag>
                <el-button
                  icon="el-icon-document-copy"
                  circle
                  size="mini"
                  style="float: right;"
                  @click="handleClipboard(scope.row.destination.bankName,$event)"
                />
              </el-row>
              <el-row style="margin-top:5px">
                <el-tag>开户支行：{{ scope.row.destination.bankDetailName }}</el-tag>
                <el-button
                  icon="el-icon-document-copy"
                  circle
                  size="mini"
                  style="float: right;"
                  @click="handleClipboard(scope.row.destination.bankDetailName,$event)"
                />
              </el-row>
              <el-button
                slot="reference"
                type="text"
              >
                收款人详情
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          width="150px"
          prop="createdAt"
        />
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.btnDisabled"
              size="small"
              :type="scope.row.type"
              plain
              @click="openDialog(scope.row)"
            >
              处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗 -->
      <el-dialog
        title="审核提交"
        :visible.sync="dialogVisible"
        width="45%"
      >
        <el-form
          ref="form"
          label-width="100px"
          :model="form"
        >
          <el-form-item
            style="margin-left:80px"
            label="是否通过："
          >
            <el-radio-group v-model="form.status">
              <el-radio
                label="交易取消"
                @change="radioChange"
              />
              <el-radio
                v-if="processingRadioBtnShow"
                label="处理中"
                @change="radioChange"
              />
              <el-radio
                v-if="closedRadioBtnShow"
                label="已完成"
                @change="radioChange"
              />
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="原因："
            style="margin-left:50px"
            prop="failReason"
          >
            <el-input
              v-model="form.failReason"
              :disabled="reasonIsDisabled"
              type="textarea"
              rows="4"
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
              @click="submitForm"
            >
              确 定
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import Pagination from '@/components/Pagination/index.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getTradeList, gerTradesVirtualRecord, getUsers, updateFxTrade } from '@/api/qbit'
import {
  formatNumber,
  deleteNullProperty,
  parseTime,
  pickerOptions,
  numberFourDecimal,
  numberTwoDecimal
} from '@/utils/index'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'BatchTrades',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0;
  private roles: any = '';
  private list: any = [];
  private selectRow:any = {};
  private tradeList: any = [];
  private userList: any = [];
  private listBackups: any = [];
  private listLoading = false;
  private tradeListLoading = false;
  private reasonIsDisabled = false;
  private userIdList: string[] = [];
  private currentRow: any = null;
  private bankAccountNoInput: string = '';
  private dateInput: any = [];
  private processingRadioBtnShow: boolean = false;
  private closedRadioBtnShow: boolean = false;
  private dialogVisible: any = false;
  private submitBtnDisabled = false;
  private nameInput: string = '';
  private form: any = {
    id: '',
    userId: '',
    failReason: '',
    status: ''
  };
  private statusMap: any = {
    pending: '待审核',
    closed: '已完成',
    processing: '处理中',
    cancelled: '交易取消'
  };
  private updateStatusMap: any = {
    交易取消: 'cancelled',
    处理中: 'processing',
    已完成: 'closed'
  };
  private listQuery = {
    page: 1,
    limit: 10
  };
  private pickerOptions = pickerOptions

  created() {
    this.roles = UserModule.roles
    this.getBatchTradeList()
  }

  /**
   * 批量付款列表
   */
  private async getBatchTradeList(filterData: any = null) {
    this.listLoading = true

    const page = { num: this.listQuery.page, size: this.listQuery.limit }
    const filter = Object.assign({ type: 'batchTrade' }, filterData)
    const res = await gerTradesVirtualRecord({ filter, page })
    this.list = res.data.tradesVirtualRecord
    this.total = res.data.tradesVirtualRecordCount
    this.initData()
    await this.findUserListbyUserId()

    this.listLoading = false
  }

  /**
   * 点击查询按钮
   */
  private searchBtcClickAction() {
    let filterData = {}
    const userObj = this.userList.find((s: any) => s.nickname === this.nameInput || s.verifiedName === this.nameInput)
    if (!userObj) {
      filterData = { bankAccountNo: this.bankAccountNoInput, userId: '' }
    } else {
      filterData = {
        bankAccountNo: this.bankAccountNoInput,
        userId: userObj._id
      }
    }
    if (this.dateInput && this.dateInput.length > 0) {
      const filter = { createdAt: { $gte: this.dateInput[0].getTime(), $lte: this.dateInput[1].getTime() } }
      filterData = Object.assign(filterData, filter)
    }
    deleteNullProperty(filterData)
    this.getBatchTradeList(filterData)
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
    await this.getBatchTradeList(filter)
  }

  /**
   * 初始化数据
   */
  private initData() {
    this.userIdList = []
    this.list.forEach((item: any) => {
      this.userIdList.push(item.userId)
      item.createdAt = parseTime(item.createdAt)
      item.amount = formatNumber(numberTwoDecimal(item.amount))
      // 包含了1$的费用
      item.batchTradeSumTotalCost = formatNumber(numberTwoDecimal(item.batchTradeSumTotalCost))
      item.batchTradeSumUseVirtualCurrency = formatNumber(numberTwoDecimal(item.batchTradeSumUseVirtualCurrency))
      if (!item.batchTradeSumUseVirtualCurrency || item.batchTradeSumUseVirtualCurrency === 0) {
        item.batchTradeSumUseVirtualCurrency = '/'
      }
    })
  }

  /**
   * 查询用户
   */
  private async findUserListbyUserId() {
    const filter = { _id: { $in: this.userIdList } }
    const res = await getUsers({ filter })
    this.userList = res.data.users

    this.list.forEach((item:any) => {
      const user = this.userList.find((s:any) => s._id === item.userId)
      if (user) {
        item.userId = user.verifiedName || user.nickname
        item.userIdBackUp = user._id
      }
    })
  }

  /**
   * 选中表格某行
   */
  private selectTableSomeRow(row: any) {
    let index = 0
    this.tradeList.forEach((item: any, i: number) => {
      if (item._id === row._id) {
        index = i
      }
    })

    const table = this.$refs.singleTable as any
    table.setCurrentRow(this.tradeList[index])
  }

  /**
   * 查询交易
   */
  private async getTradeListByBatchNo(batchNo: string) {
    if (batchNo) {
      this.tradeList = []
      this.tradeListLoading = true
      const filter = Object.assign({ batchNo: batchNo })
      const res = await getTradeList({ filter })
      this.tradeList = res.data.tradeList
      this.tradeList.forEach((item:any) => {
        item.fee = 1
        item.createdAt = parseTime(item.createdAt)
        item.discountCost = formatNumber(numberTwoDecimal(item.discountCost))
        item.qbitExchangeRate = formatNumber(numberFourDecimal(item.qbitExchangeRate))
        const expectAmount = item.batchPaymentCNYAmount || item.amount
        item.batchPaymentCNYAmount = formatNumber(numberTwoDecimal(parseFloat(expectAmount)))
        item.amount = formatNumber(numberTwoDecimal(item.amount))
        item.userName = item.user.verifiedName || item.user.nickname
        if (!item.discountCost || item.discountCost === 0) {
          item.discountCost = '/'
        }
        if (item.expectCost) {
          // 包含了1$的费用expectCost
          item.expectCost = formatNumber(numberTwoDecimal((item.expectCost - 1)))
        } else {
          // 包含了1$的费用expectCost
          item.expectCost = formatNumber(numberTwoDecimal((parseFloat(item.cost) - 1)))
        }
        item.name = item.verifiedName || item.nickname
        if (item.status === 'pending') {
          item.type = 'primary'
        } else if (item.status === 'processing') {
          item.type = 'warning'
        } else if (item.status === 'closed') {
          item.type = 'success'
          item.btnDisabled = true
        } else if (item.status === 'cancelled') {
          item.type = 'danger'
        }
        item.status = this.statusMap[item.status]
        item.cost = formatNumber(numberTwoDecimal(item.cost))
      })
      this.tradeListLoading = false
    }
  }

  /**
   * 提交表单
   */
  private submitForm() {
    this.updateFxTrade()
  }

  /**
   * 更新订单状态
   */
  private async updateFxTrade() {
    this.submitBtnDisabled = true
    if (this.form.id) {
      const data = {
        status: this.updateStatusMap[this.form.status],
        failReason: this.form.failReason
      }
      const res = await updateFxTrade(this.form.id, data)
      if (res.data.updateFxTrade) {
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        this.dialogVisible = false
        const batchNo = this.list.find((s:any) => s._id === this.selectRow._id).batchNo
        await this.getTradeListByBatchNo(batchNo)
        const row = this.tradeList.find(
          (s: any) => s._id === res.data.updateFxTrade._id
        )
        this.selectTableSomeRow(row)
      }
    }
    this.submitBtnDisabled = false
  }

  /**
   * 打开对话框
   */
  private openDialog(row: any) {
    this.dialogVisible = true
    this.form.id = row._id
    if (row.status === '待审核') {
      this.processingRadioBtnShow = true
      this.closedRadioBtnShow = false
    } else if (row.status === '处理中') {
      this.processingRadioBtnShow = false
      this.closedRadioBtnShow = true
    } else {
      this.processingRadioBtnShow = true
      this.closedRadioBtnShow = false
    }
  }

  /**
   * 表格选中行事件
   */
  private tableRowSelected(row:any) {
    this.selectRow = row
    this.getTradeListByBatchNo(row.batchNo)
  }

  /**
   * radio选择
   */
  private radioChange() {
    if (this.form.status === '交易取消') {
      this.reasonIsDisabled = false
      this.form.failReason = ''
    } else {
      this.reasonIsDisabled = true
      this.form.failReason = '无'
      this.resetForm('form')
    }
  }

  /**
   * 重置form
   */
  private resetForm(formName: string) {
    const form = this.$refs[formName] as any
    form.resetFields()
  }
}
</script>
