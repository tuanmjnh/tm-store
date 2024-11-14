import delay from 'delay'
import { API_KEY, CLIENT_ID } from './gapi-client'
import { get } from '@/utils/localStorage'

export interface IGoogleFile extends gapi.client.drive.File {
  children?: Array<IGoogleFile>
}

interface IAgrument {
  trashed?: boolean
  fields?: string
  name?: string
  parents?: string
  pageSize?: number
  folderId?: string
  rootFolder?: string
  nextPageToken?: string
  folderName?: string
  mimeType?: string
  isFolder?: boolean
}

export class GoogleDrive {
  constructor() {
    this.initialize()
  }
  public googleConnect = get('connectsStore.google')
  public DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
  public SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.metadata.readonly']
  public DEFAULTS = {
    PAGE_SIZE: 20,
    FOLDER_ROOT: 'root',
    FIELDS_FOLDER: 'id,name,mimeType,parents',//'id,title,mimeType,userPermission,editable,copyable,shared,fileSize,owners'
    FIELDS_FILE: 'id,name,mimeType,size,parents,imageMediaMetadata,webViewLink,webContentLink,thumbnailLink'
  }
  private initialize() {
    return (async () => {
      window.gapi.load('client', {
        callback: async (e) => {
          await window.gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: this.SCOPES.join(' '),
            discoveryDocs: [this.DISCOVERY_DOC]
          }).then(() => {
            if (this.googleConnect && this.googleConnect.access_token)
              window.gapi.client.setToken({ access_token: this.googleConnect.access_token })
          })
          // console.log(this.googleConnect)
        }
      })
      return this
    })()
  }
  public MIME_TYPE = {
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
  private checkClient = async () => {
    return new Promise(async (resolve, reject) => {
      const timeout = { min: 0, max: 6000 }
      while ((!window.gapi.client || !window.gapi.client.drive) && timeout.min < timeout.max) {
        await delay(100)
        timeout.min += 10
      }
      await delay(1000)
      if (window.gapi.client && window.gapi.client.drive) resolve(true)
      else reject('timeout')
    })
  }
  public getFolder = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.checkClient()
      if (!isReady) throw new Error('Error Client')
      const opts = {
        spaces: 'drive',
        supportsAllDrives: true,
        supportsTeamDrives: true,
        q: `trashed=${args.trashed} and mimeType='${this.MIME_TYPE.folder}'`,
        pageSize: 1,
        fields: `files(${args.fields || this.DEFAULTS.FIELDS_FOLDER})`
      }
      // Find folder name
      opts.q += ` and name='${args.name}'`
      // Find in Parent folder or root folder
      if (args.parents) opts.q += ` and '${args.parents}' in parents`
      // console.log(opts.q)
      const res = await window.gapi.client.drive.files.list(opts)
      return res.result.files && res.result.files.length ? res.result.files[0] : null
    } catch (e) { throw new Error(e) }
  }
  public getFolders = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.checkClient()
      if (!isReady) throw new Error('Error Client')
      let rs = [] as Array<IGoogleFile>
      const opts = {
        spaces: 'drive',
        supportsAllDrives: true,
        supportsTeamDrives: true,
        q: `trashed=${args.trashed} and mimeType='${this.MIME_TYPE.folder}'`,
        pageSize: args.pageSize || this.DEFAULTS.PAGE_SIZE,
        fields: `files(${args.fields || this.DEFAULTS.FIELDS_FOLDER})`
      }
      if (args.folderId) opts.q += ` and '${args.folderId}' in parents`
      else {
        if (args.parents) {
          opts.q += ` and '${args.parents}' in parents`
          rs.push({
            id: args.parents,
            name: 'Root',
            parents: null,
            mimeType: this.MIME_TYPE.folder,
            children: [] as Array<IGoogleFile>
          })
        } else {
          const folderID = await this.getFolder({ name: args.rootFolder, pageSize: args.pageSize, trashed: args.trashed, fields: null, parents: null })
          if (folderID) {
            opts.q += ` and '${folderID.id}' in parents`
            rs.push({
              id: folderID.id,
              name: 'Root',
              parents: null,
              mimeType: this.MIME_TYPE.folder,
              children: [] as Array<IGoogleFile>
            })
          } else if (this.DEFAULTS.FOLDER_ROOT) {
            opts.q += ` and '${this.DEFAULTS.FOLDER_ROOT}' in parents`
            rs.push({
              id: this.DEFAULTS.FOLDER_ROOT,
              name: 'Root',
              parents: null,
              mimeType: this.MIME_TYPE.folder,
              children: [] as Array<IGoogleFile>
            })
          } else {
            rs.push({
              id: 'drive',
              name: 'Drive',
              parents: null,
              mimeType: this.MIME_TYPE.folder,
              children: [] as Array<IGoogleFile>
            })
          }
        }
      }
      const res = await window.gapi.client.drive.files.list(opts)
      if (res.result.files) {
        if (rs.length && rs[0].children) rs[0].children = res.result.files
        else rs = rs.concat(res.result.files)
      }
      return rs
    } catch (e) { throw new Error(e) }
  }
  public getFile = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.checkClient()
      if (!isReady) throw new Error('Error Client')
      const opts = {
        spaces: 'drive',
        supportsAllDrives: true,
        supportsTeamDrives: true,
        q: `trashed=${args.trashed} and mimeType != '${this.MIME_TYPE.folder}'`,
        pageSize: 1,
        fields: `nextPageToken, files(${args.fields || this.DEFAULTS.FIELDS_FILE})`
      }

      // Find file by id
      // if (args.id) opts.q += ` and id='${args.id}'`
      // Find file by name
      opts.q += ` and name='${args.name}'`
      // Find in Parent folder or root folder
      opts.q += ` and '${args.parents || this.DEFAULTS.FOLDER_ROOT}' in parents`
      // console.log(opts.q)
      const res = await window.gapi.client.drive.files.list(opts)
      return res.result.files && res.result.files.length ? res.result.files[0] as IGoogleFile : null
    } catch (e) { throw new Error(e) }
  }
  public getFiles = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.checkClient()
      if (!isReady) throw new Error('Error Client')
      const opts = {
        spaces: 'drive',
        supportsAllDrives: true,
        supportsTeamDrives: true,
        q: `trashed=${args.trashed}`,
        pageToken: args.nextPageToken || null,
        pageSize: args.pageSize || this.DEFAULTS.PAGE_SIZE,
        fields: `nextPageToken, files(${args.fields || this.DEFAULTS.FIELDS_FILE})`
      }

      if (args.isFolder === undefined || !args.isFolder) opts.q += ` and mimeType != '${this.MIME_TYPE.folder}'`
      if (args.folderId) opts.q += ` and '${args.folderId || this.DEFAULTS.FOLDER_ROOT}' in parents`
      else if (args.folderName) {
        const folder = await this.getFolder({ name: args.folderName, trashed: args.trashed, fields: null, pageSize: null, parents: null })
        if (folder) opts.q += ` and '${folder.id}' in parents`
      }
      if (args.mimeType) opts.q += ` and mimeType contains '${args.mimeType}'`
      // console.log(opts.q)
      const res = await window.gapi.client.drive.files.list(opts)
      return res.result as IGoogleFile[]
    } catch (e) { throw new Error(e) }
  }
  public uploadFile = async (args?: IAgrument) => {
    try {

    } catch (error) {
      console.log(error)
    }
  }
}