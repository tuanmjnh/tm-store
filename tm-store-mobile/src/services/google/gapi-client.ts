import delay from "delay"

// let gapi
// let google
export let tokenClient: any
let gapiInited = false
let gisInited = false

export const API_KEY = 'AIzaSyC-ysFtHg8WdeTMtndJEOx8LaFnm0CWUmk'
export const CLIENT_ID = '235324461758-n9qs0f3kec5e8q8t2almq6edn0cjh704.apps.googleusercontent.com'

// Discovery doc URL for APIs used by the quickstart
export const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
export const SCOPES = [ //https://developers.google.com/identity/protocols/oauth2/scopes
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/forms',
  'https://www.googleapis.com/auth/keep'
]
/**
  * Callback after api.js is loaded.
  */
// function gapiLoaded() {
//   window.gapi.load('client', initializeGapiClient)
//   console.log(window.gapi)
// }

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await window.gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    scope: SCOPES.join(' '),
    discoveryDocs: [DISCOVERY_DOC]
  })
  gapiInited = true
  // console.log(window.gapi)
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES.join(' '),
    callback: null, //'http://localhost:8000/connect/google-add', // defined later
    prompt: '',
    // ux_mode: 'popup',
  })
  gisInited = true
  // tokenClient.requestAccessToken()
  // console.log(tokenClient)
  // console.log(window.google)
  // window.global.googleTokenClient = tokenClient
}

// // export const gapiInitialize = () => {
// const gsiScript = document.createElement('script')
// gsiScript.async = true
// gsiScript.defer = true
// gsiScript.src = 'https://accounts.google.com/gsi/client?onload=onGisLoad'
// document.head.appendChild(gsiScript)

// const apiScript = document.createElement('script')
// apiScript.async = true
// apiScript.defer = true
// apiScript.src = 'https://apis.google.com/js/api.js?onload=onGapiLoad'
// document.head.appendChild(apiScript)

// // window.onGisLoad = function onGisLoad() {
// //   gisLoaded()
// //   console.log(window.google)
// // }

// window.onGapiLoad = function onGapiLoad() {
//   window.gapi.load('client', initializeGapiClient)
//   setTimeout(() => {
//     gisLoaded()
//   }, 300)
// }

// document.addEventListener("DOMContentLoaded", () => {
// });




// function start() {
//   // Initializes the client with the API key and the Translate API.
//   gapi.client.init({
//     'apiKey': 'AIzaSyC-ysFtHg8WdeTMtndJEOx8LaFnm0CWUmk',
//     'clientId': '235324461758-n9qs0f3kec5e8q8t2almq6edn0cjh704.apps.googleusercontent.com',
//     'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/translate/v2/rest'],
//   }).then(function () {
//     // Executes an API request, and returns a Promise.
//     // The method name `language.translations.list` comes from the API discovery.
//     return gapi.client.language.translations.list({
//       q: 'hello world',
//       source: 'en',
//       target: 'de',
//     })
//   }).then(function (response) {
//     console.log(response.result.data.translations[0].translatedText)
//   }, function (reason) {
//     console.log('Error: ' + reason.result.error.message)
//   })
// }

// Loads the JavaScript client library and invokes `start` afterwards.
// gapi.load('client:auth2', start)
// const googleOauth = gapi.auth2.getAuthInstance()
// }
export const requestlAccessToken = async () => {
  return new Promise(async resolve => {
    while (!tokenClient) { await delay(100) }
    resolve(tokenClient)
  })
}

export const initCodeClient = async () => {
  const codeClient = window.google.accounts.oauth2.initCodeClient({
    // auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    client_id: CLIENT_ID,
    scope: SCOPES.join(' '),
    callback: null, // 'http://localhost:8000/connect/google-add', // defined later
    redirect_uri: 'http://localhost:8000/connect/google-add',
    // prompt: '',
    ux_mode: 'popup',// redirect popup
    select_account: true,
    error_callback: (e) => {
      console.log(e)
    },
  })
  return codeClient
}

export const initGapiClient = async (discoveryDocs, scope) => {
  // await window.gapi.client.init({
  //   apiKey: API_KEY,
  //   // client_id: CLIENT_ID,
  //   scope: scope.join(' '),
  //   discoveryDocs: [discoveryDocs],

  // })
  // gapiInited = true
  // console.log(window.gapi)
}

export const initAccessToken = async () => {
  // gapi.auth.setToken({ access_token: '.....' }) 
  gapi.client.setToken({ access_token: '.....' })
}


export const gapi = window.gapi
export const google = window.google