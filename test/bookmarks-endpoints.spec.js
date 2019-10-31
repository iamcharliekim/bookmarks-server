const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { createBookmarks } = require('./bookmarks.fixtures')

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

    describe.only('POST /bookmarks', () => {

            it('POST /bookmarks responds with a 201 and creates/returns the new article', ()=> {
                const newBookmark = {
                    title: 'NEW BOOKMARK',
                    url: 'www.NEWBOOKMARK.com',
                    description: 'test: new bookmark',
                    rating: 3
                }
    
                return supertest(app)
                    .post('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newBookmark)
                    .expect(201)



            })

            
        
        
    })
})