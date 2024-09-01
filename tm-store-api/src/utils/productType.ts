export const TypeData = class TypeData {
  price: number
  priceImport: number
  quantity: number
  constructor(price, priceImport, quantity) {
    this.price = price || 0
    this.priceImport = priceImport || 0
    this.quantity = quantity || 0
  }
}
export const findOptions = (item, types) => {
  if (item.types.length === 1 && types.codeType1) {  // Check type length = 1
    const option = item.types[0].options.find(x => x.label.toLowerCase() === types.codeType1.toLowerCase())
    if (option) return { option1: option, option2: null }
    else return null
  } else if (item.types.length === 2 && types.codeType1 && types.codeType2) { // Check type length = 2
    const option1 = item.types[0].options.find(x => x.label.toLowerCase() === types.codeType1.toLowerCase())
    const option2 = item.types[1].options.find(x => x.label.toLowerCase() === types.codeType2.toLowerCase())
    if (option1 && option2) return { option1: option1, option2: option2 }
    else return null
  } else return null
}
