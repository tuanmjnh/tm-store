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

export enum EConfigType {
  STRING = 'string',
  INT = 'int',
  FLOAT = 'float',
  BOOLEAN = 'boolean',
  DATE = 'date'
}

export interface IResponseList {
  data: Array<T>
  status: boolean
  rowsNumber: number
  message: string
}

export interface IResponseItem {
  data: T
  status: boolean
  message: string
}

export interface IResponseFlag {
  success: Array<T>
  error: Array<T>
  status: boolean
  message: string
}