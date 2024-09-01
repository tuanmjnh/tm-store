const AuthFile = require('../../services/google/auth-file'),
  AuthDB = require('../../services/google/auth-db')
// module.exports = () => {
//     if (process.env.USE_DB) return AuthDB
//     else return AuthFile
// }
// console.log(process.env.USE_DB)
if (process.env.USE_DB == 'true') {
  module.exports = AuthDB
} else {
  module.exports = AuthFile
}