require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require ('helmet')
const logger = require('./logger')

const { NODE_ENV } = require('./config')

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use((req, res, next)=> {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization').split(' ')[1]

    console.log(apiToken, authToken)

    if (!authToken || apiToken !== authToken){
        logger.error(`Unauthorized Request to path ${req.path}`)
        return res.status(401).json({error: 'Unauthorized Request'})
    }

    next()
})

const bookmarksRouter = require('./bookmarks/bookmarks-router')

app.use(bookmarksRouter)

app.use(function errorHandler(error, req, res, next){
    let response
    if (NODE_ENV === 'production'){
        response = { error: { message: 'server error' } }
    } else {
        logger.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app 