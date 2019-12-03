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

function createXSS(){
    const xssBookmark = {
        id: 911,
        title: `This is an XSS bookmark <script>alert('you got hacked nigga')</script>`,
        url: 'http://www.xss.com',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie)">`,
        rating: 1
    }
    
    const sanitizedBookmark = {
        id: 911,
        title: `This is an XSS bookmark &lt;script&gt;alert(\'you got hacked nigga\')&lt;/script&gt;`, 
        url: 'http://www.xss.com',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist">`,
        rating: 1
    }
    
    return {
        xssBookmark,
        sanitizedBookmark
    }
}

module.exports = {
    createBookmarks,
    createXSS
}