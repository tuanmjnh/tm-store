/**
 * Declare class TypeData
 * @param {number} price
 * @param {number} priceImport
 * @param {number} quantity
 * @returns {Object}
 */
export class TypeData {
  price?: number
  priceImport?: number
  quantity?: number
  constructor(price?, priceImport?, quantity?) {
    this.price = price || 0
    this.priceImport = priceImport || 0
    this.quantity = quantity || 0
  }
}

export const generatorIdType = (options) => {
  const ids = options.map(x => x.id)
  return ids.max() + 1
}

export const addTypeGroup = (types = [], typeLabel = null, optionLabel = null) => {
  if (!types) types = []
  const option = { id: 1, label: optionLabel }
  types.push({ label: typeLabel, options: [option] })
  return { types, option }
}

export const addTypeOption = (options, optionLabel = null) => {
  const option = { id: generatorIdType(options), label: optionLabel }
  options.push(option)
  return { options, option }
}

export const removeTypeGroup = (types, indexGroup) => {
  types.splice(indexGroup, 1)
  if (types.length < 1) types = null
  return types
}

export const removeTypeOption = (options, optionId) => {
  const index = options.findIndex(x => x.id === optionId)
  if (index > -1) options.splice(index, 1)
  return options
}

// const onNewTypeData = (price = 0, priceImport = 0, quantity = 0) => {
// return { main: main, sub: sub || 0, price: price || 0, priceImport: priceImport || 0, quantity: quantity || 0 }
//   return { price: price, priceImport: priceImport, quantity: quantity }
// }

export const pushTypeDataOption = (types, typeData, indexGroup, option) => {
  if (!typeData) typeData = {}
  if (indexGroup === 0) {
    if (types.length === 1) {
      typeData[option.id] = new TypeData()
    } else {
      typeData[option.id] = {}
      for (let i = 0; i < types[1].options.length; i++) {
        typeData[option.id][types[1].options[i].id] = new TypeData()
      }
    }
  } else {
    // Check first push type 2
    if (types[1].options.length === 1) {
      const cloneTypeData = {}
      for (const e in typeData) {
        cloneTypeData[e] = {}
        cloneTypeData[e][option.id] = Object.keys(typeData[e]).length ? new TypeData(typeData[e].price, typeData[e].priceImport, typeData[e].quantity) : new TypeData()// Object.keys(typeData[e]).length ? { ...typeData[e] } : new TypeData()
      }
      typeData = cloneTypeData
    } else {
      for (const e in typeData) {
        typeData[e][option.id] = new TypeData()
      }
    }
  }
  return typeData
  // console.log(typeData)
}

export const removeTypeDataGroup = (types, typeData: any, indexGroup) => {
  if (!types || types.length < 1) return null
  if (indexGroup === 0) {
    return Object.values(typeData)[0]
  } else {
    const cloneTypeData = {}
    for (const e in typeData) {
      const item = Object.values(typeData[e]) as Array<any>
      cloneTypeData[e] = { ...item[0] }
    }
    return cloneTypeData
  }
}

export const removeTypeDataOption = (typeData, indexGroup, optionId) => {
  if (indexGroup === 0) {
    delete typeData[optionId]
  } else {
    for (const e in typeData) {
      delete typeData[e][optionId]
    }
  }
  return typeData
}

export const updateAllTypeData = (types, typeData, quickConfig) => {
  if (types.length < 2) {
    for (const e in typeData) {
      typeData[e].price = quickConfig.price ? quickConfig.price : typeData[e].price
      typeData[e].priceImport = quickConfig.priceImport ? quickConfig.priceImport : typeData[e].priceImport
      typeData[e].quantity = quickConfig.quantity ? quickConfig.quantity : typeData[e].quantity
    }
  } else {
    for (const e in typeData) {
      for (const p in typeData[e]) {
        typeData[e][p].price = quickConfig.price ? quickConfig.price : typeData[e][p].price
        typeData[e][p].priceImport = quickConfig.priceImport ? quickConfig.priceImport : typeData[e][p].priceImport
        typeData[e][p].quantity = quickConfig.quantity ? quickConfig.quantity : typeData[e][p].quantity
      }
    }
  }
  return typeData
}

export const generateTypes = (item) => {
  const rs = []
  if (item.types && item.types.length && item.typeData) {
    if (item.types.length === 1) {
      item.types[0].options.forEach(e => {
        rs.push({ ...{ type1: item.types[0].label, label1: e.label }, ...item.typeData[e.id] })
      })
    } else if (item.types.length === 2) {
      item.types[0].options.forEach(e => {
        item.types[1].options.forEach(ee => {
          rs.push({ ...{ type1: item.types[0].label, type2: item.types[1].label, label1: e.label, label2: ee.label }, ...item.typeData[e.id][ee.id] })
        })
      })
    }
  } else rs.push({ quantity: item.quantity, price: item.price, priceImport: item.priceImport })
  return rs
}
const defineProductObject = (item, itemType) => {
  return {
    _id: item._id || null,
    categories: item.categories || null,
    code: item.code || null,
    title: item.title || null,
    nameType1: itemType.nameType1 || null,
    codeType1: itemType.codeType1 || null,
    nameType2: itemType.nameType2 || null,
    codeType2: itemType.codeType2 || null,
    price: itemType.price || 0,
    priceImport: itemType.priceImport || 0,
    quantityStore: itemType.quantity || 0,
    unitType: item.unitType || null,
    typeId: itemType.typeId
  }
}
export const generateTypesNode = (node, negativeStorage) => {
  // console.log(node, negativeStorage)
  const rs = []
  if (node.types && node.types.length && node.typeData) {
    if (node.types && node.types.length === 1) {
      for (let e of node.types[0].options) {
        // node.types[0].options.forEach(e => {
        if (!negativeStorage && node.typeData[e.id].quantity < 1) continue
        const row = { ...{ nameType1: node.types[0].label, codeType1: e.label }, ...node.typeData[e.id] }
        // row.title = `${node.types[0].label} [${e.label}]`
        row.typeId = [e.id]
        row.title = e.label
        row.id = JSON.stringify(defineProductObject(node, row))
        rs.push(row)
      }
    } else if (node.types && node.types.length === 2) {
      for (let e of node.types[0].options) {
        // node.types[0].options.forEach(e => {
        for (let ee of node.types[1].options) {
          // node.types[1].options.forEach(ee => {
          if (!negativeStorage && node.typeData[e.id][ee.id].quantity < 1) continue
          const row = { ...{ nameType1: node.types[0].label, nameType2: node.types[1].label, codeType1: e.label, codeType2: ee.label }, ...node.typeData[e.id][ee.id] }
          // row.title = `${node.types[0].label} [${e.label}] - ${node.types[1].label} [${ee.label}]`
          row.typeId = [e.id, ee.id]
          row.title = `${e.label} - ${ee.label}`
          row.id = JSON.stringify(defineProductObject(node, row))
          rs.push(row)
        }
      }
    }
  } else {
    if (!negativeStorage && node.quantity < 1) return null
    node.quantityStore = node.quantity
    const row = JSON.parse(JSON.stringify(node))
    // row.title = 'Default',
    row.id = JSON.stringify(defineProductObject(node, row))
    rs.push(row)
  }
  return rs
}

export const generateTypesNodes = (nodes, negativeStorage) => {
  const rs = []
  if (nodes && nodes.length) {
    nodes.forEach(e => {
      e.id = e._id
      e.children = generateTypesNode(e, negativeStorage)
      // if (!e.children) e.id = JSON.stringify(e)
      if (e.children && e.children.length) rs.push(e)
    })
  }
  return rs
}

export const findType = (item, types) => {
  if (item.types.length === 1 && types.codeType1) {//&& types.nameType1
    const option = item.types[0].options.find(x => x.label.toLowerCase() === types.codeType1.toLowerCase())
    if (!option) return null
    else return [option.id]
  }
  // Check type length = 2
  if (item.types.length === 2) {
    const option1 = item.types[0].options.find(x => x.label.toLowerCase() === types.codeType1.toLowerCase())
    const option2 = item.types[1].options.find(x => x.label.toLowerCase() === types.codeType2.toLowerCase())
    if (!option1 || !option2) return null
    else return [option1.id, option2.id]
  }
}

export const onGenerateIdRow = (row) => {
  return `${row._id}-${row.nameType1}-${row.codeType1}-${row.nameType2}-${row.codeType2}`
}
