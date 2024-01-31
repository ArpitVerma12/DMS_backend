const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')
var hpp = require('hpp')
dotenv.config()

const app = express()

app.use(helmet())
app.use(hpp())
app.disable('x-powered-by')

app.set('trust proxy', 1)


app.use(cors())

app.use(
  express.json(
    {
      limit: "30mb",
      extended: true,
    }
  )
)

app.use(
  express.urlencoded(
    {
      limit: "30mb",
      extended: true,
    }
  )
  )
  const web =require('./src/route/demo')
app.use(hpp())
app.use('/',web)


module.exports = app
