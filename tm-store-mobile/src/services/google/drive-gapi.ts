import delay from 'delay'
import { API_KEY, CLIENT_ID } from './gapi-client'
import { get } from '@/utils/localStorage'

export interface IGoogleFile extends gapi.client.drive.File {
  children?: Array<IGoogleFile>
}

interface IAgrument {
  trashed?: boolean
  fields?: string
  id?: string
  ids?: Array<string>
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
  constructor(args?: any) {
    this.DEFAULTS.FOLDER_ROOT = args && args.root ? args.root : this.DEFAULTS.FOLDER_ROOT
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
    // console.log(this.DEFAULTS.FOLDER_ROOT)
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
    google: 'application/vnd.google-apps.',
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
  private CheckClient = async () => {
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
  public GetFolder = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
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
  public GetFolders = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
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
          const folderID = await this.GetFolder({ name: args.rootFolder, pageSize: args.pageSize, trashed: args.trashed, fields: null, parents: null })
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
  public GetFileById = async (args?: IAgrument) => {
    try {
      if (!args || !args.id) throw new Error('404')
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
      if (!isReady) throw new Error('Error Client')
      const opts = {
        spaces: 'drive',
        supportsAllDrives: true,
        fileId: args.id,
        q: `trashed=${args.trashed}`,
        fields: args.fields || this.DEFAULTS.FIELDS_FILE
      }
      // console.log(opts.q)
      // const fileMetadata = []
      // const fileIds = ['1hOwbxDy41ce9seTEXW2g_pl5J1nzkP8M', "1Ms0MJzt_hnpaXieyzLdDuD2BXqE1Kb2K", "1EPRVwTU7FEuWVjZ_RtI8uEOrz0kD1SMf"]
      const res = await window.gapi.client.drive.files.get(opts)
      return res.result
    } catch (e) { throw new Error(e) }
  }
  public GetFilesById = async (args?: IAgrument) => {
    try {
      const fileMetadata = []
      for (const fid of args.ids) {
        args.id = fid
        const res = await this.GetFileById(args)
        if (res) fileMetadata.push(res)
        delay(100)
      }
      return fileMetadata
    } catch (e) { throw new Error(e) }
  }
  public GetFileByName = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
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
      if (args.mimeType) opts.q += ` and mimeType contains '${args.mimeType}'`
      // console.log(opts.q)
      const res = await window.gapi.client.drive.files.list(opts)
      return res.result.files && res.result.files.length ? res.result.files[0] as IGoogleFile : null
    } catch (e) { throw new Error(e) }
  }
  public GetFiles = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
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
      if (args.isFolder === undefined || !args.isFolder) opts.q += ` and mimeType!='${this.MIME_TYPE.folder}'`
      if (args.mimeType) opts.q += ` and mimeType contains '${args.mimeType}'`
      if (args.folderId) opts.q += ` and '${args.folderId || this.DEFAULTS.FOLDER_ROOT}' in parents`
      else if (args.folderName) {
        const folder = await this.GetFolder({ name: args.folderName, trashed: args.trashed, fields: null, pageSize: null, parents: null })
        if (folder) opts.q += ` and '${folder.id}' in parents`
      }
      // console.log(opts.q)
      const res = await window.gapi.client.drive.files.list(opts)
      return res.result
    } catch (e) { throw new Error(e) }
  }
  public CreateFolder = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
      if (!isReady) throw new Error('Error Client')
      const resource = {
        name: args.name,
        parents: args.parents ? [args.parents] : [this.DEFAULTS.FOLDER_ROOT],
        mimeType: this.MIME_TYPE.folder
      } as any;
      // const fields = args.fields || this.DEFAULTS.FIELDS_FOLDER as any
      const res = await window.gapi.client.drive.files.create(resource)
      if (res.result) res.result.parents = resource.parents
      return res.result
    } catch (error) {
      console.log(error)
      return null
    }
  }
  public UploadFile = async (file: File, args?: IAgrument): Promise<IGoogleFile> => {
    try {
      if (!file) throw new Error('noExist')
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
      if (!isReady) throw new Error('Error Client')
      const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: args.parents ? [args.parents] : [this.DEFAULTS.FOLDER_ROOT],//['1UKxDg8Z3eR4ra4ohrs2Jp3aHMVF6yCAk']
        fields: args.fields || this.DEFAULTS.FIELDS_FILE
      }
      const formData = new FormData()
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
      formData.append('file', file)
      const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=${args.fields || this.DEFAULTS.FIELDS_FILE}`, {
        method: 'POST',
        headers: new Headers({ Authorization: `Bearer ${gapi.auth.getToken().access_token}` }),
        body: formData
      })//.then((res) => res.json()).then((data) => {
      //  console.log('File uploaded successfully:', data)
      // }).catch((error) => {
      //  console.error('Error uploading file:', error)
      //})
      const rs = await response.json()
      return rs
    } catch (error) {
      console.log(error)
    }
  }
  public UploadFiles = async (files: Array<any>, args?: IAgrument): Promise<IGoogleFile[]> => {
    try {
      const rs: IGoogleFile[] = []
      for (const f of files) {
        const gFile = await this.UploadFile(f, args)
        rs.push(gFile)
      }
      return rs
    } catch (error) {
      console.log(error)
    }
  }
  public UpdateFile = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
      if (!isReady) throw new Error('Error Client')
      const opts = {

      }
    } catch (error) {
      console.log(error)
    }
  }
  public UpdateTrashFile = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
      if (!isReady) throw new Error('Error Client')
      const opts = {

      }
    } catch (error) {
      console.log(error)
    }
  }
  public DeleteFile = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
      if (!isReady) throw new Error('Error Client')
      const opts = {

      }
    } catch (error) {
      console.log(error)
    }
  }
  public EmptyTrash = async (args?: IAgrument) => {
    try {
      if (!args) args = {}
      args.trashed = args.trashed || false
      const isReady = await this.CheckClient()
      if (!isReady) throw new Error('Error Client')
      const opts = {

      }
    } catch (error) {
      console.log(error)
    }
  }
}