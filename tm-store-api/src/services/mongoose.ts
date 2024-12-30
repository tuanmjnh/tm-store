import { connect, set } from 'mongoose'
import { NODE_ENV } from '../config'
export const dbConnection = async () => {
  const dbConfig = {
    url: process.env.MONGO_DB,
    options: {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      retryWrites: false
    },
  }

  if (NODE_ENV !== 'production') {
    set('debug', true)
  }

  await connect(dbConfig.url, dbConfig.options).then(
    () => { console.log('Database connection is successful') },
    err => { console.log(`Error when connecting to the database ${err}`) }
  )
}
