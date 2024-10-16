// const AuthFile = require('../../services/google/auth-file'),
//   AuthDB = require('../../services/google/auth-db')

// module.exports = () => {
//     if (process.env.USE_DB) return AuthDB
//     else return AuthFile
// }
// console.log(process.env.USE_DB)
// if (process.env.USE_DB == 'true') {
//     module.exports = AuthDB
// } else {
//     module.exports = AuthFile
// }
import { OAuth2Client } from 'google-auth-library'
import * as AuthFile from '../../services/google/auth-file'
import * as AuthDB from '../../services/google/auth-db'
export const authorize = (scopes) => {
  return process.env.USE_DB == 'true' ? AuthDB.authorize(scopes) : AuthFile.authorize(scopes)
}

export const loadConnect = () => {
  return process.env.USE_DB == 'true' ? AuthDB.loadConnect() : AuthFile.loadConnect()
}

export const loadClientID = () => {
  return process.env.USE_DB == 'true' ? AuthDB.loadClientID() : AuthFile.loadClientID()
}

export const setClientID = (clientId) => {
  return process.env.USE_DB == 'true' ? AuthDB.setClientID(clientId) : AuthFile.setClientID(clientId)
}

export const removeClientID = () => {
  return process.env.USE_DB == 'true' ? AuthDB.removeClientID() : AuthFile.removeClientID()
}
export const revoke = () => {
  return process.env.USE_DB == 'true' ? AuthDB.revoke() : AuthFile.revoke()
}

export const getRefreshToken = async (opts, code) => {
  return new Promise(async (resolve, reject) => {
    // Create an oAuth client to authorize the API call. Secrets should be
    // downloaded from the Google Developers Console.
    const client = new OAuth2Client(
      opts.client_id,
      opts.client_secret,
      opts.redirect_uris[0]
    )

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: opts.scope
    })

    // Verify the integrity of the idToken through the authentication
    // code and use the user information contained in the token
    const { tokens } = await client.getToken(code)
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: opts.client_secret
    })
    const idInfo = ticket.getPayload()
    return tokens.refresh_token
  })
}
