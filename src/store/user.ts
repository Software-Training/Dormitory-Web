import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken, setAdminAccount, setPwd, removeAdminAccount, removePwd, getAdminAccount, getPwd } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'
export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  adminAccount: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public phone = ''
  public userId = ''
  public roles: string[] = []
  public adminAccount = getAdminAccount() || ''
  public pwd = getPwd() || ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_USERID(id: string) {
    this.userId = id
  }

  @Mutation
  private SET_EMAIL(adminAccount: string) {
    this.adminAccount = adminAccount
  }

  @Mutation
  private SET_PHONE(phone: string) {
    this.phone = phone
  }

  @Mutation
  private SET_PWD(pwd: string) {
    this.pwd = pwd
  }

  @Action
  public async Login(userInfo: { adminAccount: string, password: string}) {
    let { adminAccount, password } = userInfo
    adminAccount = adminAccount.trim()
    const { data } = await login({ adminAccount, password })
    setToken(data.JWT)
    this.SET_TOKEN(data.JWT)
  }

  @Action
  public ResetToken() {
    removeToken()
    removeAdminAccount()
    removePwd()
    this.SET_TOKEN('')
    this.SET_USERID('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    // 偷个懒，不想改接口了
    const { data } = await getUserInfo({ adminAccount: this.adminAccount, password: this.pwd })
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    // roles must be a non-empty array
    if (!data.user.roles) {
      throw Error('GetUserInfo: roles is null!')
    }
    let roles = []
    roles.push(data.user.roles)
    this.SET_ROLES(data.user.roles)
    this.SET_USERID(data.user.id)
    this.SET_AVATAR('https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
    this.SET_PWD('')
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout()
    removeToken()
    resetRouter()

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
