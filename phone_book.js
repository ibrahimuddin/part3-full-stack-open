require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.static('dist'))
app.use(cors())

const PORT = process.env.PORT || 3001

const PhoneBook = require('./models/phone_book')

app.get('/api/persons', (request,response) => {
  PhoneBook.find({}).then(persons =>
      response.json(persons)
  )
})

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

app.delete('/api/persons/:id', (request, response) => {
  PhoneBook.findByIdAndDelete(request.params.id).then(person => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

// app.post('/api/persons', (request,response) => {
//   const body = request.body
  
//   // check if phonebook entry exists
//   PhoneBook.findOne({ name: body.name }).then(person => {
//     console.log(person)
//     if (person) {
//       PhoneBook.findByIdAndUpdate(person.id, {name : body.name, number : body.number}, {new: true})
//       .then(updatedPerson => {
//         return response.json(updatedPerson)
//       })
//     }
    // const newPerson = new PhoneBook({
    //   name: body.name,
    //   number: body.number
    // })
    // newPerson.save().then(savedPerson => {
    //   return response.json(savedPerson)
    // })
//   })
  
// })

app.post(`/api/persons`, (request, response) => {
  const { name, number } = request.body
  PhoneBook.findOneAndUpdate(
      { "name": name },
      { $set: { "name": name, "number": number } },
      { new : true}
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        return response.json(updatedPerson)
      }
      else {
        const newPerson = new PhoneBook({
          name: name,
          number: number
        })
        newPerson.save().then(savedPerson => {
          return response.json(savedPerson)
        })
      }
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