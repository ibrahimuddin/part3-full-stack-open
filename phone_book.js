require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.static('dist'))
app.use(cors())

const PORT = process.env.PORT || 3001

const PhoneBook = require('./models/phone_book')

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
      "number": "12-12-22111"
    }
]
// GET requests
app.get('/api/persons', (request,response) => {
  PhoneBook.find({}).then(persons =>
      response.json(persons)
  )
})
// next is for the error handler to handle the error
app.get('/api/persons/:id', (request, response, next) => {
  PhoneBook.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (request,response) => {
  date_request = new Date(Date.now()).toString()
  PhoneBook.countDocuments({})
    .then(count => {
    response.send(`<h3<h3>Phonebook has info for ${count} people</h3>
                    <h4>${date_request}</h4>`)
  })
})

// DELETE requests
app.delete('/api/persons/:id', (request,response) => {
  PhoneBook.findByIdAndDelete(request.params.id).then(person => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

// POST requests
app.post('/api/persons', (request,response) => {
  const body = request.body

  // PhoneBook.find({ 'name': body.name }).then(person =>
  //   response.status(400).send("name already exists")
  // )
  // PhoneBook.find({ 'number': body.number }).then(person =>
  //   response.status(400).send("number already exists")
  // )
  const person = new PhoneBook({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// middleware for handling errors. 
const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({error : 'malformatted id'})
  }
  next(error)
}

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})