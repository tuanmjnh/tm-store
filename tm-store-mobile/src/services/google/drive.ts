import { get } from '@/utils/localStorage'
import { CLIENT_ID } from './oauth2'
export class GoogleDrive {
  constructor() {
    this.initialize()
  }
  private DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
  private SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.metadata.readonly']
  private DEFAULT_FIELDS = 'id,title,mimeType,userPermission,editable,copyable,shared,fileSize'
  private BASE_URL = 'https://www.googleapis.com/drive/v3/files'
  private googleConnect = get('connectsStore.google')
  private initialize() {
    if (this.googleConnect && this.googleConnect.access_token)
      console.log(this.googleConnect.access_token)
    // console.log(accessToken)
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

  private googleOAuth2ByCode = async (args) => {
    try {
      const opts = {
        ...{
          pageSize: 10,
          fields: this.DEFAULT_FIELDS,
          // 'driveId': SHARED_DRIVE_ID,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        },
        ...args
      }
      const formDataGetToken = new URLSearchParams();
      // for (const p in paramsGetToken) {
      //   formDataGetToken.append(p, paramsGetToken[p])
      // }
      // const formDataGetToken = new FormData();
      // for (const p in paramsGetToken) {
      //   formDataGetToken.append(p, paramsGetToken[p])
      // }
      // formDataGetToken.append('name', 'John');
      // formDataGetToken.append('password', 'John123');

      const response = await fetch(this.BASE_URL, {
        // mode: 'no-cors',
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          // 'cross-origin-resource-policy:': 'cross-origin',
          'Accept': 'application/json',
          // 'Content-Type': 'application/json',
          // 'Content-Type': 'multipart/form-data',
          // 'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/json; charset=UTF-8',
          // 'Access-Control-Allow-Origin': '*',
          //  'Access-Control-Allow-Headers': 'Origin, X-Requested-With'
          // 'Access-Control-Allow-Origin': LOCATION_HOST,
          // 'Access-Control-Allow-Methods': 'POST',
          // 'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
          // 'Access-Control-Allow-Credentials': 'true'
        },
        body: formDataGetToken
      })

      response.json().then(tokens => {
        console.log(tokens)
      })
    } catch (error) {
      console.log(error)
    }
  }
  public getFiles = async (args?) => {
    try {
      const opts = {
        ...{
          pageSize: 10,
          fields: 'nextPageToken, files(id, name)',
          // 'driveId': SHARED_DRIVE_ID,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        },
        ...args
      }
      window.gapi.client.drive.files.list(opts).then(function (response) {
        var files = response.result.files;
        if (files && files.length > 0) {
          document.getElementById('most-popular').innerText = 'Eureka! Successful connection.';
        } else {
          document.getElementById('most-popular').innerText = 'Eureka! Successful connection, but no files found.';
        }
      }).catch(function (error) {
        document.getElementById('most-popular').innerText = 'Sorry! Connection unsuccessful.';
        console.error('Error:', error);
      });
    } catch (error) {
      console.log(error)
    }
  }
  public getFile = async () => {
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
  public uploadFile = async () => {
    try {

    } catch (error) {
      console.log(error)
    }
  }
}