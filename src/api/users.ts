import request from '@/utils/request'

export const getUsers = () =>
  request({
    url: '/users/search',
    method: 'get'
  })

export const getUsersById = (userAccount: string) =>
  request({
    url: `/users/${userAccount}`,
    method: 'get'
  })
export const addUsers = (data: any) =>
  request({
    url: '/users/add',
    method: 'post',
    params: data
  })

export const deleteUsers = (userId: string) =>
  request({
    url: `/users/${userId}`,
    method: 'delete'
  })

export const getUserInfo = (data: any) =>
  request({
    url: '/admin/info',
    method: 'post',
     data
  })
export const login = (data: any) =>
  request({
    url: '/admin/login',
    method: 'post',
      data
  })

export const logout = () =>
  request({
    url: '/admin/logout',
    method: 'post',
  })
