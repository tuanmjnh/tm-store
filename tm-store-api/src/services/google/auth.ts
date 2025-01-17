// import { join } from 'path'
// import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile']
const CLIENT_ID = '235324461758-n9qs0f3kec5e8q8t2almq6edn0cjh704.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const LOCATION_HOST = 'http://localhost:8080'
// const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, LOCATION_HOST)
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

/**
 * Load or request or authorization to call APIs.
 */
export const authorize = async (credentials) => {
  try {
    return await google.auth.fromJSON(credentials)
  } catch (e) {
    // console.log(e)
    throw new Error(e)
  }
}

export const googleOAuth2ByCode = async (args) => {
  try {
    const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, args.redirectUri)
    const { tokens } = await OAuth2Client.getToken(args.code)
    OAuth2Client.setCredentials(tokens)
    return tokens
    // const paramsGetToken = {
    //   client_id: CLIENT_ID,
    //   client_secret: CLIENT_SECRET,
    //   code: args.code,
    //   grant_type: 'authorization_code',
    //   access_type: 'offline',
    //   prompt: 'consent',
    //   redirect_uri: 'http://localhost:8000/connect/google-add'
    // }
    // const formDataGetToken = new URLSearchParams();
    // for (const p in paramsGetToken) {
    //   formDataGetToken.append(p, paramsGetToken[p])
    // }
    // // const formDataGetToken = new FormData();
    // // for (const p in paramsGetToken) {
    // //   formDataGetToken.append(p, paramsGetToken[p])
    // // }
    // // formDataGetToken.append('name', 'John');
    // // formDataGetToken.append('password', 'John123');

    // const response = await fetch('https://oauth2.googleapis.com/token', {
    //   // mode: 'no-cors',
    //   method: 'POST',
    //   headers: {
    //     // 'Content-Type': 'application/json',
    //     // 'cross-origin-resource-policy:': 'cross-origin',
    //     'Accept': 'application/json',
    //     // 'Content-Type': 'application/json',
    //     // 'Content-Type': 'multipart/form-data',
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     // 'Access-Control-Allow-Origin': '*',
    //     //  'Access-Control-Allow-Headers': 'Origin, X-Requested-With'
    //     // 'Access-Control-Allow-Origin': LOCATION_HOST,
    //     // 'Access-Control-Allow-Methods': 'POST',
    //     // 'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
    //     // 'Access-Control-Allow-Credentials': 'true'
    //   },
    //   body: formDataGetToken
    // })

    // response.json().then(tokens => {
    //   console.log(tokens)
    //   console.log(jwtDecode(tokens.id_token))
    //   // oauth2Client.setCredentials(tokens)
    // })
  } catch (error) {
    console.log(error)
  }
}

export const verifyIdToken = async (credentialsDB, redirectUri) => {
  try {
    const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri)
    const ticket = await OAuth2Client.verifyIdToken(credentialsDB)
    return ticket
  } catch (error) {
    console.log(error)
  }
}

export const refreshAccessToken = async (credentialsDB, redirectUri) => {
  try {
    const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirectUri)
    OAuth2Client.setCredentials(credentialsDB)
    const { credentials } = await OAuth2Client.refreshAccessToken()
    return credentials
  } catch (error) {
    console.log(error)
  }
}

export const getRefreshToken = async (args) => {
  const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, args.redirectUri)
  // return new Promise(async (resolve, reject) => {
  // Create an oAuth client to authorize the API call. Secrets should be
  // downloaded from the Google Developers Console.
  // const client = new OAuth2Client(
  //   opts.client_id,
  //   opts.client_secret,
  //   opts.redirect_uris[0]
  // )

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = OAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: args.scope
  })

  // Verify the integrity of the idToken through the authentication
  // code and use the user information contained in the token
  const { tokens } = await OAuth2Client.getToken(args.code)
  const ticket = await OAuth2Client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: args.client_secret
  })
  const idInfo = ticket.getPayload()
  return tokens.refresh_token
  // })
}
