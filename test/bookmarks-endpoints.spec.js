const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { createBookmarks, createXSS } = require('./bookmarks.fixtures')

describe('Bookmarks Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DB_TEST_URL
        })
        
        app.set('db', db)
    })

    after('disconnect from db', ()=> db.destroy())

    before('clean the table', ()=> db('bookmarks_table').truncate())

    afterEach('cleanup', ()=> db('bookmarks_table').truncate())

    describe('GET /bookmarks', ()=> {

        context('Given an XSS Attack Bookmark', ()=> {
            const malicious = createXSS().xssBookmark
            const sanitized = createXSS().sanitizedBookmark

            beforeEach(()=> {
                return db 
                    .into('bookmarks_table')
                    .insert(malicious)
            })

            it('sanitizes the post', ()=> {
                return supertest(app)
                    .get('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200)
                    .expect( res => {
                        expect(res.body[0].title).to.eql(sanitized.title)
                        expect(res.body[0].url).to.eql(sanitized.url)
                        expect(res.body[0].description).to.eql(sanitized.description)
                        expect(res.body[0].rating).to.eql(sanitized.rating)
                        expect(res.body[0]).to.haveOwnProperty('id')
                    })
            })
        })


        context('Given that there are no bookmarks in the database', ()=> {
            it('GET /bookmarks responds with a 200 and returns an empty array', ()=> {
                return supertest(app)
                    .get('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [])

            })
        })

        context('Given that there are bookmarks in the database', () => {
            const testBookmarks = createBookmarks();
    
            beforeEach('insert testBookmarks', () => {
                return db
                    .into('bookmarks_table')
                    .insert(testBookmarks)
            })
    
            it('GET /bookmarks responds with a 200 and returns inserted bookmarks', () => {
                return supertest(app)
                    .get('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testBookmarks)
            })
        })

    })

    describe('GET /bookmarks/:id', ()=> {

        context('Given an XSS Attack Bookmark', ()=> {
            const malicious = createXSS().xssBookmark
            const sanitized = createXSS().sanitizedBookmark

            beforeEach(()=> {
                return db 
                    .into('bookmarks_table')
                    .insert(malicious)
            })

            it('sanitizes the post', ()=> {
                return supertest(app)
                    .get(`/bookmarks/${malicious.id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200)
                    .expect( res => {
                        expect(res.body[0].title).to.eql(sanitized.title)
                        expect(res.body[0].url).to.eql(sanitized.url)
                        expect(res.body[0].description).to.eql(sanitized.description)
                        expect(res.body[0].rating).to.eql(sanitized.rating)
                        expect(res.body[0]).to.haveOwnProperty('id')
                    })
            })
        })

        context('Given that there are no bookmarks in the database', () => {
            it('GET /bookmarks/:id responds with a 404 and returns an error message', ()=> {
                const id = 23
                return supertest(app)
                    .get(`/bookmarks/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {error: 'Bookmark not found!'})
            })
        })


        context('Given that there are bookmarks in the database', () => {
            const testBookmarks = createBookmarks();
    
            beforeEach('insert testBookmarks', () => {
                return db
                    .into('bookmarks_table')
                    .insert(testBookmarks)
            })

            it('GET /bookmarks/:id responds with a 200 and returns specified bookmark by ID', ()=> {
                const id = 2
                const targetBookmark = testBookmarks.find(bookmark => bookmark.id === id)
    
                return supertest(app)
                    .get(`/bookmarks/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [targetBookmark])
            })
        })
    })

    describe('POST /bookmarks', () => {

        context('Given that a required field is missing or invalid from bookmark', ()=> {
            it('responds with a 400 if missing title', ()=> {
                const newBookmark = {
                    url: 'http://www.NEWBOOKMARK.com',
                    description: 'test: new bookmark',
                    rating: 3
                }

                return supertest(app)
                    .post('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newBookmark)
                    .expect(400, {error: 'Invalid request'})

            })

            it('responds with a 400 if url is missing', ()=> {
                const newBookmark = {
                    title: 'NEW BOOKMARK',
                    description: 'test: new bookmark',
                    rating: 3
                }

                return supertest(app)
                    .post('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newBookmark)
                    .expect(400, {error: 'Invalid request'})
            })

            it('responds with a 400 if rating is missing', ()=> {
                const newBookmark = {
                    title: 'NEW BOOKMARK',
                    url: 'http://www.NEWBOOKMARK.com',
                    description: 'test: new bookmark',
                }

                return supertest(app)
                    .post('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newBookmark)
                    .expect(400, {error: 'Invalid request: Rating missing'}) 
    
            })

            it('responds with a 400 if rating is NaN', ()=> {
                const newBookmark = {
                    title: 'NEW BOOKMARK',
                    url: 'http://www.NEWBOOKMARK.com',
                    description: 'test: new bookmark',
                    rating: 'three'
                }

                return supertest(app)
                    .post('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newBookmark)
                    .expect(400, {error: 'Invalid request: Rating must be a number between 0 and 5'})
            })            
            
            it('responds with a 400 if rating is not between 0-5', ()=> {
                const newBookmark = {
                    title: 'NEW BOOKMARK',
                    url: 'http://www.NEWBOOKMARK.com',
                    description: 'test: new bookmark',
                    rating: 120
                }

                return supertest(app)
                    .post('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newBookmark)
                    .expect(400, {error: 'Invalid request: Rating must be a number between 0 and 5'})
            })

            it('responds with a 400 if URL is not valid', () => {
                const newBookmark = {
                    title: 'NEW BOOKMARK',
                    url: 'wwwasdf.NEWBOOKMARK.com',
                    description: 'test: new bookmark',
                    rating: 2
                }

                return supertest(app)
                .post('/bookmarks')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newBookmark)
                .expect(400, {error: 'Invalid request: Invalid URL supplied'})
            })
        })

        context('Given all fields are valid and present', () => {
            it('POST /bookmarks responds with a 201 and creates/returns the new article', ()=> {
                const newBookmark = {
                    title: 'NEW BOOKMARK',
                    url: 'http://www.NEWBOOKMARK.com',
                    description: 'test: new bookmark',
                    rating: 3
                }
    
                return supertest(app)
                    .post('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newBookmark)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.title).to.eql(newBookmark.title)
                        expect(res.body.url).to.eql(newBookmark.url)
                        expect(res.body.description).to.eql(newBookmark.description)
                        expect(res.body.rating).to.eql(newBookmark.rating)
                        expect(res.body).to.haveOwnProperty('id')
                    })
            })
        })

        context('Given an XSS Attack Bookmark', ()=> {
            const malicious = createXSS().xssBookmark
            const sanitized = createXSS().sanitizedBookmark

            beforeEach(()=> {
                return db 
                    .into('bookmarks_table')
                    .insert(malicious)
            })

            it('sanitizes the post', ()=> {
                return supertest(app)
                    .post('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(malicious)
                    .expect(201)
                    .expect( res => {
                        expect(res.body.title).to.eql(sanitized.title)
                        expect(res.body.url).to.eql(sanitized.url)
                        expect(res.body.description).to.eql(sanitized.description)
                        expect(res.body.rating).to.eql(sanitized.rating)
                        expect(res.body).to.haveOwnProperty('id')
                    })
            })
        })
    })

    describe('DELETE /bookmarks/:id', ()=> {
        context('Given that there are bookmarks in the database', ()=> {
            const testBookmarks = createBookmarks();
    
            beforeEach('insert testBookmarks', () => {
                return db
                    .into('bookmarks_table')
                    .insert(testBookmarks)
            })

            it('DELETE /bookmarks/:id deletes the specified bookmark by ID and returns 204', ()=> {
                const id = 3
                const expectedBookmarks = testBookmarks.filter(bookmark => bookmark.id !== id)
                
                return supertest(app)
                    .delete(`/bookmarks/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(204)
                    .then(()=> 
                        supertest(app)
                        .get('/bookmarks')
                        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedBookmarks)
                        )
            })
        })

        context('Given that there are no bookmarks in the database', ()=> {
            it('DELETE /bookmarks/:id returns a 404', ()=> {
                const id = 23941
                return supertest(app)
                    .delete(`/bookmarks/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404,{error: 'Bookmark not found!'})
            })
        })
    })


    describe('PATCH /bookmarks/:id', ()=> {
        context('Given no data', ()=> {
            it('responds with a 404', ()=> {
                const id = 123456
                return supertest(app)
                    .patch(`/bookmarks/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: `Bookmark not found!`})
            })
        })

        context('Given there is data in the databse', ()=> {
            
            const testBookmarks = createBookmarks()

            beforeEach('insert testBookmarks', ()=> {
                return db  
                    .into('bookmarks_table')
                    .insert(testBookmarks)
            })

            it('responds with 204 and updates the article', ()=> {
                const idToUpdate = 2
                
                const updatedBookmark = {
                    title: 'Sinkly updated', 
                    url: 'https://www.sunkly-updated.com', 
                    description: 'Sinkly updated', 
                    rating: 1
                }

                const expectedBookmark = [{
                    ...testBookmarks[idToUpdate - 1],
                    ...updatedBookmark
                }]

                return supertest(app)
                    .patch(`/bookmarks/${idToUpdate}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(updatedBookmark)
                    .expect(204)
                    .then(res => 
                         supertest(app)
                            .get(`/bookmarks/${idToUpdate}`)
                            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                            .expect(expectedBookmark)
                    )
            })

            it('responds with 400 when no required fields are supplied', ()=> {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/bookmarks/${idToUpdate}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send({ irreleveantField: 'blah blah' })
                    .expect(400, { error: { message: 'Provided fields are invalid!'}})
            })

            it('responds with 204 when updating only a subset of fields', ()=> {
                const idToUpdate = 2
                
                const updatedBookmark = {
                    title: 'Sinkly updated', 
                }

                const expectedBookmark = [{
                    ...testBookmarks[idToUpdate - 1],
                    ...updatedBookmark
                }]

                return supertest(app)
                    .patch(`/bookmarks/${idToUpdate}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send({
                        ...updatedBookmark,
                        fieldToIgnore: 'this should not be in the GET response'
                    })
                    .expect(204)
                    .then(res => 
                         supertest(app)
                            .get(`/bookmarks/${idToUpdate}`)
                            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                            .expect(expectedBookmark)
                    )
            })


        })
    })
})