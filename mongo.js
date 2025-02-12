const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.f9xp1.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String
})

const PhoneBook = mongoose.model("PhoneBook", phoneBookSchema)

const arto = new PhoneBook({
    name: "Arto Hellas",
    number: "040-123456"
})

if (process.argv.length == 3) {
    console.log("phonebook:")
    PhoneBook.find({}).then(
        persons => {
            persons.forEach(
                contact => {
                console.log(`${contact.name} ${contact.number}`)
                })
            mongoose.connection.close()
        }
    )
}

if (process.argv.length == 5) {
    PhoneBook.insertMany([
        {name,number}
    ]).then(result => {
      console.log(`added ${name} number ${number} to phonebook`)
    })
}
