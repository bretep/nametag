#!/usr/bin/env node

const https = require('https')
const fs = require('fs')
const express = require('express')
const imageUpload = require('./imageUpload')
const horizon = require('../horizon/server/src/horizon.js')
const config = require('./secrets.json')
const path = require('path')
const bodyParser = require('body-parser')
const listeners = require('./listeners')

process.env.AWS_ACCESS_KEY_ID = config.s3.accessKeyId
process.env.AWS_SECRET_ACCESS_KEY = config.s3.secretAccessKey

const app = express()

/* Serve static files */
app.use(express.static('/usr/app/dist/'))

app.use(bodyParser.json())

/* Upload an image and return the url of that image on S3 */
app.post('/api/images',
  imageUpload.multer.any(),
  (req, res) => {
    imageUpload.resize(req.body.width, req.body.height, req.files[0].filename)
      .then(data => res.json(data))
      .catch(err => console.error('Uploading image', err))
  }
)

/* Upload an image from a url and return the location of that image on S3 */
app.post('/api/image_url',
  (req, res) => {
    imageUpload.fromUrl(req.body.width, req.body.height, req.body.url)
      .then(data => res.json(data))
      .catch(err => console.error('Uploading image from URL', err))
  })

/* Create HTTP server */
const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '..', '..', '.keys', 'horizon-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', '..', '.keys', 'horizon-cert.pem')),
}, app).listen(8181)

/* Connect to Horizon */
const options = {
  project_name: 'nametag',
  rdb_host: 'rethinkdb',
  auto_create_collection: 'true',
  auto_create_index: 'true',
  auth: {
    allow_anonymous: false,
    duration: '30d',
    allow_unauthenticated: true,
    success_redirect: '/',
    create_new_users: true,
    new_user_group: 'authenticated',
    token_secret: config.token_secret,
  },
}
const horizonServer = horizon(httpsServer, options)

/* Enable Auth providers */
horizonServer.add_auth_provider(horizon.auth.twitter, config.twitter)
horizonServer.add_auth_provider(horizon.auth.facebook, config.facebook)
horizonServer.add_auth_provider(horizon.auth.google, config.google)

/* Activate db listeners */
listeners(horizonServer._reql_conn._rdb_options)

console.log('Listening on port 8181.')
