// import { join } from 'path'
import { jwtDecode } from 'jwt-decode'
// import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile']
const MConnect = require('./model-connect')
const currentAcc = { name: 'Google', key: 'google' }
// export const connects = connects
// If modifying these scopes, delete token.json.
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const ROOT_PATH = process.env.NODE_ENV == 'production' ? '/tmp' : cwd()
// const ROOT_PATH = process.cwd()
// const CREDENTIALS_PATH = 'credentials/google'
// const CREDENTIALS = join(ROOT_PATH, CREDENTIALS_PATH, 'credentials.json')
// const CLIENT_ID = join(ROOT_PATH, CREDENTIALS_PATH, 'clientID.json')
// const CLIENT_ID_TMP = join(process.cwd(), 'tmp', 'clientID.json')

const getConnect = async function () {
  try {
    return await MConnect.findOne({ key: currentAcc.key })
  } catch (e) { throw new Error(e) }
}
// getConnect()

export const loadConnect = getConnect

export const loadClientID = async function () {
  try {
    const exist = await getConnect()
    if (exist) return exist.clientID
  } catch (e) { throw new Error(e) }
}


export const setClientID = async function (clientId) {
  try {
    const exist = await getConnect()
    clientId = JSON.parse(clientId)
    if (exist) {
      const rs = await MConnect.updateOne({ _id: exist._id }, { $set: { clientID: clientId } })
      return rs.modifiedCount > 0 ? true : false
    } else {
      const data = new MConnect({
        name: currentAcc.name,
        key: currentAcc.key,
        clientID: clientId,
        credentials: null,
        authUri: null,
        redirectUris: null,
        flag: 1,
        created: { at: new Date(), by: 'admin', ip: '' } //{ at: new Date(), by: createdBy || request.verify._id, ip: Request.getIp(request) }
      })

      data.validateSync()
      const rs = await data.save()
      return rs ? true : false
    }
  } catch (e) { throw new Error(e) }
}

// const writeClientID = async function (clientId) {
//   try {
//     return new Promise(async resolve => {
//       var exist = await fs.existsSync(CLIENT_ID_TMP)
//       if (!exist) {
//         if (exist) await fs.rmSync(CLIENT_ID_TMP)
//         let stream = fs.createWriteStream(CLIENT_ID_TMP, { flags: 'a' })
//         stream.write(JSON.stringify(clientId), () => { resolve(true) })
//       } else resolve(true)
//       // await fs.writeFileSync(CLIENT_ID_TMP, JSON.stringify(clientId))
//       // await fs.writeFile(CLIENT_ID_TMP, JSON.stringify(clientId))

//     })
//   } catch (e) { throw new Error(e) }
// }

export const removeClientID = async function () {
  try {
    const exist = await getConnect()
    if (exist) {
      const set = { clientID: null }
      const rs = await MConnect.updateOne({ _id: exist._id }, { $set: set })
      return rs.modifiedCount > 0 ? true : false
    } else return false
  } catch (e) { throw new Error(e) }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
// async function saveCredentials(connects, credentials) {
//   try {
//     const content = await fs.readFile(CLIENT_ID)
//     const keys = JSON.parse(content)
//     const key = keys.installed || keys.web
//     const payload = JSON.stringify({
//       type: 'authorized_user',
//       client_id: key.client_id,
//       client_secret: key.client_secret,
//       refresh_token: client.credentials.refresh_token,
//       id_token: client.credentials.id_token
//     })
//     await fs.writeFile(CREDENTIALS, payload)
//   } catch (e) { throw new Error(e) }
// }

/**
 * Load or request or authorization to call APIs.
 */
export const authorize = async function (scopes) {
  try {
    const exist = await getConnect()
    if (exist.credentials) {
      // console.log(exist.credentials)
      const auth = await google.auth.fromJSON(exist.credentials)
      if (auth) return auth
      else return null
    } else {
      const options = { client_id: exist.clientID } as any
      if (scopes) options.scopes = SCOPES.concat(scopes)
      options.prompt = 'consent'
      // console.log(options)
      const auth = await authenticate(options) as any
      //console.log(auth.credentials)
      if (auth.credentials) {
        const key = exist.clientID.installed || exist.clientID.web
        await MConnect.updateOne({ _id: exist._id }, {
          $set: {
            credentials: { ...auth.credentials, ...{ type: 'authorized_user', client_id: key.client_id, client_secret: key.client_secret } },
            profile: jwtDecode(auth.credentials.id_token)
          }
        })
        // console.log(update)
        // return rs.modifiedCount > 0 ? true : false
      }
      return auth
    }
  } catch (e) {
    // console.log(e)
    throw new Error(e)
  }
}

export const getProfile = async function () {
  try {
    const exist = await getConnect()
    if (exist) return exist.profile
    return null
    // console.log(jwtDecode(credentials.id_token))
    // return credentials.id_token ? jwtDecode(credentials.id_token) : null
  } catch (e) { throw new Error(e) }
}
export const isAuth = async function () {
  try {
    const exist = await getConnect()
    // console.log(exist)
    if (exist && exist.credentials) return true
    else return false
  } catch (e) { throw new Error(e) }
}

export const revoke = async function () {
  try {
    const exist = await getConnect()
    await MConnect.updateOne({ _id: exist._id }, {
      $set: {
        credentials: null,
        profile: null
      }
    })
    return true
  } catch (e) { throw new Error(e) }
}



const google_auth_library_1 = require("google-auth-library")
const http = require("http")
const url_1 = require("url")
const opn = require("open")
const arrify = require("arrify")
const destroyer = require("server-destroy")
const invalidRedirectUri = `The provided keyfile does not define a valid
redirect URI. There must be at least one redirect URI defined, and this sample
assumes it redirects to 'http://localhost:3000/oauth2callback'.  Please edit
your keyfile, and add a 'redirect_uris' section.  For example:

"redirect_uris": [
  "http://localhost:3000/oauth2callback"
]
`
function isAddressInfo(addr) {
  return addr.port !== undefined
}
// Open an http server to accept the oauth callback. In this
// simple example, the only request to our webserver is to
// /oauth2callback?code=<code>
async function authenticate(options) {
  let _a
  let keyFile = '' as any
  if (options.keyfilePath) {
    if (!options ||
      typeof options.keyfilePath !== 'string') {
      throw new Error('keyfilePath must be set to the fully qualified path to a GCP credential keyfile.')
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    keyFile = require(options.keyfilePath)
  } else {
    if (!options.client_id || typeof options.client_id !== 'object') throw new Error('client_id must be json format.')
    keyFile = options.client_id
  }
  // const keyFile = require(options.keyfilePath)
  const keys = keyFile.installed || keyFile.web
  if (!keys.redirect_uris || keys.redirect_uris.length === 0) {
    throw new Error(invalidRedirectUri)
  }
  const redirectUri = new url_1.URL((_a = keys.redirect_uris[0]) !== null && _a !== void 0 ? _a : 'http://localhost')
  if (redirectUri.hostname !== 'localhost') {
    throw new Error(invalidRedirectUri)
  }
  // create an oAuth client to authorize the API call
  const client = new google_auth_library_1.OAuth2Client({
    clientId: keys.client_id,
    clientSecret: keys.client_secret,
  })
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new url_1.URL(req.url, 'http://localhost:3000')
        if (url.pathname !== redirectUri.pathname) {
          res.end('Invalid callback URL')
          return
        }
        const searchParams = url.searchParams
        if (searchParams.has('error')) {
          res.end('Authorization rejected.')
          reject(new Error(searchParams.get('error')))
          return
        }
        if (!searchParams.has('code')) {
          res.end('No authentication code provided.')
          reject(new Error('Cannot read authentication code.'))
          return
        }
        const code = searchParams.get('code')
        const { tokens } = await client.getToken({
          code: code,
          redirect_uri: redirectUri.toString(),
        })
        client.credentials = tokens
        resolve(client)
        res.end('Authentication successful! Please return to the console.')
      }
      catch (e) {
        reject(e)
      }
      finally {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        server.destroy()
      }
    })
    let listenPort = 3000
    if (keyFile.installed) {
      // Use emphemeral port if not a web client
      listenPort = 0
    }
    else if (redirectUri.port !== '') {
      listenPort = Number(redirectUri.port)
    }
    server.listen(listenPort, () => {
      const address = server.address()
      if (isAddressInfo(address)) {
        redirectUri.port = String(address.port)
      }
      const scopes = arrify(options.scopes || [])
      // open the browser to the authorize url to start the workflow
      const authorizeUrl = client.generateAuthUrl({
        redirect_uri: redirectUri.toString(),
        access_type: 'offline',
        scope: scopes.join(' '),
        prompt: options.prompt
      })
      opn(authorizeUrl, { wait: false }).then(cp => cp.unref())
    })
    destroyer(server)
  })
}
