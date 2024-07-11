const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

var morgan = require('morgan')

app.use(express.static('dist'))

morgan.token('body', function (req) 
{ return JSON.stringify(req.body) })

const assignBody = (request, response, next) => {
    request.body
    next()
}
app.use(assignBody)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const errorHandler = (error, requst, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
}

const cors = require('cors')
app.use(cors())
app.use(express.json())

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  

let people = [

]


app.get('/api/people', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
      })    
  })
    
app.get('/api/people/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(400).end()
        }
    })
    .catch(error => next(error)) 

  })


app.get('/info', (request, response) => {
    const currentTime = new Date();
    Person.find({}).then(people => {
        console.log((currentTime))
        response.send(`<p>Phonebook has info for ${people.length} people</p>
            <p>${currentTime}</p>`

    )
})
})

app.delete('/api/people/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


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

app.put('/api/people/:id', (request, response, next) => {
    const body = request.body
    console.log("body")
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true})
    .then(updatedNote => {
        response.json(updatedNote)
    })
    .catch(error => next(error))

})

  
app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
