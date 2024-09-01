// const path = require('path')
// const io = require('../../utils/io')
const { google } = require('googleapis')
const KEY_FILE_PATH = `${process.env.ROOT_PATH}\\credentials\\gsa.json`//path.join(__dirname, 'credentials/gsa.json') 
// console.log(KEY_FILE_PATH)
// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file'
]//['https://www.googleapis.com/auth/drive.metadata.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = 'token.json'
const EMAIL_ROOT = 'minhtuan200990tmstore@gmail.com'
const FOLDER_ROOT = ['1DFDqKNAf2pCR_PFu3iS1gtMyGRWgf8jV']
const MIME_TYPE = {
  audio: 'application/vnd.google-apps.audio',
  docs: 'application/vnd.google-apps.document',
  '3rd_party_shortcut': 'application/vnd.google-apps.drive-sdk',
  drawing: 'application/vnd.google-apps.drawing',
  file: 'application/vnd.google-apps.file',
  folder: 'application/vnd.google-apps.folder',
  forms: 'application/vnd.google-apps.form',
  table: 'application/vnd.google-apps.fusiontable',
  Jamboard: 'application/vnd.google-apps.jam',
  map: 'application/vnd.google-apps.map',
  photo: 'application/vnd.google-apps.photo',
  slide: 'application/vnd.google-apps.presentation',
  script: 'application/vnd.google-apps.script',
  shortcut: 'application/vnd.google-apps.shortcut',
  site: 'application/vnd.google-apps.site',
  sheets: 'application/vnd.google-apps.spreadsheet',
  unknown: 'application/vnd.google-apps.unknown',
  video: 'application/vnd.google-apps.video',
  image: 'image'
}
var pageToken = null
const getViewUrl = (fileId) => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}
const getThumbnail = (fileId) => {
  // return `https://drive.google.com/thumbnail?authuser=0&id=${fileId}` //&sz=w320
  return `https://lh3.googleusercontent.com/d/${fileId}` //?authuser=0
  // return `https://lh3.google.com/u/0/d/${fileId}`
}

const onThumbnailLink = (url) => {
  const rs = url.split('=')
  return rs.length > 0 ? rs[0] : url
}
// console.log(KEY_FILE_PATH)
// Create a service account initialize with the service account key file and scope needed
const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES
})
// const getPath = (filePath) => {
//   return path.join(__dirname, filePath)
// }
const createFolder = async ({ name, rootFolderId, unique }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    if (unique) {
      const exist = await getFolder({ name: name, rootFolderId: rootFolderId || FOLDER_ROOT, trashed: false })
      if (exist) return exist
    }
    const fileMetadata = {
      name: name,
      parents: rootFolderId ? [rootFolderId] : FOLDER_ROOT,
      mimeType: MIME_TYPE.folder
    }
    // console.log(fileMetadata)
    const res = await driveService.files.create({
      resource: fileMetadata,
      fields: 'id,name,ownedByMe,owners,parents,permissionIds,permissions',
      // createIfUnique: true,
      supportsAllDrives: true,
      supportsTeamDrives: true
    })
    // Added: Transfer owner of created folder from service account to your Google account.
    // if (!res.data.id) return
    // const res2 = await driveService.permissions
    //   .create({
    //     resource: {
    //       type: 'user',
    //       role: 'writer',
    //       emailAddress: EMAIL_ROOT // Please set your email address of Google account.
    //     },
    //     fileId: res.data.id,
    //     fields: 'id',
    //     // transferOwnership: true,
    //     // moveToNewOwnersRoot: true,
    //     supportsAllDrives: true
    //   })
    //   .catch((err) => { throw new Error(err) })
    // console.log(res2)
    if (res.data) return res.data
    else return null
  } catch (e) { throw new Error(e) }
}

const createFile = async ({ name, rootFolderID, mimeType, stream }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const fileMetadata = {
      'name': name, //'icon.png',
      'parents': [rootFolderID] || FOLDER_ROOT
    }
    const media = {
      mimeType: mimeType, //'image/jpeg',
      body: stream //fs.createReadStream(getPath('../../public/uploads/5f5ca31ddfdb29bd43217e95e4dda1f8.JPG'))
    }
    const res = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,name,mimeType,size,webContentLink,ownedByMe,owners,parents,permissionIds,permissions', //thumbnailLink
      supportsAllDrives: true,
      supportsTeamDrives: true
    })
    // console.log(res.data)
    if (res.data) return {
      id: res.data.id,
      name: res.data.name,
      url: getViewUrl(res.data.id),//res.webViewLink
      type: res.data.mimeType,
      size: res.data.size,
      download: res.data.webContentLink,
      // thumbnail: onThumbnailLink(res.data.thumbnailLink)
      thumbnail: getThumbnail(res.data.id)
    }
    else return null
  } catch (e) { throw new Error(e) }
}

const getFolder = async ({ name, rootFolderId, pageSize, trashed }) => {
  try {
    // console.log(rootFolderId)
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: pageSize || 50,
      fields: 'files(id,name)',
      q: `'${rootFolderId || FOLDER_ROOT}' in parents and mimeType='${MIME_TYPE.folder}'`,
      // q: ` mimeType='${MIME_TYPE.folder}'`,
      spaces: 'drive'
    }
    if (name) opts.q = `${opts.q} and name='${name}'`
    opts.q = `${opts.q} and trashed=${trashed !== undefined ? trashed : false}`
    // console.log(opts)
    const res = await driveService.files.list(opts)
    // console.log(res.data.files)
    if (res.data.files && res.data.files.length) return res.data.files[0]
    else return null
  } catch (e) { throw new Error(e) }
}

const getFolderById = async ({ rootFolderId, pageSize }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: pageSize || 50,
      fields: 'files(id,name)',
      q: `'${rootFolderId || FOLDER_ROOT}' in parents and mimeType='${MIME_TYPE.folder}'`,
      // q: `mimeType='${MIME_TYPE.folder}'`,
      spaces: 'drive'
    }
    // console.log(opts)
    const res = await driveService.files.list(opts)
    // console.log(rootFolderId)
    if (res.data.files && res.data.files.length) return res.data.files//[0]
    else return null
  } catch (e) { throw new Error(e) }
}

// getFolderById({ rootFolderId: null }).then(x => {
//   console.log(x)
// })
const getFolders = async ({ rootFolder, rootFolderId, folderId, pageSize, trashed }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const rs = []
    const opts = {
      pageSize: pageSize || 50,
      fields: 'files(id,name)',
      q: `mimeType='${MIME_TYPE.folder}'`,
      spaces: 'drive'
    }
    if (folderId) opts.q = `${opts.q} and '${folderId}' in parents`
    else {
      if (rootFolderId) {
        opts.q = `${opts.q} and '${rootFolderId}' in parents`
        rs.push({
          id: rootFolderId,
          name: 'Root',
          children: []
        })
      } else {
        const folderID = await getFolder({ name: rootFolder, pageSize: pageSize, trashed: trashed })
        if (folderID) {
          opts.q = `${opts.q} and '${folderID.id}' in parents`
          rs.push({
            id: folderID.id,
            name: 'Root',
            children: []
          })
        } else {
          opts.q = `${opts.q} and '${FOLDER_ROOT[0]}' in parents`
          rs.push({
            id: FOLDER_ROOT[0],
            name: 'Root',
            children: []
          })
        }
      }
    }
    // console.log(opts)
    opts.q = `${opts.q} and trashed=${trashed !== undefined ? trashed : false}`
    const res = await driveService.files.list(opts)
    if (res.data.files && res.data.files.length) {
      for await (const e of res.data.files) {
        if (rs.length && rs[0].children) rs[0].children.push({
          id: e.id,
          name: e.name
        })
        else rs.push({
          id: e.id,
          name: e.name
        })
      }
    }
    return rs
  } catch (e) { throw new Error(e) }
}

const getFiles = async ({ rootFolder, folderId, mimeType, pageSize, nextPageToken, trashed }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: pageSize || 10,
      fields: 'nextPageToken, files(id,name,mimeType,size,webContentLink,thumbnailLink)',
      q: `'${FOLDER_ROOT}' in parents`,
      pageToken: nextPageToken,
      spaces: 'drive'
    }
    const rs = { files: [], nextPageToken: null }
    if (folderId) opts.q = `'${folderId}' in parents`
    else if (rootFolder) {
      const folderID = await getFolder({ name: rootFolder, trashed })
      if (folderID) opts.q = `'${folderID.id}' in parents`
    }
    if (mimeType) opts.q = `${opts.q} and mimeType contains '${mimeType}'`
    opts.q = `${opts.q} and trashed=${trashed !== undefined ? trashed : false}`
    const res = await driveService.files.list(opts)
    if (res.data.files && res.data.files.length) {
      rs.nextPageToken = res.data.nextPageToken
      for await (const e of res.data.files) {
        if (e.mimeType === MIME_TYPE.folder) rs.files.push({
          id: e.id,
          name: e.name,
          type: 'folder'
        })
        else rs.files.push({
          id: e.id,
          name: e.name,
          type: e.mimeType,
          size: e.size,
          url: getViewUrl(e.id),
          // thumbnail: e.thumbnailLink ? onThumbnailLink(e.thumbnailLink) : null,
          thumbnail: e.thumbnailLink ? getThumbnail(e.id) : null,
          download: e.webContentLink
        })
      }
    }
    // console.log(rs)
    return rs
  } catch (e) { throw new Error(e) }
}

const getAll = async ({ folder, mimeType, folderId, pageSize, trashed }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      pageSize: pageSize || 10,
      fields: 'nextPageToken,files(id,name,mimeType,size,parents,thumbnailLink)',
      // fields: 'nextPageToken,files(id,name,mimeType,size,webContentLink,webViewLink,thumbnailLink,parents,owners,permissions)',
      q: `'${FOLDER_ROOT}' in parents`,
      pageToken: pageToken,
      spaces: 'drive'
    }
    const rs = { folders: [], files: [] }
    if (folderId) opts.q = `'${folderId}' in parents`
    else {
      if (folder) {
        const fid = await getFolder({ name: folder, trashed: trashed })
        if (fid) {
          opts.q = `'${fid.id}' in parents`
          rs.folders.push({
            id: fid.id,
            name: 'Root',
            children: []
          })
        } else {
          rs.folders.push({
            id: FOLDER_ROOT[0],
            name: 'Root',
            children: []
          })
        }
      } else {
        rs.folders.push({
          id: FOLDER_ROOT[0],
          name: 'Root',
          children: []
        })
      }
    }
    // if (mimeType) opts.q = `${opts.q} and mimeType contains '${mimeType}'`
    // console.log(opts.q)
    // const resFolders = await getFolders({ rootFolderID: folderId })
    // console.log(resFolders)
    opts.q = `${opts.q} and trashed=${trashed !== undefined ? trashed : false}`
    const res = await driveService.files.list(opts)
    // console.log(res)
    if (res.data.files && res.data.files.length) {
      for await (const e of res.data.files) {
        // console.log(e.name)
        if (e.mimeType === MIME_TYPE.folder) {
          if (rs.folders.length && rs.folders[0].children) rs.folders[0].children.push({
            id: e.id,
            name: e.name,
            parents: e.parents
          })
          else rs.folders.push({
            id: e.id,
            name: e.name,
            parents: e.parents
          })
        } else {
          if (mimeType) {
            const reg = new RegExp(mimeType)
            if (reg.test(e.mimeType)) rs.files.push({
              id: e.id,
              name: e.name,
              type: e.mimeType,
              size: e.size,
              url: getViewUrl(e.id),
              // url: e.webViewLink,
              // thumbnail: onThumbnailLink(e.thumbnailLink),
              thumbnail: e.thumbnailLink ? getThumbnail(e.id) : null,
              download: e.webContentLink
            })
          } else {
            rs.files.push({
              id: e.id,
              name: e.name,
              type: e.mimeType,
              size: e.size,
              url: getViewUrl(e.id),
              // url: e.webViewLink,
              // thumbnail: onThumbnailLink(e.thumbnailLink),
              thumbnail: e.thumbnailLink ? getThumbnail(e.id) : null,
              download: e.webContentLink
            })
          }
        }
      }
    }
    // console.log(rs)
    return rs
  } catch (e) { throw new Error(e) }
}

const permissionsCreate = async (opts) => {
  // role: owner, organizer, writer, fileOrganizer, commenter, reader
  // type: user, group, domain, anyone
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const resource = {
      type: opts.type,
      role: opts.role,
      emailAddress: opts.emailAddress || EMAIL_ROOT,
      pendingOwner: opts.pendingOwner || false
      // allowFileDiscovery: allowFileDiscovery || true // Please set your email address of Google account.
    }
    if (opts.allowFileDiscovery) resource.allowFileDiscovery = opts.allowFileDiscovery
    const res = await driveService.permissions.create({
      fileId: opts.fileId,
      fields: 'id',
      resource: resource,
      // transferOwnership: true,
      // moveToNewOwnersRoot: true,
      supportsAllDrives: true,
      supportsTeamDrives: true
    }).catch((e) => { throw new Error(e) })
    return { data: res.data, status: res.status }
    // success {data:{id:"01473170144659485212"}, status:200}
  } catch (e) { throw new Error(e) }
}

const permissionsUpdate = async (opts) => {
  // role: owner, organizer, writer, fileOrganizer, commenter, reader
  // type: user, group, domain, anyone
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const resource = {
      // type: opts.type,
      role: opts.role,
      // emailAddress: opts.emailAddress || EMAIL_ROOT,
      pendingOwner: opts.pendingOwner || false
      // allowFileDiscovery: allowFileDiscovery || true // Please set your email address of Google account.
    }
    if (opts.allowFileDiscovery) resource.allowFileDiscovery = opts.allowFileDiscovery
    const res = await driveService.permissions.update({
      fileId: opts.fileId,
      permissionId: opts.permissionId,
      fields: 'id',
      resource: resource,
      transferOwnership: true,
      moveToNewOwnersRoot: true,
      supportsAllDrives: true,
      supportsTeamDrives: true
    }).catch((e) => { throw new Error(e) })
    return { data: res.data, status: res.status }
  } catch (e) { throw new Error(e) }
}

const updateTrash = async ({ fileId, trashed, fields, supportsAllDrives, supportsTeamDrives }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const res = await driveService.files.update({
      fileId: fileId,
      fields: fields || 'id,name,mimeType,modifiedTime,trashed',
      resource: { trashed: trashed ? true : false },
      supportsAllDrives: supportsAllDrives || true,
      supportsTeamDrives: supportsTeamDrives || true
    })//.catch((e) => { throw new Error(e) })
    return { data: res.data, status: res.status }
    // success res = {data:{id,name,mimeType,trashed,modifiedTime}, status:200}
  } catch (e) { throw new Error(e) }
}

const deleteFile = async ({ fileId, supportsAllDrives, supportsTeamDrives }) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const opts = {
      fileId: fileId,
      supportsAllDrives: supportsAllDrives || true,
      supportsTeamDrives: supportsTeamDrives || true
    }
    const res = await driveService.files.delete(opts)//.catch((e) => { throw new Error(e) })
    return { data: res.data, status: res.status }
    // success res = {data:"", status:204}
  } catch (e) { throw new Error(e) }
}

const emptyTrash = async () => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    const res = await driveService.files.emptyTrash({})//.catch((e) => { throw new Error(e) })
    return { data: res.data, status: res.status }
    // success res = {data:"", status:204}
  } catch (e) { throw new Error(e) }
}

const test = async (data) => {
  try {
    const driveService = google.drive({ version: 'v3', auth })
    // Get All
    // const opts = {
    //   pageSize: 100,
    //   // fields: 'nextPageToken,files(id,name,mimeType,size,webContentLink,webViewLink,thumbnailLink,parents,owners,permissions)',
    //   fields: 'nextPageToken,files(id,owners)',
    //   // q: `'0ABi8rUd5P5ekUk9PVA' in parents`,
    //   pageToken: pageToken,
    //   supportsAllDrives: true
    //   // spaces: 'drive'
    // }
    // const res = await driveService.files.list(opts)
    // console.log(res)

    // Create Permissions
    // let res = null
    // for await (const e of folderAC) {
    //   res = await driveService.permissions.create({
    //     resource: {
    //       type: 'user',
    //       role: 'writer',
    //       emailAddress: EMAIL_ROOT,
    //       // displayName: "tuanmjnh tmstore",
    //       pendingOwner: false,
    //       // allowFileDiscovery: true // Please set your email address of Google account.
    //     },
    //     fileId: e.id,
    //     fields: 'id',
    //     // transferOwnership: true,
    //     // moveToNewOwnersRoot: true,
    //     supportsAllDrives: true,
    //     supportsTeamDrives: true
    //   }).catch((e) => { throw new Error(e) })
    // }

    // Delete
    // let res = null
    // for await (const e of folderAC) {
    //   const opts = {
    //     fileId: e.id,
    //     supportsAllDrives: true,
    //     supportsTeamDrives: true
    //   }
    //   res = await driveService.files.delete(opts).catch((e) => { throw new Error(e) })
    // }
    // console.log(res)

    // Empty Trash
    // const opts = {
    //   fileId: '1sRdm4C6ka5oHiRRxN8OQSS4rR0Jz7daB',
    //   supportsAllDrives: true,
    //   supportsTeamDrives: true
    // }
    // const res = await driveService.files.emptyTrash().catch((e) => { throw new Error(e) })
    // console.log(res)
    return { data: res.data, status: res.status }
  } catch (e) { throw new Error(e) }
}

module.exports = {
  MIME_TYPE, FOLDER_ROOT, EMAIL_ROOT,
  createFolder, createFile, getFolder, getFolderById, getFolders, getFiles, getAll,
  permissionsCreate, permissionsUpdate, updateTrash, deleteFile, emptyTrash,
  test
}
// getFiles()