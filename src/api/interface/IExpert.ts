/**
   * 专家字段
   */
export interface IExpert {

  /**
   * id
   */
  id: string

  /**
   * 名称
   */
  name: string

  /**
   * 手机
   */
  phone: string

  /**
   * 证件号码
   */
  idNumber: string

  /**
   * 邮箱
   */
  email: string

  /**
   * 性别
   */
  sex: string

  /**
   * 状态（未联系/已沟通/无效/有意向/不感兴趣）
   */
  status: string

  /**
   * 背景
   */
  background: string

  /**
   * 评价
   */
  comment: string

  /**
   * 工作经历
   */
  workExperience: string

  /**
   * 来源
   */
  source: string

  /**
   * 访谈名称
   */
  interviewNickname: string

  /**
   * 目前公司
   */
  currentCompany: string

  /**
   * 职位
   */
  position: string

  /**
   * 其他联系方式
   */
  otherContactInformation: string

  /**
   * 开户名称
   */

  accountName: string

  /**
   * 开户银行
   */

  bankOfDeposit: string

  /**
   * 银行账户
   */
  bankAccount: string

  /**
   * 费率
   */
  rate: number

  /**
   * 费率币种
   */
  rateCurrency: string

}
