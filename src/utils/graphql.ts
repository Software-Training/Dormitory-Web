
import request from '@/utils/request'

export const graphqlRequset = (param: any, filter: any) => {
  const postData = {
    operationName: null,
    query: param,
    variables: filter
  }

  return request({
    url: '/graphql',
    method: 'post',
    data: postData
  })
}
