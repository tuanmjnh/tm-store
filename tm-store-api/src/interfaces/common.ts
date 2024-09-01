import { Types } from "mongoose"

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
