const bookmarks = require('../store')
const express = require('express');
const bookmarksRouter = express.Router()
const uuid = require('uuid/v4')
const logger = require('../logger')

bookmarksRouter 
    .route('/bookmarks')
    .get((req, res)=> {
        res.json(bookmarks)
    })
    .post((req,res)=> {
        const { title, url, description, rating } = req.body
        const id = uuid()
    
        if (!title){
            logger.error('Invalid request: Title missing')
            return res.status(400).json({error: 'Invalid request'})
        }
    
        if (!url){
            logger.error('Invalid request: URL missing')
            return res.status(400).json({error: 'Invalid request'})
        }
    
        if (!description){
            logger.error('Invalid request: Description missing')
            return res.status(400).json({error: 'Invalid request'})
        }
    
        if (!rating){
            logger.error('Invalid request: Rating missing')
            return res.status(400).json({error: 'Invalid request'})
        }
    
        const bookmark = { id, title, url, description, rating }
        bookmarks.push(bookmark)
    
        res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json(bookmark)    
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res)=> {
        const { id } = req.params 
        const bookmark = bookmarks.find((bm)=> bm.id === id)
    
        if (!bookmark){
            logger.error(`Not Found: Bookmark with id ${id} not found!`)
            return res.status(404).json({error: 'Bookmark not found!'})
        }
        res.status(200).json(bookmark)
    })
    .delete((req,res)=> {
        const { id } = req.params
        const bookmarkToDelete = bookmarks.findIndex((bm)=> bm.id == id)

        console.log(bookmarkToDelete)

        if (bookmarkToDelete === -1){
            logger.error(`Failed request: Bookmark with id ${id} not found!`)
            return res.status(404).json({error: 'Invalid request'})
        }

        bookmarks.splice(bookmarkToDelete, 1)
        res.status(204).end()
    })

module.exports = bookmarksRouter