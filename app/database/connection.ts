import mongoose from 'mongoose'

export const connectToDb = async () => {
  await mongoose.connect(
    'mongodb://127.0.0.1:27017/z1backend'
  )
    .then(() => { console.log('Connected to database.') })
    .catch((err) => {
      console.error(err)
    })
}


export const connectDBForTesting = async (mongodbURI: string, dbName: string) => {
  if (!mongodbURI || !dbName) {
    return Promise.reject('MongoDB URI or DB Name is not defined')
  }
  try {
    await mongoose.connect(
      mongodbURI,
      { autoIndex: false, dbName }
    )
    return mongoose.connection
  } catch (error) {
    console.log(error)
    return undefined
  }
}