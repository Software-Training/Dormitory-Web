import request from '@/utils/request'

export const getUserinfo = () =>
  request({
    url: '/userinfo/search',
    method: 'get'
  })

export const getUserinfoBynumberId = (numberId: string) =>
  request({
    url: `/userinfo/${numberId}`,
    method: 'get'
  })
