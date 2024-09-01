const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const jwtDecode = require('jwt-decode')
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis')
const io = require('../../utils/io')
const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile']
// If modifying these scopes, delete token.json.
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

// const ROOT_PATH = process.env.NODE_ENV == 'production' ? '/tmp' : process.cwd()
const ROOT_PATH = process.cwd()
const CREDENTIALS_PATH = 'credentials/google'
const CREDENTIALS = path.join(ROOT_PATH, CREDENTIALS_PATH, 'credentials.json');
const CLIENT_ID = path.join(ROOT_PATH, CREDENTIALS_PATH, 'clientID.json');

module.exports.loadClientID = async function () {
  try {
    const clientId = await fs.readFile(CLIENT_ID);
    return JSON.parse(clientId);
  } catch (e) { return null; }
}

module.exports.setClientID = async function (clientId) {
  try {
    await io.createDir({ root: ROOT_PATH, dir: CREDENTIALS_PATH })
    clientId = JSON.parse(clientId)
    const payload = JSON.stringify(clientId);
    await fs.writeFile(CLIENT_ID, payload);
    return true
  } catch (e) { throw new Error(e) }
}

module.exports.removeClientID = async function () {
  try {
    await fs.rm(CLIENT_ID);
    return true
  } catch (e) { throw new Error(e) }
}

const loadCredentials = async function () {
  try {
    const credentials = await fs.readFile(CREDENTIALS);
    return JSON.parse(credentials);
  } catch (e) { return null; }
}

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function authFromJSON() {
  try {
    const credentials = await loadCredentials()
    return google.auth.fromJSON(credentials);
  } catch (e) { return null; }
}
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  try {
    const content = await fs.readFile(CLIENT_ID);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
      id_token: client.credentials.id_token
    });
    await fs.writeFile(CREDENTIALS, payload);
  } catch (e) { throw new Error(e) }
}

/**
 * Load or request or authorization to call APIs.
 */
module.exports.authorize = async function (scopes) {
  try {
    let client = await authFromJSON();
    if (client) return client;
    const options = { keyfilePath: CLIENT_ID };
    if (scopes) options.scopes = SCOPES.concat(scopes)
    client = await authenticate(options);
    if (client.credentials) await saveCredentials(client);
    return client;
  } catch (e) { throw new Error(e) }
}

module.exports.getProfile = async function () {
  try {
    const credentials = await loadCredentials()
    if (!credentials) return null
    return credentials.id_token ? jwtDecode(credentials.id_token) : null
  } catch (e) { throw new Error(e) }
}
module.exports.isAuth = async function () {
  try {
    const credentials = await loadCredentials()
    if (credentials) return true;
    else return false
  } catch (e) { throw new Error(e) }
}

module.exports.revoke = async function () {
  try {
    await fs.rm(CREDENTIALS);
    return true
  } catch (e) { throw new Error(e) }
}
