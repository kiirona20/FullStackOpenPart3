const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')

morgan.token('body', function (req) 
{ return JSON.stringify(req.body) })


const assignBody = (request, response, next) => {
    request.body
    next()
}

app.use(assignBody)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
      name: "Ada Lovelace",
      number: "123",
      id: "2"
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: "3"
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: "4"
    }
  ]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
    
  })
    
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })


app.get('/info', (request, response) => {
    const currentTime = new Date();
    console.log((currentTime))
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${currentTime}</p>`

    )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()

})
const generateId = () => {
    const randomID = Math.random(10000000)
    return String(randomID)
  }

app.post('/api/persons', (request, response) => {
    const body = request.body
    const duplicateName = persons.find(person => person.name === body.name)

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
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
    morgan.token('type', function (request, response) { return req.headers['content-type'] })

})
  
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
