const uuid = require('uuid/v4')

const bookmarks = [
    { id: 'de9a0b51-93c6-4109-bf3d-42ae4f32bb2d',
      title: 'Thinkful',
      url: 'https://www.thinkful.com',
      description: 'Think outside the classroom',
      rating: 5 },
    { id: uuid(),
      title: 'Google',
      url: 'https://www.google.com',
      description: 'Where we find everything else',
      rating: 4 },
    { id: uuid(),
      title: 'MDN',
      url: 'https://developer.mozilla.org',
      description: 'The only place to find web documentation',
      rating: 5 },
]

module.exports = bookmarks