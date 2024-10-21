const express = require('express')
const app = express()

let persons = [
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
    },
    {
      "id" :"5",
      "name": "incorrect user",
      "number": "12-12-222111"
    }
]

// GET requests
app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request,response) => {
  get_user = persons.find(({id}) => id === request.params.id)
  if(get_user){
    response.json(get_user)
  }else{
    response.status(404).send("User not found")
  }  
})

app.get('/info', (request,response) => {
    date_request = new Date(Date.now()).toString()
    response.send(`<h3>Phonebook has info for ${persons.length} people</h3>
                    <h4>${date_request}</h4>`)
})

// DELETE requests
app.delete('/api/persons/:id', (request,response) => {
  response.send('delete req called')
  persons = persons.filter(person => person.id!==request.params.id)
  response.status(204).end()
})

app.use(express.json())

// POST requests
app.post('/api/persons', (request,response) => {
  const randomId = Math.floor(Math.random() * 1000000000000)

  get_user = persons.find(({id}) => id === randomId)
  if (!get_user){
    const person = request.body
    person.id = String(randomId)
    persons = persons.concat(person)
    response.json(person)
  }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})