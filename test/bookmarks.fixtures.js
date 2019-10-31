function createBookmarks() {
    return [    {
        id: 1,
        title: 'Thinkful', 
        url: 'https://www.thinkful.com', 
        description: 'Think outside the classroom', 
        rating: 5},
    { 
        id: 2,
        title: 'Sinkly', 
        url: 'https://www.sunkly.com', 
        description: 'Sink with the skink', 
        rating: 3},
    {
        id: 3,
        title: 'Google', 
        url: 'https://www.Google.com', 
        description: 'Take over the world', 
        rating: 5},
    {
        id: 4,
        title: 'MDN', 
        url: 'https://www.mdn.com', 
        description: 'Web documentation', 
        rating: 3},
    ]
}

module.exports = {
    createBookmarks
}