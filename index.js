require("dotenv").config()

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const Person = require("./models/person")

app.use(express.static("dist"))
app.use(cors())
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)

  ].join(' ')
}))


app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error=>next(error))
})

app.get("/info", (request, response, next) => {
  Person.find({})
    .then(result=>{
      response.send(`<div>Phonebook has info for ${result.length} people<br/>${String(new Date())}</div>`)
    })
    .catch(error=>next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
  const {id} = request.params
  
  Person.findById(id)
    .then(result => {
      response.json(result)
    })
    .catch(error=>next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  const { id } = request.params
  console.log('deleting', id)

  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()     
    })
    .catch(error=>next(error))

})

app.post("/api/persons", (request, response, next) => {

  const { name, number } = request.body

  if (!(name && number)) {
    response.status(404).json({ error: "missing parameters" })
  } else {
    new Person({ name, number })
      .save()
      .then(result => {
        response.json(result)
      })
      .catch(error=>next(error))
  }

})

app.put("/api/persons/:id", (request, response, next)=>{
  const {id} = request.params
  const {name, number} = request.body
  const person = {name, number}

  Person.findByIdAndUpdate(id, person, {new:true, runValidators:true}) 
    .then(result => {
      if (result) {
        response.json(result)
      } else {
        return response.status(404).json({error: "Not found"})
      }
    })
    .catch(error=>{
      next(error)
    })
}) 

function unknownEnpoint(request, response, next) {
  response.status(404).send({ error: "unknown endpoint" })
}
function errorHandler(error, request, response, next) {
  console.log(error.message);

  if(error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id"})
  } else if (error.name === "ValidationError") {
    return response.status(400).send({error: error.message})
  } 
  next(error)
}

app.use(unknownEnpoint)
app.use(errorHandler)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})

