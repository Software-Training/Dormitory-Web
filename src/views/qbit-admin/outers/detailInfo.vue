<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-upload
        class="upload-demo"
        drag
        action="http://101.132.124.171:8081/upload"
        :on-success="uploadSuccess"
        multiple
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip">
          只能上传文件，且不超过500kb
        </div>
      </el-upload>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { pickerOptions } from '@/utils/index'
import { IExpert } from '@/api/interface/IExpert'
@Component({
  name: 'upload'
})
export default class extends Vue {
  private fileList: any = [];
  private total=0;
  private async uploadSuccess(res:any, file:any, fileList:any) {
    if (res) {
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    }
  }
}
</script>
