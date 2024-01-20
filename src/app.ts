import api from './helpers/api'
import cors from 'cors'
import express from 'express'
import runMongo from './helpers/mongo'
import startPolling from './helpers/startPolling'

const app = express()

void (async () => {
  console.log('Starting mongo')
  await runMongo()
  console.log('Mongo connected')
  await startPolling()

  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/', api)
  app.listen(process.env.PORT || '5000', () => {
    console.log(
      `Express server listening on port ${process.env.PORT || '5000'}`
    )
  })

  console.log('App started')
})()
