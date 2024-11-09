import delay from 'delay'
import { API_KEY, CLIENT_ID } from './gapi-client'
import { get } from '@/utils/localStorage'

interface IGoogleFile extends gapi.client.drive.File {
  children?: Array<IGoogleFile>
}

export class GoogleDrive {
  constructor() {
    this.initialize()
  }
  private googleConnect = get('connectsStore.google')
  private DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
  private SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.metadata.readonly']
  private DEFAULTS = {
    PAGE_SIZE: 20,
    FOLDER_ROOT: 'root',
    FIELDS_FOLDER: 'id,name,mimeType,parents',//'id,title,mimeType,userPermission,editable,copyable,shared,fileSize,owners'
    FIELDS_FILE: 'id,name,mimeType,size,parents,webContentLink,thumbnailLink'
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
  public getFolder = async (args?) => {
    try {
      if (!args) args = {}
      const isReady = await this.checkClient()
      if (!isReady) throw new Error('Error Client')
      const opts = {
        pageSize: args.pageSize || this.DEFAULTS.PAGE_SIZE,
        fields: `files(${args.fields || this.DEFAULTS.FIELDS_FOLDER})`,
        q: `mimeType='${this.MIME_TYPE.folder}'`,
        spaces: 'drive'
      }
      // Find folder name
      opts.q = `${opts.q} and name='${args.name}'`
      // Find in Parent folder or root folder
      opts.q = `${opts.q} and '${args.parents || this.DEFAULTS.FOLDER_ROOT}' in parents`
      // Find in folder is trashed
      opts.q = `${opts.q} and trashed=${args.trashed !== undefined ? args.trashed : false}`

      const res = await window.gapi.client.drive.files.list(opts)//.then(function (response) {
      //   var files = response.result.files;
      //   if (files && files.length > 0) {
      //     // document.getElementById('most-popular').innerText = 'Eureka! Successful connection.';
      //   } else {
      //     // document.getElementById('most-popular').innerText = 'Eureka! Successful connection, but no files found.';
      //   }
      // }).catch(function (error) {
      //   // document.getElementById('most-popular').innerText = 'Sorry! Connection unsuccessful.';
      //   console.error('Error:', error);
      // });
      return res.result.files[0]
    } catch (e) { throw new Error(e) }
  }
  public getFolders = async (args?) => {
    try {
      if (!args) args = {}
      const isReady = await this.checkClient()
      if (!isReady) throw new Error('Error Client')
      let rs = [] as Array<IGoogleFile>
      const opts = {
        pageSize: args.pageSize || this.DEFAULTS.PAGE_SIZE,
        fields: `files(${args.fields || this.DEFAULTS.FIELDS_FOLDER})`,
        q: `mimeType='${this.MIME_TYPE.folder}'`,
        spaces: 'drive'
      }
      if (args.folderId) opts.q = `${opts.q} and '${args.folderId}' in parents`
      else {
        if (args.parents) {
          opts.q = `${opts.q} and '${args.parents}' in parents`
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
            opts.q = `${opts.q} and '${folderID.id}' in parents`
            rs.push({
              id: folderID.id,
              name: 'Root',
              parents: null,
              mimeType: this.MIME_TYPE.folder,
              children: [] as Array<IGoogleFile>
            })
          } else if (this.DEFAULTS.FOLDER_ROOT) {
            opts.q = `${opts.q} and '${this.DEFAULTS.FOLDER_ROOT}' in parents`
            rs.push({
              id: this.DEFAULTS.FOLDER_ROOT,
              name: 'Root',
              parents: null,
              mimeType: this.MIME_TYPE.folder,
              children: []
            })
          } else {
            rs.push({
              id: 'drive',
              name: 'Drive',
              parents: null,
              mimeType: this.MIME_TYPE.folder,
              children: []
            })
          }
        }
      }
      opts.q = `${opts.q} and trashed=${args.trashed !== undefined ? args.trashed : false}`
      const res = await window.gapi.client.drive.files.list(opts)
      if (res.result.files) {
        if (rs.length && rs[0].children) rs[0].children = res.result.files
        else rs = rs.concat(res.result.files)
        // for await (const e of res.result.files) {
        //   if (rs.length && rs[0].children) rs[0].children.push({
        //     id: e.id,
        //     name: e.name
        //   })
        //   else rs.push({
        //     id: e.id,
        //     name: e.name
        //   })
        // }
      }
      console.log(rs)
      return rs
    } catch (e) { throw new Error(e) }
  }
  public getFile = async (args?) => {
    try {
      // const metadataRequest = gapi.client.drive.files.get({
      //   fileId: fileId,
      //   supportsTeamDrives: true,
      //   fields: DEFAULT_FIELDS
      // });
      // const contentRequest = gapi.client.drive.files.get({
      //   fileId: fileId,
      //   supportsTeamDrives: true,
      //   alt: 'media'
      // });
    } catch (error) {
      console.log(error)
    }
  }
  public getFiles = async (args?) => {
    try {
      if (!args) args = {}
      const isReady = await this.checkClient()
      if (!isReady) throw new Error('Error Client')
      const rs = { files: [] as Array<IGoogleFile>, nextPageToken: null }
      const opts = {
        pageSize: args.pageSize || this.DEFAULTS.PAGE_SIZE,
        fields: `nextPageToken, files(${args.fields || this.DEFAULTS.FIELDS_FILE})`,
        q: `trashed=${args.trashed !== undefined ? args.trashed : false}`,
        pageToken: args.nextPageToken,
        spaces: 'drive'
      }
      if (args.containFolder === undefined || !args.containFolder) opts.q = `${opts.q} and mimeType != '${this.MIME_TYPE.folder}'`
      if (this.DEFAULTS.FOLDER_ROOT) opts.q = `${opts.q} and '${this.DEFAULTS.FOLDER_ROOT}' in parents`
      if (args.folderId) opts.q = `${opts.q} and '${args.folderId}' in parents`
      else if (args.rootFolder) {
        const folderID = await this.getFolder({ name: args.rootFolder, trashed: args.trashed, fields: null, pageSize: null, parents: null })
        if (folderID) opts.q = `${opts.q} and '${folderID.id}' in parents`
      }
      if (args.mimeType) opts.q = `${opts.q} and mimeType contains '${args.mimeType}'`
      console.log(opts.q)
      const res = await window.gapi.client.drive.files.list(opts)
      if (res.result.files && res.result.files.length) {
        rs.nextPageToken = res.result.nextPageToken
        for await (const e of res.result.files) {
          if (e.mimeType === this.MIME_TYPE.folder) rs.files.push({
            id: e.id,
            name: e.name,
            mimeType: this.MIME_TYPE.folder
          })
          else rs.files
          //   .push({
          //   id: e.id,
          //   name: e.name,
          //   mimeType: e.mimeType,
          //   size: e.size,
          //   webContentLink: getViewUrl(e.id),
          //   // thumbnail: e.thumbnailLink ? onThumbnailLink(e.thumbnailLink) : null,
          //   thumbnail: e.thumbnailLink ? getThumbnail(e.id) : null,
          //   download: e.webContentLink
          // })
        }
      }
      return rs
    } catch (e) { throw new Error(e) }
  }
  public uploadFile = async (args?) => {
    try {

    } catch (error) {
      console.log(error)
    }
  }
}