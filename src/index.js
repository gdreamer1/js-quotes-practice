document.addEventListener('DOMContentLoaded', () => {
    fetchQuotes()
})

function fetchQuotes() {
    fetch('http://localhost:3000/quotes?_embed=like')
    .then(quotes => quotes.json())
    .then(quotes => renderQuotes(quotes))
    .catch(error => console.log('Error: ', error))
}

function createQuote(event) {
    event.preventDefault()

    const newQuoteForm = document.getElementById('new-quote-form')

    let quote = {}

    Array.from(newQuoteForm.children).forEach(field => {
        console.log('Field is: ', field)
        if (field.name === 'quote') {
            quote.quote = field.value
        }

        if (field.name === 'author') {
            quote.author = field.value
        }
    })
    
    fetch('http://localhost:3000/quotes', {
        headers: {
            "content-type": 'application/json',
            accepts: 'application/json'
        },
        body: JSON.stringify({quote}),
        method: 'POST'
    }).then(quoteResp => {
        console.log('Created quote: ', quoteResp)
        fetchQuotes()
    }).catch(error => {
        console.log('Error creating quote: ', error)
    })
}

function fetchLikes(quoteId) {
    return fetch(`http://localhost:3000/likes?quoteId=${quoteId}`)
    .then(likes => likes.json())
    .then(likes => likes)
    .catch(error => 'No likes available')
}

function renderQuotes(quotes) {
    console.log('Quotes: ', quotes)
    const quotesList = document.getElementById('quote-list')

    while (quotesList.firstChild) {
        quotesList.removeChild(quotesList.firstChild);
    }

    if (quotes.forEach) {
        quotes.forEach(async quote => {
            const li = document.createElement('li')
            const quoteSpan = document.createElement('span')
            quoteSpan.innerHTML = quote.quote + '</br>'

            const authorSpan = document.createElement('span')
            authorSpan.innerHTML = quote.author + '</br>'

            const likes = await fetchLikes(parseInt(quote.id))

            const likesSpan = document.createElement('span')
            likesSpan.innerHTML = "Likes: " + likes.length + '</br>'

            const deleteButton = document.createElement('button')
            deleteButton.id = JSON.stringify(quote)
            deleteButton.innerHTML = 'Delete' 
            deleteButton.onclick = deleteQuote

            li.appendChild(quoteSpan)
            li.appendChild(authorSpan)
            li.appendChild(likesSpan)
            li.appendChild(deleteButton)

            quotesList.appendChild(li)
        })
    } else {
        const li = document.createElement('li')
        li.innerHTML = quotes
        quotesList.appendChild(li)
    }
}

function deleteQuote(event) {
    event.preventDefault()
    const quoteToDeleteId = JSON.parse(event.target.id);

    fetch('http://localhost:3000/quotes', {
        headers: {
            "content-type": 'application/json',
            accepts: 'application/json'
        },
        body: JSON.stringify({quoteToDeleteId}),
        method: 'DELETE'
    }).then(quotes => quotes.json())
    .then(quotes => renderQuotes(quotes))
    .catch(error => renderQuotes('Error fetching quotes'))
    
}

const newQuoteForm = document.getElementById('new-quote-form')
newQuoteForm.addEventListener('submit', createQuote)