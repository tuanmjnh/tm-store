export interface IProductTypeOption {
  id: number
  label: string
}
export interface IProductType {
  label: string
  options: Array<IProductTypeOption>
}
export interface IProductTypeData {
  price: number
  priceImport: number
  quantity: number
}