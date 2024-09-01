export function generateRoutes(nodes) {
  const rs = [] as any
  try {
    nodes.forEach(_e => {
      const e = { ..._e }
      if (!e.meta.hidden) {
        if (e.children) {
          const child = generateRoutes(e.children)
          if (child.length > 0) e.children = child
        }
        // console.log(e)
        rs.push(e)
      }
    })
  } catch (e) {
    // console.log(e)
  }
  return rs
}

export async function generateRoutes2(nodes, dependent = null) {
  const rs = [] as any
  try {
    const childrens = nodes.filter(x => x.dependent !== null)
    for await (const e of nodes) {
      // nodes.forEach(async e => {
      if (e.dependent === dependent) {
        if (e.meta.length) {
          for await (const x of e.meta) {
            if (x.key === 'title') e.label = x.value// i18n.t(`route.${x.value}`)
            if (x.key === 'icon') e.icon = x.value
            if (x.key === 'hidden') e.hidden = x.value
          }
        }
        if (!e.label) e.label = e.name
        // const title = e.meta.find(x => x.key === 'title')
        // if (title) e.label = title.value ? i18n.t(`route.${title.value}`) : e.name
        // e.label = e.meta && e.meta.title ? i18n.t(`route.${e.meta.title}`) : e.name
        const child = await generateRoutes2(childrens, e._id.toString())
        if (child.length > 0) e.children = child
        rs.push(e)
      }
    }
  } catch (e) {
    // console.log(e)
  }
  return rs
}

export function generateRoutesRoles(nodes) {
  const rs = [] as any
  try {
    nodes.forEach(_e => {
      const e = { ..._e }
      if (!e.meta.constant) {
        e.label = e.meta.title
        e.icon = e.meta.icon
        if (e.children) {
          const child = generateRoutesRoles(e.children)
          if (child.length > 0) e.children = child
        }
        // console.log(e)
        rs.push(e)
      }
    })
  } catch (e) {
    // console.log(e)
  }
  return rs
}

export function generateCategory(nodes, dependent = null) {
  const rs = [] as any
  try {
    const childrens = nodes.filter(x => x.dependent !== null)
    nodes.forEach(e => {
      if (e.dependent === dependent) {
        e.label = e.meta && e.meta.label ? e.meta.label : e.title //i18n.t(`category.${e.meta.label}`)
        e.ticked = false
        const child = generateCategory(childrens, e._id)
        if (child.length > 0) e.children = child
        else e.children = []
        rs.push(e)
      }
    })
  } catch (e) {
    // console.log(e)
  }
  return rs
}

export function findNode(nodes, nodeId, nodeKey = 'id') {
  try {
    for (const e of nodes) {
      if (!nodeId) {
        if (e[nodeKey] === nodeId) return e
      } else {
        if (e[nodeKey] === nodeId) return e
      }
      if (e.children && e.children.length) {
        const child = findNode(e.children, nodeId, nodeKey)
        if (child) return child
      }
    }
  } catch (e) {
    // console.log(e)
  }
}

export function findNodes(nodes, nodeId, nodeKey = 'id') {
  let rs = [] as any
  try {
    nodes.forEach(e => {
      if (nodeId.includes(e[nodeKey])) rs.push(e)

      if (e.children && e.children.length) {
        const child = findNode(e.children, nodeId, nodeKey)
        if (child.length) rs = [...rs, ...child]
      }
    })
  } catch (e) {
    // console.log(e)
  }
  // console.log(rs)
  return rs
}

export function findNodesIfExist(nodes, nodeIds, nodeKey = 'id') {
  let rs = [] as any
  // console.log(nodeIds)
  try {
    nodes.forEach(e => {
      if (nodeIds.includes(e[nodeKey])) rs.push(e[nodeKey])

      if (e.children && e.children.length) {
        const child = findNodesIfExist(e.children, nodeIds, nodeKey)
        if (child.length) rs = [...rs, ...child]
      }
    })
  } catch (e) {
    // console.log(e)
  }
  // console.log(rs)
  return rs
}

export function getParent(nodes, node, nodeKey = 'id') {
  let rs = [] as any
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i][nodeKey] === node[nodeKey]) {
      rs.push(nodes[i])
      break;
    }
    else {
      if (nodes[i].children) {
        const child = getParent(nodes[i].children, node, nodeKey)
        if (child && child.length) {
          rs.push(nodes[i])
          rs = rs.concat(child)
        }
      }
    }
  }
  return rs
}
