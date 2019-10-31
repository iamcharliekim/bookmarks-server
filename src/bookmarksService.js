const BookmarksService = {
    getBookmarks(knex){
        return knex
            .from('bookmarks_table')
            .select('*')

    },

    getBookmarksById(knex, id){
        return knex
            .from('bookmarks_table')
            .select('*')
            .where('id', id)
    },

    insertBookmarks(knex, bookmark){
        return knex
            .insert(bookmark)
            .into('bookmarks_table')
            .returning('*')
            .then(response => {
                return response[0]
            })


    },

    deleteBookmarks(knex, id){

    },

    updateBookmarks(knex, id){

    }

}

module.exports = {
    BookmarksService
}