const mongoose = require('mongoose')
require('dotenv').config()

// const password = process.argv[2]
// const name = process.argv[3]
// const number = process.argv[4]

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
    },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: v => {
        return /^(?:\d{2,3}-\d{6,})/.test(v)
    },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, "User phone number required!"]
    }
})

// if (process.argv.length == 3) {
//     console.log("phonebook:")
//     PhoneBook.find({}).then(
//         persons => {
//             persons.forEach(
//                 contact => {
//                 console.log(`${contact.name} ${contact.number}`)
//                 })
//             mongoose.connection.close()
//         }
//     )
// }

// if (process.argv.length == 5) {
//     PhoneBook.insertMany([
//         {name,number}
//     ]).then(result => {
//       console.log(`added ${name} number ${number} to phonebook`)
//     })
// }

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model("PhoneBook", phoneBookSchema)
