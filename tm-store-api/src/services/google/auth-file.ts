import { join } from 'path'
import { readFile, writeFile, rm } from 'fs/promises'
import { jwtDecode } from 'jwt-decode'
import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
import { createDir } from '../../utils/tm-io'
const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile']
// If modifying these scopes, delete token.json.
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

// const ROOT_PATH = process.env.NODE_ENV == 'production' ? '/tmp' : process.cwd()
const ROOT_PATH = process.cwd()
const CREDENTIALS_PATH = 'credentials/google'
const CREDENTIALS = join(ROOT_PATH, CREDENTIALS_PATH, 'credentials.json')
const CLIENT_ID = join(ROOT_PATH, CREDENTIALS_PATH, 'clientID.json')

export const loadConnect = () => { return true }

export const loadClientID = async function () {
  try {
    const clientId = (await readFile(CLIENT_ID)).toString()
    return JSON.parse(clientId)
  } catch (e) { return null }
}

export const setClientID = async function (clientId) {
  try {
    await createDir({ root: ROOT_PATH, dir: CREDENTIALS_PATH })
    clientId = JSON.parse(clientId)
    const payload = JSON.stringify(clientId)
    await writeFile(CLIENT_ID, payload)
    return true
  } catch (e) { throw new Error(e) }
}

export const removeClientID = async function () {
  try {
    await rm(CLIENT_ID)
    return true
  } catch (e) { throw new Error(e) }
}

const loadCredentials = async function () {
  try {
    const credentials = await readFile(CREDENTIALS).toString()
    return JSON.parse(credentials)
  } catch (e) { return null }
}

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function authFromJSON() {
  try {
    const credentials = await loadCredentials()
    return google.auth.fromJSON(credentials)
  } catch (e) { return null }
}
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  try {
    const content = await readFile(CLIENT_ID).toString()
    const keys = JSON.parse(content)
    const key = keys.installed || keys.web
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
      id_token: client.credentials.id_token
    })
    await writeFile(CREDENTIALS, payload)
  } catch (e) { throw new Error(e) }
}

/**
 * Load or request or authorization to call APIs.
 */
export const authorize = async function (scopes) {
  try {
    // console.log(scopes)
    let auth = await authFromJSON() as any
    if (auth) return auth
    const options = { keyfilePath: CLIENT_ID } as any
    if (scopes) options.scopes = SCOPES.concat(scopes)
    auth = await authenticate(options)
    if (auth.credentials) await saveCredentials(auth)
    return auth
  } catch (e) { throw new Error(e) }
}

export const getProfile = async function () {
  try {
    const credentials = await loadCredentials()
    if (!credentials) return null
    // console.log(jwtDecode(credentials.id_token))
    return credentials.id_token ? jwtDecode(credentials.id_token) : null
  } catch (e) { throw new Error(e) }
}
export const isAuth = async function () {
  try {
    const credentials = await loadCredentials()
    if (credentials) return true
    else return false
  } catch (e) { throw new Error(e) }
}

export const revoke = async function () {
  try {
    await rm(CREDENTIALS)
    return true
  } catch (e) { throw new Error(e) }
}
