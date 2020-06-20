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
          label="记录编号"
          width="205px"
          prop="_id"
        />
        <el-table-column
          align="center"
          label="姓名"
          prop="name"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
            >
              <p>{{ scope.row.name }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <router-link
                  :to="{name: 'Merchant', params: {userId: scope.row.userId}}"
                >
                  <el-link
                    type="primary"
                  >
                    <span>{{ scope.row.name }}</span>
                  </el-link>
                </router-link>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="证件号码"
          prop="documentNum"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
            >
              <p>{{ scope.row.documentNum }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <span>{{ scope.row.documentNum }}</span>
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
          label="法人名称"
          prop="legalPersonName"
        />
        <el-table-column
          align="center"
          label="经营类别"
          show-overflow-tooltip
          prop="businessClassification"
        />
        <el-table-column
          align="center"
          label="订单状态"
        >
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              :type="scope.row.typeStyle"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="证件有效期"
          width="185px"
          prop="documentExpiryDate"
        />
        <el-table-column
          align="center"
          label="创建时间"
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
              size="small"
              plain
              :type="scope.row.typeStyle"
              @click="imageBtnClick(scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-if="scope.row.checkBtnIsShow"
              size="small"
              plain
              :type="scope.row.typeStyle"
              @click="openDialog(scope.row)"
            >
              审核
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
      <!-- 弹窗 -->
      <el-dialog
        title="KYC审核"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-form
          ref="form"
          :model="form"
          label-width="130px"
        >
          <el-form-item
            label="用户："
          >
            <el-input
              v-model="form.name"
              readonly
            />
          </el-form-item>
          <el-form-item
            label="国家："
          >
            <el-input
              v-model="form.country"
              readonly
            />
          </el-form-item>
          <el-form-item
            label="证件号码："
          >
            <el-input
              v-model="form.documentNum"
              readonly
            />
          </el-form-item>
          <el-form-item
            label="用户类型："
          >
            <el-input
              v-model="form.accountType"
              readonly
            />
          </el-form-item>
          <el-form-item
            label="法人名称："
          >
            <el-input
              v-model="form.legalPersonName"
              readonly
            />
          </el-form-item>
          <el-form-item
            label="法人证件类型："
          >
            <el-input
              v-model="form.legalPersonDocumentType"
              readonly
            />
          </el-form-item>
          <el-form-item
            label="法人证件号码："
          >
            <el-input
              v-model="form.legalPersonDocumentNum"
              readonly
            />
          </el-form-item>
          <el-form-item
            label="经营类别："
          >
            <el-input
              v-model="form.businessClassification"
              readonly
            />
          </el-form-item>
          <el-form-item
            label="证件有效期："
          >
            <el-input
              v-model="form.documentExpiryDate"
              readonly
            />
          </el-form-item>
          <el-form-item
            label="是否通过："
            prop="radioStatus"
          >
            <el-radio-group v-model="form.radioStatus">
              <el-radio
                label="不通过"
                @change="radioChange"
              />
              <el-radio
                label="通过"
                @change="radioChange"
              />
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="原因："
            prop="failReason"
          >
            <el-input
              v-model="failReason"
              :disabled="reasonIsDisabled"
              type="textarea"
              rows="4"
            />
          </el-form-item>
          <el-form-item style="width: 100%;margin: 0,auto;text-align: center;">
            <el-button @click="dialogVisible = false">
              取 消
            </el-button>
            <el-button
              :disabled="submitBtnDisabled"
              type="primary"
              @click="submitForm('form')"
            >
              确 定
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 弹窗 -->
      <el-dialog
        title="实名制照片详情"
        :visible.sync="imageShow"
        width="35%"
      >
        <div class="demo-image__placeholder">
          <div
            v-for="url in srcList"
            :key="url"
            style="margin-top:10px;text-align: center;"
          >
            <el-image
              :src="url"
              lazy
              :preview-src-list="srcList"
            />
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import Pagination from '@/components/Pagination/index.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getKycInfos, updateKycInfosStatus } from '@/api/qbit'
import { formatNumber, deleteNullProperty, parseTime, pickerOptions } from '@/utils/index'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'KycInfos',
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
  private imageShow: any = false;
  private url:string ='';
  private srcList:string[] = [];
  private reasonIsDisabled: boolean = false
  private dialogVisible: any = false;
  private failReason: string = '';
  private submitBtnDisabled = false;
  private dateInput: any = [];
  private pickerOptions = pickerOptions
  private listQuery = {
    page: 1,
    limit: 10
  };
  private form: any = {
    name: '',
    country: '',
    documentNum: '',
    accountType: '',
    radioStatus: '',
    legalPersonName: '',
    legalPersonDocumentType: '',
    legalPersonDocumentNum: '/',
    businessClassification: '/',
    documentExpiryDate: ''
  };
  private accountType: any = {
    individual_mainland: '大陆个人',
    corp_mainland: '企业/组织',
    corp_hk: '香港企业/组织',
    individual_hk: '香港个人'
  };
  private businessType: any = {
    platform_seller: '电商平台卖家',
    direct_seller: '电商平台/独立站',
    goods_trade: '一般货物贸易',
    logistics: '物流行业',
    ads: '广告市场推广',
    others: '其他'
  };
  private statusMap:any = {
    pending: '待审核',
    success: '成功',
    fail: '失败' }

  created() {
    this.getKycInfos()
  }

  /**
   * 获取预约商户
   */
  private async getKycInfos(filterData: any = null) {
    this.listLoading = true

    const filter = Object.assign(
      { },
      filterData
    )
    const page = { num: this.listQuery.page, size: this.listQuery.limit }
    const res = await getKycInfos({ filter, page })
    this.list = res.data.kycInfos
    this.total = res.data.kycInfosCount
    this.initData()

    this.listLoading = false
  }

  /**
   * 点击查询按钮
   */
  private searchBtcClickAction() {
    let filterData = { _id: this.idInput, nickname: this.nameInput }
    if (this.dateInput && this.dateInput.length > 0) {
      const filter = { createdAt: { $gte: this.dateInput[0].getTime(), $lte: this.dateInput[1].getTime() } }
      filterData = Object.assign(filterData, filter)
    }
    deleteNullProperty(filterData)
    this.getKycInfos(filterData)
  }

  /**
   * 详情按钮点击
   */
  private imageBtnClick(row:any) {
    this.srcList = []
    this.imageShow = true
    if (row.photos) {
      for (var key in row.photos) {
        this.srcList.push(row.photos[key])
      }
    } else {
      this.url = require('@/assets/404-images/notUpload.png')
    }
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
    await this.getKycInfos(filter)
  }

  /**
   * 更新kyc状态
   */
  private async updateKycInfosStatus() {
    this.submitBtnDisabled = true
    const status = this.form.radioStatus === '通过' ? 'success' : 'fail'
    const res = await updateKycInfosStatus(this.form._id, this.form.userId, status, this.failReason)
    if (res.data.kycInfo) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.dialogVisible = false
      await this.getKycInfos()
      const row = this.list.find((s: any) => s._id === this.form._id)
      this.selectTableSomeRow(row)
    }
    this.submitBtnDisabled = false
  }

  /**
   * 初始化数据
   */
  private initData() {
    this.userIdList = []
    this.list.forEach((item: any) => {
      item.checkBtnIsShow = true
      item.createdAt = parseTime(item.createdAt)
      if (item.status === 'pending') {
        item.typeStyle = 'primary'
      } else if (item.status === 'processing') {
        item.typeStyle = 'warning'
      } else if (item.status === 'success') {
        item.typeStyle = 'success'
        item.checkBtnIsShow = false
      } else if (item.status === 'fail') {
        item.typeStyle = 'danger'
      }
      if (item.kycInfo) {
        item.businessClassification = item.kycInfo ? item.kycInfo.businessClassification : '/'
      }
      if (!item.legalPersonName) {
        item.legalPersonName = '/'
      }
      if (!item.documentExpiryDate) {
        item.documentExpiryDate = '/'
      }
      if (!item.country) {
        item.country = '中国'
      }
      if (!item.legalPersonDocumentNum) {
        item.legalPersonDocumentNum = '/'
      }
      if (!item.legalPersonDocumentType) {
        item.legalPersonDocumentType = '/'
      }
      item.accountType = this.accountType[item.accountType]
      item.status = this.statusMap[item.status]
    })
  }

  /**
   * 状态选择
   */
  private radioChange() {
    if (this.form.radioStatus === '通过') {
      this.reasonIsDisabled = true
      this.failReason = '/'
    } else if (this.form.radioStatus === '不通过') {
      this.reasonIsDisabled = false
      this.failReason = ''
    }
  }

  /**
   * 提交表单
   */
  private submitForm(formName: string) {
    if (!this.form.radioStatus) {
      this.$message.error('请先选择是否通过！')
      return
    }
    if (this.form.radioStatus === '不通过' && !this.failReason) {
      this.$message.error('请填写失败原因！')
      return
    }
    const form: any = this.$refs[formName]
    form.validate((valid: any) => {
      if (valid) {
        this.updateKycInfosStatus()
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
   * 对话框
   */
  private openDialog(row: any) {
    this.resetForm()
    this.form = row
    this.dialogVisible = true
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
}
</script>
