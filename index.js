const express = require('express')
const app = express()
require('dotenv').config()

var morgan = require('morgan')
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', function (req) 
{ return JSON.stringify(req.body) })


const assignBody = (request, response, next) => {
    request.body
    next()
}

app.use(assignBody)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
const Person = require('./models/person')

let people = [

]


app.get('/api/people', (request, response) => {
    console.log(Person)
    Person.find({}).then(people => {
        console.log(people)
        response.json(people)
      })    
  })
    
app.get('/api/people/:id', (request, response) => {
    const id = request.params.id
    
    Person.findById(request.params.id).then(person => {
        response.json(person)
    }) 

  })


app.get('/info', (request, response) => {
    const currentTime = new Date();
    console.log((currentTime))
    response.send(`<p>Phonebook has info for ${people.length} people</p>
        <p>${currentTime}</p>`

    )
})

app.delete('/api/people/:id', (request, response) => {
    const id = request.params.id
    people = people.filter(person => person.id !== id)
    response.status(204).end()

})
/*const generateId = () => {
    const randomID = Math.random(10000000)
    return String(randomID)
  }*/

app.post('/api/people', (request, response) => {
    const body = request.body
    const duplicateName = people.find(person => person.name === body.name)

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
    else if (duplicateName){
        return response.status(400).json({ 
            error: 'name must be unique'  
          })
    }
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    morgan.token('type', function (request, response) { return req.headers['content-type'] })

})
  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
