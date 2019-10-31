// const bookmarks = require('../store')
const express = require('express');
const bookmarksRouter = express.Router()
const uuid = require('uuid/v4')
const logger = require('../logger')
const { BookmarksService } = require('../bookmarksService')
const jsonParser = express.json();

bookmarksRouter 
    .route('/bookmarks')
    .get((req, res, next)=> {
        const knexInstance = req.app.get('db')
        BookmarksService.getBookmarks(knexInstance)
            .then(bookmarks => {
                res.json(bookmarks.map(bookmark => {
                    return {
                    ...bookmark,
                    rating: Number(bookmark.rating)
                    }
                }))
            })
            .catch(next)      
    })
    .post(jsonParser, (req,res, next)=> {
        const knexInstance = req.app.get('db')
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
        
        BookmarksService.insertBookmarks(knexInstance, bookmark)
            .then((newBookmark)=> {
                return res.status(201)
                // .location(`http://localhost:8000/bookmarks/${id}`).json(newBookmark)    

            })
            .catch(next)

    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res, next)=> {
        const { id } = req.params 
        const knexInstance = req.app.get('db')
    
        BookmarksService.getBookmarksById(knexInstance, id)
            .then(bookmark => {
                console.log('BOOKY', bookmark)
                if (bookmark.length === 0){
                    logger.error(`Not Found: Bookmark with id ${id} not found!`)
                    return res.status(404).json({error: 'Bookmark not found!'})
                }
                
                res.status(200).json(bookmark.map(target => {
                    return {
                        ...target,
                        rating: Number(target.rating)
                    }
                }))
            })
            .catch(next)

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