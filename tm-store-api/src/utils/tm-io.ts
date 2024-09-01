const fs = require('fs'),
  path = require('path')
// console.log(process.env.PUBLIC_PATH)
// const public_path = `${process.env.ROOT_PATH}\\public`// `${__dirname}\\..\\public\\`
// const public_path = path.join(__dirname, `..\\${process.env.PUBLIC_DIR}`)
// export const public_path = public_path
// const upload_path = `${process.env.PUBLIC_PATH}\\${process.env.UPLOAD_DIR}`
const upload_path = process.env.UPLOAD_DIR
// export const upload_path = upload_path
// console.log(public_path)
export const createDir = async function (opts) {
  try {
    const list_dir = opts.dir.replace(/^\/|\/$/g, '').split('/')
    const result = {
      path: upload_path,
      list: []
    }
    // create public if not exist
    if (!fs.existsSync(result.path)) await fs.mkdirSync(result.path)
    // loop list path to create
    for await (const e of list_dir) {
      result.path = `${result.path}/${e}/`
      if (!fs.existsSync(result.path)) {
        await fs.mkdirSync(result.path)
        result.list.push(e)
      }
    }
    return result
  } catch (e) { throw new Error(e) }
}

export const rename = async (oldPath, newPath) => {
  try {
    // if (!fs.existsSync(oldPath)) {
    await fs.renameSync(oldPath, newPath)
    return true
    // }
    // return false
  } catch (e) { throw new Error(e) }
}

export const getExtention = function (path, dot = true) {
  try {
    if (!path) return null
    path = path.toLowerCase()
    const regx = /(?:\.([^.]+))?$/
    path = regx.exec(path)
    const rs = path ? (dot ? path[0] : path[1]) : null
    return rs ? rs : null
  } catch (e) { throw new Error(e) }
}

export const getFolder = ({ dir, root, host }) => {
  try {
    let result = []
    root = root || process.env.PUBLIC_DIR
    const _dir = path.join(root, dir)
    const dirs = fs.readdirSync(_dir)
    // for (const i in dirs) {
    for (let i = 0; i < dirs.length; i++) {
      const stat = fs.statSync(path.join(_dir, dirs[i]))
      const isDirectory = stat.isDirectory()
      const item = {
        id: stat.ino,
        name: dir[i],
        fullName: isDirectory ? `${dir}/${dirs[i]}` : `${host}/${dir}/${dirs[i]}`,
        size: stat.size,
        ext: path.extname(dir[i]),
        icon: stat.isDirectory() ? 'folder' : 'file'
      }
      result.push(item)
    }
    return result
  } catch (e) { throw new Error(e) }
}

export const getAllFolder = ({ dir, parent, root, host }) => {
  try {
    let result = []
    root = root || process.env.PUBLIC_DIR
    const _dir = path.join(root, dir)
    const dirs = fs.readdirSync(_dir)
    // for (const i in dirs) {
    for (let i = 0; i < dirs.length; i++) {
      const stat = fs.statSync(path.join(_dir, dirs[i]))
      const isDirectory = stat.isDirectory()
      const item = {
        id: stat.ino,
        name: dir[i],
        fullName: isDirectory ? `${dir}/${dirs[i]}` : `${host}/${dir}/${dirs[i]}`,
        path: parent ? parent : dir,
        fullPath: dir,
        size: stat.size,
        ext: path.extname(dir[i]),
        icon: isDirectory ? 'folder' : 'file'
      }
      if (isDirectory) {
        const items = getAllFolder({ dir: item.fullName, parent: item.name, host: host } as any)
        if (items && items.length) result = [...result, ...items]
      }
      result.push(item)
    }
    return result
  } catch (e) { throw new Error(e) }
}

export const getDirectories = ({ dir, root }) => {
  try {
    const result = []
    root = root || process.env.PUBLIC_DIR
    const _dir = path.join(root, dir)
    const dirs = fs.readdirSync(_dir)
    // for (const i in dirs) {
    for (let i = 0; i < dirs.length; i++) {
      const stat = fs.statSync(path.join(_dir, dirs[i]))
      const item = {
        id: stat.ino,
        name: dirs[i],
        fullName: `${dir}/${dirs[i]}`,
        fullPath: dir,
        icon: 'folder'
      }
      if (stat.isDirectory()) result.push(item)
    }
    return result
  } catch (e) { throw new Error(e) }
}

export const getAllDirectories = ({ dir, parent, root }) => {
  try {
    const result = []
    root = root || process.env.PUBLIC_DIR
    // root = root || `./${process.env.PUBLIC_PATH}`
    const _dir = path.join(root, dir)
    const dirs = fs.readdirSync(_dir)
    // for (const i in dirs) {
    for (let i = 0; i < dirs.length; i++) {
      // const _path = `${_dir}\\${dirs[i]}`
      const stat = fs.statSync(path.join(_dir, dirs[i]))
      const item = {
        id: stat.ino,
        name: dirs[i],
        fullName: `${dir}/${dirs[i]}`,
        path: parent ? parent : dir,
        fullPath: dir,
        icon: 'folder',
        isDirectory: stat.isDirectory(),
        children: []
      }
      if (item.isDirectory) {
        item.children = getAllDirectories({ dir: item.fullName, parent: item.name } as any)
        result.push(item)
      }
    }
    return result
  } catch (e) { throw new Error(e) }
}

export const getFiles = ({ dir, root, host }) => {
  try {
    const result = []
    root = root || process.env.PUBLIC_DIR
    const _dir = path.join(root, dir)
    const dirs = fs.readdirSync(_dir)
    // for (const i in dirs) {
    for (let i = 0; i < dirs.length; i++) {
      const stat = fs.statSync(path.join(_dir, dirs[i]))
      const item = {
        id: stat.ino,
        name: dirs[i],
        fullName: `${host}/${dir}/${dirs[i]}`,
        size: stat.size,
        ext: path.extname(dirs[i]),
        icon: 'file'
      }
      if (stat.isFile()) result.push(item)
    }
    return result
  } catch (e) { throw new Error(e) }
}

export const getAllFiles = ({ dir, root, parent, host }) => {
  try {
    let result = []
    root = root || process.env.PUBLIC_DIR
    const _dir = path.join(root, dir)
    const dirs = fs.readdirSync(_dir)
    // for (const i in dirs) {
    for (let i = 0; i < dirs.length; i++) {
      const stat = fs.statSync(path.join(_dir, dirs[i]))
      const item = {
        id: stat.ino,
        name: dirs[i],
        fullName: `${host}/${dir}/${dirs[i]}`,
        path: parent ? parent : dir,
        fullPath: dir,
        size: stat.size,
        ext: path.extname(dirs[i]),
        icon: 'file'
      }
      if (stat.isDirectory()) {
        const items = getAllFiles({ dir: item.fullName, parent: item.name, host: host } as any)
        if (items && items.length) result = [...result, ...items]
      }
      if (stat.isFile()) result.push(item)
    }
    return result
  } catch (e) { throw new Error(e) }
}
