<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访谈昵称">
              <el-input v-model="form.petName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="form.telephone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="目前公司">
              <el-input v-model="form.company" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位">
              <el-input v-model="form.position" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="form.sex" placeholder="请选择性别" style="width:100%">
                <el-option label="女" value="woman" />
                <el-option label="男" value="man" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他联系方式">
              <el-input v-model="form.otherContacts" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户姓名">
              <el-input v-model="form.accountName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行">
              <el-input v-model="form.accountBank" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行账号">
              <el-input v-model="form.bankAccount" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费率">
              <el-input v-model="form.rate" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="费率币种">
              <el-input v-model="form.rateCurrency" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源">
              <el-select v-model="form.source" placeholder="请选择来源" style="width:100%">
                <el-option label="开源信息" value="开源信息" />
                <el-option label="高毅咨询" value="高毅咨询" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form
          ref="dynamicValidateForm"
          :model="dynamicValidateForm"
          label-width="100px"
          class="demo-dynamic"
        >
          <el-form-item
            v-for="(experience, index) in dynamicValidateForm.experiences"
            :key="experience.key"
            label="专家背景"
            :prop="'experiences.' + index + '.textarea'"
            :rules="{
              required: true, message: '经历不能为空', trigger: 'blur'
            }"
            :label-position="labelPosition"
          >
            <el-row align="middle">
              <el-col :span="6" style="margin-right:20px;">
                <el-date-picker
                  v-model="dateInput"
                  clearable
                  type="monthrange"
                  align="center"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  style="width:100%;"
                />
              </el-col>
              <el-col :span="12" style="margin-right:20px;">
                <el-input
                  v-model="experience.textarea"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入经历简述"
                  style="width:100%;"
                />
              </el-col>
              <el-col :span="4">
                <el-button
                  class="button-new-tag"
                  size="small"
                  type="primary"
                  plain
                  icon="el-icon-edit"
                  @click="addExperiences"
                >
                  添加新经历
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <el-form-item label="专家评价">
          <el-input v-model="form.evaluate" type="textarea" :rows="2" placeholder="请输入评价" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" type="textarea" :rows="2" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="专家状态">
          <el-col :span="11">
            <el-input v-model="form.status" />
          </el-col>
          <el-col class="line" :span="2">
            -
          </el-col>
          <el-col :span="11">
            <el-input v-model="form.else" />
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { pickerOptions } from '@/utils/index'
import { IExpert } from '@/api/interface/IExpert'
@Component({
  name: 'Experts'
})
export default class extends Vue {
  private dynamicValidateForm: any = {
    experiences: [
      {
        date1: '',
        date2: '',
        textarea: ''
      }
    ]
  };
  private form: any = {
    name: '',
    petName: '',
    telephone: '',
    email: '',
    sex: '',
    otherContacts: '',
    accountName: '',
    accountBank: '',
    bankAccount: '',
    rate: '',
    rateCurrency: '',
    source: '',
    remarks: '',
    evaluate: '',
    status: '',
    else: ''
  };

  private resetForm(formName: string) {
    const form: any = this.$refs[formName]
    if (form) {
      form.resetFields()
    }
  }
  private addExperiences() {
    this.dynamicValidateForm.experiences.push({
      value: '',
      key: Date.now()
    })
  }

  /**
   * 获取专家列表
   */
  private getExpertsList() {
    const expertsList: IExpert[] = []
    for (const item of expertsList) {
      // 这里就能使用啦，就能点出属性出来啦！！！！！！！！！！！！！！！！！
      // item.name
      // 懂了嘛？curd 都是可以用这个 IExpert 约束的。
      item.name = '1212'
      item.bankOfDeposit = '1212'
    }
  }
}
</script>
