// const bookmarks = require('../store')
const express = require('express');
const bookmarksRouter = express.Router()
const uuid = require('uuid/v4')
const logger = require('../logger')
const { BookmarksService } = require('../bookmarksService')
const jsonParser = express.json();
const { isWebUri } = require('valid-url')
const xss = require('xss')


bookmarksRouter 
    .route('/bookmarks')
    .get((req, res, next)=> {
        const knexInstance = req.app.get('db')
        BookmarksService.getBookmarks(knexInstance)
            .then(bookmarks => {
                res.json(bookmarks.map(bookmark => {
                    return {
                        id: bookmark.id,
                        title: xss(bookmark.title), 
                        url: bookmark.url,
                        description: xss(bookmark.description),
                        rating: Number(bookmark.rating)
                    }
                }))
            })
            .catch(next)      
    })
    .post(jsonParser, (req,res, next)=> {
        const knexInstance = req.app.get('db')
        const { title, url, description, rating } = req.body
        const ratingNumeric = Number(rating)

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
            return res.status(400).json({error: 'Invalid request: Rating missing'})
        }
    
        if(!Number.isInteger(ratingNumeric) || ratingNumeric < 0 || ratingNumeric > 5){
            logger.error('Invalid request: Invalid rating supplied')
            return res.status(400).json({error: 'Invalid request: Rating must be a number between 0 and 5'})
        }

        if (!isWebUri(url)){
            logger.error('Invalid request: Invalid URL supplied')
            return res.status(400).json({error: 'Invalid request: Invalid URL supplied'})
        }

        const bookmark = { title, url, description, rating }
        
        BookmarksService.insertBookmarks(knexInstance, bookmark)
            .then((newBookmark)=> {
                return res.status(201)
                .location(`http://localhost:8000/bookmarks/${newBookmark.id}`).json({
                    id: newBookmark.id,
                    title: xss(newBookmark.title),
                    url: newBookmark.url,
                    description: xss(newBookmark.description),
                    rating: Number(newBookmark.rating)
                })    

            })
            .catch(next)

    })

bookmarksRouter
    .route('/bookmarks/:id')
    .all((req, res, next)=> {
        const { id } = req.params
        const knexInstance = req.app.get('db')
        BookmarksService.getBookmarksById(knexInstance, id)
            .then(bookmark => {
                if (bookmark.length === 0){
                    logger.error(`Not Found: Bookmark with id ${id} not found!`)
                    return res.status(404).json({error: 'Bookmark not found!'})
                }
                res.bookmark = bookmark
                next()
            })
            .catch(next)
    })
    .get((req, res, next)=> {
                return res.json(res.bookmark.map(target => {
                    return {
                        id: target.id,
                        title: xss(target.title),
                        url: target.url,
                        description: xss(target.description),
                        rating: Number(target.rating)
                    }
                }))
                .catch(next)
    })
    .delete((req,res, next)=> {
        const { id } = req.params
        const knexInstance = req.app.get('db')

        BookmarksService.deleteBookmarks(knexInstance, id)
            .then(()=> {
                return res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next)=> {
        const id  = req.params.id
        const knexInstance = req.app.get('db')

        const { title, url, description, rating } = req.body
        const updatedBookmark = { title, url, description, rating }

        const numberOfValues = Object.values(updatedBookmark).filter(Boolean).length
        
        if (numberOfValues === 0){
            return res.status(400).json({
                error: {
                    message: 'Provided fields are invalid!'
                }
            })
        }

        BookmarksService.updateBookmarks(knexInstance, id, updatedBookmark)
            .then( response => 
                 res.status(204).end()
            )
            .catch(next)
    })

module.exports = bookmarksRouter