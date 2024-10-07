export interface ICreated {
  at: Date
  by: string
  ip: string
}

export interface IMeta {
  key: string
  value: string
}

export interface IFileAttach {
  id: string
  name: string
  url: string
  type: string
  size: number
}

enum EConfigType {
  STRING = 'string',
  INT = 'int',
  FLOAT = 'float',
  BOOLEAN = 'boolean',
  DATE = 'date'
}

export interface IResponseList {
  data: Array<any>
  status: boolean
  rowsNumber: number
  message: string
}

export interface IResponseItem {
  data: any
  status: boolean
  message: string
}

export interface IResponseFlag {
  success: Array<any>
  error: Array<any>
  status: boolean
  message: string
}

export interface IImage {
  id: string
  name: string
  size: number
  thumbnail: string
  type: string
  url: string
  download: string
}
