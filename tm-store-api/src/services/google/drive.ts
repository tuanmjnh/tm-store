import { join } from 'path'
// import { readFile, writeFile, rm } from 'fs/promises'
import { google } from 'googleapis'
import { authorize } from './auth-file'

// CONFIG
const CONFIG_PATH = join(process.cwd(), 'credentials', 'google', 'config.json')
export const CONFIG = { FOLDER_ROOT: "", EMAIL_ROOT: "" }

// SCOPES
export const SCOPES = [ //['https://www.googleapis.com/auth/drive.metadata.readonly']
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file'
]

// MIME_TYPE
export const MIME_TYPE = {
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

// GDRIVE Auth
// let GDRIVE
// authorize(SCOPES).then(authClient => {
//   GDRIVE = google.drive({ version: 'v3', auth: authClient })
// }).catch(e => {
//   console.log(e)
// })

//
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

export const getDriveThumbnail = async ({ fileId }) => {
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const opts = {
      fileId: fileId,
      fields: 'thumbnailLink' // owners
    }
    const res = await GDrive.files.get(opts)
    if (res.data) return res.data
    else return null
  } catch (e) { throw new Error(e) }
}
// export const setConfig = async ({ email_root, folder_root }) => {
//   try {
//     CONFIG.EMAIL_ROOT = email_root.trim().toLowerCase() || ''
//     CONFIG.FOLDER_ROOT = folder_root.trim() || ''
//     if (process.env.USE_DB == 'true') {
//       const exist = await loadConnect()
//       if (!exist) return false
//       var rs = await MConnect.updateOne({ _id: exist._id }, { $set: { config: CONFIG } })
//       return rs.matchedCount > 0 ? CONFIG : null
//     } else {
//       const payload = JSON.stringify(CONFIG)
//       await fs.writeFile(CONFIG_PATH, payload)
//       return config
//     }
//   } catch (e) { throw new Error(e) }
// }

// export const getConfig = async () => {
//   try {
//     if (process.env.USE_DB == 'true') {
//       const exist = await loadConnect()
//       if (!exist) return false
//       return exist.config
//     } else {
//       const config = await fs.readFile(CONFIG_PATH)
//       const content = JSON.parse(config)
//       CONFIG.EMAIL_ROOT = content.EMAIL_ROOT || ''
//       CONFIG.FOLDER_ROOT = content.FOLDER_ROOT || ''
//       return CONFIG
//     }
//   } catch (e) { throw new Error(e) }
// }
// getConfig()


export const getFile = async ({ fileId, fields, acknowledgeAbuse, includeLabels, includePermissionsForView, supportsAllDrives, supportsTeamDrives }) => {
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })

    // Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when alt=media.
    // acknowledgeAbuse: 'placeholder-value',
    // The ID of the file.
    // fileId: 'placeholder-value',
    // A comma-separated list of IDs of labels to include in the labelInfo part of the response.
    // includeLabels: 'placeholder-value',
    // Specifies which additional view's permissions to include in the response. Only 'published' is supported.
    // includePermissionsForView: 'placeholder-value',
    // Whether the requesting application supports both My Drives and shared drives.
    // supportsAllDrives: 'placeholder-value',
    // Deprecated use supportsAllDrives instead.
    // supportsTeamDrives: 'placeholder-value',

    const opts = {
      fileId: fileId,
      fields: fields || 'id,name,kind,mimeType,parents' // owners
    } as any
    if (acknowledgeAbuse) opts.acknowledgeAbuse = acknowledgeAbuse
    if (includeLabels) opts.includeLabels = includeLabels
    if (includePermissionsForView) opts.includePermissionsForView = includePermissionsForView
    if (supportsAllDrives) opts.supportsAllDrives = supportsAllDrives
    if (supportsTeamDrives) opts.supportsTeamDrives = supportsTeamDrives

    const res = await GDrive.files.get(opts)
    // console.log(rootFolderId)
    if (res.data) return res.data
    else return null
  } catch (e) { throw new Error(e) }
}

export const getFolder = async ({ name, parents, pageSize, fields, trashed }) => {
  try {
    if (!name) return null
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const opts = {
      pageSize: pageSize || 50,
      fields: fields || 'files(id,name,mimeType,size,parents)', // owners
      q: `mimeType='${MIME_TYPE.folder}'`,
      spaces: 'drive'
    }

    // Find folder name
    opts.q = `${opts.q} and name='${name}'`
    // Find in Parent folder or root folder
    if (parents || CONFIG.FOLDER_ROOT) opts.q = `${opts.q} and '${parents || CONFIG.FOLDER_ROOT}' in parents`
    // Find in folder is trashed
    opts.q = `${opts.q} and trashed=${trashed !== undefined ? trashed : false}`

    const res = await GDrive.files.list(opts)
    if (res.data.files && res.data.files.length) return res.data.files[0]
    else return null
  } catch (e) { throw new Error(e) }
}

export const getFolders = async ({ parents, rootFolder, folderId, pageSize, trashed }) => {
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const rs = []
    const opts = {
      pageSize: pageSize || 50,
      fields: 'files(id,name)',
      q: `mimeType='${MIME_TYPE.folder}'`,
      spaces: 'drive'
    }
    if (folderId) opts.q = `${opts.q} and '${folderId}' in parents`
    else {
      if (parents) {
        opts.q = `${opts.q} and '${parents}' in parents`
        rs.push({
          id: parents,
          name: 'Root',
          children: []
        })
      } else {
        const folderID = await getFolder({ name: rootFolder, pageSize: pageSize, trashed: trashed, fields: null, parents: null })
        if (folderID) {
          opts.q = `${opts.q} and '${folderID.id}' in parents`
          rs.push({
            id: folderID.id,
            name: 'Root',
            children: []
          })
        } else if (CONFIG.FOLDER_ROOT) {
          opts.q = `${opts.q} and '${CONFIG.FOLDER_ROOT}' in parents`
          rs.push({
            id: CONFIG.FOLDER_ROOT,
            name: 'Root',
            children: []
          })
        } else {
          rs.push({
            id: 'drive',
            name: 'Drive',
            children: []
          })
        }
      }
    }
    opts.q = `${opts.q} and trashed=${trashed !== undefined ? trashed : false}`
    const res = await GDrive.files.list(opts)
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

export const getFiles = async ({ rootFolder, folderId, mimeType, pageSize, nextPageToken, trashed, containFolder }) => {
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const rs = { files: [], nextPageToken: null }
    const opts = {
      pageSize: pageSize || 10,
      fields: 'nextPageToken, files(id,name,mimeType,size,webContentLink,thumbnailLink)',
      q: `trashed=${trashed !== undefined ? trashed : false}`,
      pageToken: nextPageToken,
      spaces: 'drive'
    }
    if (containFolder === undefined || !containFolder) opts.q = `${opts.q} and mimeType != '${MIME_TYPE.folder}'`
    if (CONFIG.FOLDER_ROOT) opts.q = `${opts.q} and '${CONFIG.FOLDER_ROOT}' in parents`
    if (folderId) opts.q = `${opts.q} and '${folderId}' in parents`
    else if (rootFolder) {
      const folderID = await getFolder({ name: rootFolder, trashed: trashed, fields: null, pageSize: null, parents: null })
      if (folderID) opts.q = `${opts.q} and '${folderID.id}' in parents`
    }
    if (mimeType) opts.q = `${opts.q} and mimeType contains '${mimeType}'`
    const res = await GDrive.files.list(opts)
    if (res.data.files && res.data.files.length) {
      rs.nextPageToken = res.data.nextPageToken
      for await (const e of res.data.files) {
        if (e.mimeType === MIME_TYPE.folder) rs.files.push({
          id: e.id,
          name: e.name,
          type: MIME_TYPE.folder
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
    return rs
  } catch (e) { throw new Error(e) }
}

export const getAll = async ({ folder, mimeType, folderId, pageSize, nextPageToken, trashed }) => {
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const opts = {
      pageSize: pageSize || 10,
      fields: 'nextPageToken,files(id,name,mimeType,size,parents,thumbnailLink)',
      // fields: 'nextPageToken,files(id,name,mimeType,size,webContentLink,webViewLink,thumbnailLink,parents,owners,permissions)',
      q: `'${CONFIG.FOLDER_ROOT}' in parents`,
      pageToken: nextPageToken,
      spaces: 'drive'
    }
    const rs = { folders: [], files: [] }
    if (folderId) opts.q = `'${folderId}' in parents`
    else {
      if (folder) {
        const fid = await getFolder({ name: folder, trashed: trashed, fields: null, pageSize: null, parents: null })
        if (fid) {
          opts.q = `'${fid.id}' in parents`
          rs.folders.push({
            id: fid.id,
            name: 'Root',
            children: []
          })
        } else {
          rs.folders.push({
            id: CONFIG.FOLDER_ROOT[0],
            name: 'Root',
            children: []
          })
        }
      } else {
        rs.folders.push({
          id: CONFIG.FOLDER_ROOT[0],
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
    const res = await GDrive.files.list(opts)
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

export const createFolder = async ({ name, parents, fields, supportsAllDrives, supportsTeamDrives, isUnique }) => {
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })

    // Check unique
    if (isUnique) {
      const exist = await getFolder({ name: name, parents: parents || CONFIG.FOLDER_ROOT, trashed: false, fields: null, pageSize: null })
      if (exist) return exist
    }

    const requestBody = {
      name: name,
      parents: parents ? [parents] : [CONFIG.FOLDER_ROOT],
      fields: fields || 'id,name,kind,mimeType,parents', // owners
    } as any
    // if (parents || CONFIG.FOLDER_ROOT) requestBody.parents = parents ? [parents] : [CONFIG.FOLDER_ROOT]
    const media = {
      mimeType: MIME_TYPE.folder,
      // body: fs.createReadStream('files/photo.jpg'),
    }
    const res = await GDrive.files.create({
      requestBody,
      media,
      // createIfUnique: isUnique !== undefined ? isUnique : false,
      supportsAllDrives: supportsAllDrives !== undefined ? supportsAllDrives : false,
      supportsTeamDrives: supportsTeamDrives !== undefined ? supportsTeamDrives : false
    })
    // const file = await GDrive.files.create({
    //   requestBody,
    //   media: media,
    // });

    return res.data
  } catch (e) { throw new Error(e) }
}

export const createFile = async ({ name, parents, mimeType, stream, fields, supportsAllDrives, supportsTeamDrives }) => {
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const requestBody = {
      name: name,
      parents: parents ? [parents] : [CONFIG.FOLDER_ROOT],
      fields: fields || 'id,name,mimeType,size,webContentLink,parents', //thumbnailLink,owners
    } as any
    const media = {
      mimeType: mimeType,
      body: stream
    }
    // if (parents || CONFIG.FOLDER_ROOT) requestBody.parents = parents ? [parents] : [CONFIG.FOLDER_ROOT]
    const res = await GDrive.files.create({
      requestBody,
      media,
      supportsAllDrives: supportsAllDrives !== undefined ? supportsAllDrives : false,
      supportsTeamDrives: supportsTeamDrives !== undefined ? supportsTeamDrives : false
    })
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

export const permissionsCreate = async ({ fileId, fields, type, role, emailAddress, pendingOwner, allowFileDiscovery, supportsAllDrives, supportsTeamDrives }) => {
  // role: owner, organizer, writer, fileOrganizer, commenter, reader
  // type: user, group, domain, anyone
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const requestBody = {
      type: type,
      role: role,
      emailAddress: emailAddress || CONFIG.EMAIL_ROOT,
      pendingOwner: pendingOwner || false
      // allowFileDiscovery: allowFileDiscovery || true // Please set your email address of Google account.
    } as any
    if (allowFileDiscovery) requestBody.allowFileDiscovery = allowFileDiscovery
    const res = await GDrive.permissions.create({
      fileId: fileId,
      fields: fields || 'id',
      requestBody,
      // transferOwnership: true,
      // moveToNewOwnersRoot: true,
      supportsAllDrives: supportsAllDrives !== undefined ? supportsAllDrives : false,
      supportsTeamDrives: supportsTeamDrives !== undefined ? supportsTeamDrives : false
    }).catch((e) => { throw new Error(e) })
    return { data: res.data, status: res.status }
    // success {data:{id:"01473170144659485212"}, status:200}
  } catch (e) { throw new Error(e) }
}

export const permissionsUpdate = async ({ fileId, permissionId, type, role, emailAddress, pendingOwner, allowFileDiscovery, supportsAllDrives, supportsTeamDrives }) => {
  // role: owner, organizer, writer, fileOrganizer, commenter, reader
  // type: user, group, domain, anyone
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const requestBody = {
      type: type,
      role: role,
      emailAddress: emailAddress || CONFIG.EMAIL_ROOT,
      pendingOwner: pendingOwner || false
      // allowFileDiscovery: allowFileDiscovery || true // Please set your email address of Google account.
    } as any
    if (allowFileDiscovery) requestBody.allowFileDiscovery = allowFileDiscovery
    const res = await GDrive.permissions.update({
      fileId: fileId,
      permissionId: permissionId,
      fields: 'id',
      requestBody,
      // transferOwnership: true,
      // moveToNewOwnersRoot: true,
      supportsAllDrives: supportsAllDrives !== undefined ? supportsAllDrives : false,
      supportsTeamDrives: supportsTeamDrives !== undefined ? supportsTeamDrives : false
    }).catch((e) => { throw new Error(e) })
    return { data: res.data, status: res.status }
  } catch (e) { throw new Error(e) }
}

export const updateTrash = async ({ fileId, fields, trashed, supportsAllDrives, supportsTeamDrives }) => {
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const res = await GDrive.files.update({
      fileId: fileId,
      fields: fields || 'id,name,mimeType,modifiedTime,trashed',
      requestBody: { trashed: trashed ? true : false },
      supportsAllDrives: supportsAllDrives !== undefined ? supportsAllDrives : false,
      supportsTeamDrives: supportsTeamDrives !== undefined ? supportsTeamDrives : false
    })//.catch((e) => { throw new Error(e) })
    return { data: res.data, status: res.status }
    // success res = {data:{id,name,mimeType,trashed,modifiedTime}, status:200}
  } catch (e) { throw new Error(e) }
}

export const deleteFile = async ({ fileId, supportsAllDrives, supportsTeamDrives }) => {
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const res = await GDrive.files.delete({
      fileId: fileId,
      supportsAllDrives: supportsAllDrives !== undefined ? supportsAllDrives : false,
      supportsTeamDrives: supportsTeamDrives !== undefined ? supportsTeamDrives : false
    })//.catch((e) => { throw new Error(e) })
    return { data: res.data, status: res.status }
    // success res = {data:"", status:204}
  } catch (e) { throw new Error(e) }
}

export const emptyTrash = async () => {
  try {
    const authClient = await authorize(SCOPES)
    const GDrive = google.drive({ version: 'v3', auth: authClient })
    const res = await GDrive.files.emptyTrash()//.catch((e) => { throw new Error(e) })
    return { data: res.data, status: res.status }
    // success res = {data:"", status:204}
  } catch (e) { throw new Error(e) }
}

// const CreateFile = async (options) => {
//   try {
//     const authClient = await authorize(SCOPES)
//     const drive = google.drive({ version: 'v3', auth: authClient })
//     const res = await drive.files.create(options)
//     return res.data
//   } catch (e) { throw new Error(e) }
// }

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
// export const listFiles = async () => {
//   try {
//     const authClient = await authorize(SCOPES)
//     const drive = google.drive({ version: 'v3', auth: authClient })
//     const res = await drive.files.list({
//       pageSize: 10,
//       fields: 'nextPageToken, files(id, name)',
//     })
//     return res.data.files
//   } catch (e) { throw new Error(e) }
// }
