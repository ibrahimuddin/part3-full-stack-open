const express = require('express')
const app = express()

let numbers = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/numbers', (request,response) => {
    response.json(numbers)
})

app.get('/info', (request,response) => {
    date_request = new Date(Date.now()).toString()
    response.send(`<h3>Phonebook has info for ${numbers.length} people</h3>
                    <h4>${date_request}</h4>`)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})