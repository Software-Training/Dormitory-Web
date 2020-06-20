import request from '@/utils/request'

export const getRecords = () =>
  request({
    url: '/records/search',
    method: 'get'
  })

export const getRecordsByNumberId = (numberId: string) =>
  request({
    url: `/records/${numberId}`,
    method: 'get'
  })

  export const getRecordsByNumberIdAndDate = (numberId:string,date:Date)=>
  request({
    url: `/records/searchByNumberIdAndDate`,
    method: 'get',
    params:{
      numberId:numberId,
      date:date
    }
  })
  
  export const getRecordsByDate = (date: String) =>
  request({
    url: `/records/searchByDate/${date}`,
    method: 'get'
  })