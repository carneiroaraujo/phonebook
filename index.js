const express = require('express')
const app = express()
app.use(express.json())
const PORT = 3001

let entries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/api/persons', (request, response)=>{
    response.json(entries)
})

app.get("/info", (request, response)=>{
  response.send(`<div>Phonebook has info for ${entries.length} people<br/>${String(new Date())}</div>`)
})

app.get("/api/persons/:id", (request, response)=>{
  console.log("Hello");
  const {id} = request.params
  if (!id) {
  }

  const entry = entries.find(entry=>entry.id==id)
  if (entry) {
    response.json(entry)
  } else {
    response.status(404).end()
  }

})
app.delete("/api/persons/:id", (request, response)=>{
  const {id} = request.params
  console.log('deleting', id)

  entries = entries.filter(entry=>entry.id!=id)
  response.status(204)
})
app.post("/api/persons", (request, response)=>{
  
  const {name, number} = request.body

  if (! (name && number)) {
    response.status(404).json({error:"missing parameters"})
  }

  const duplicate = entries.find(entry=>entry.name==name)
  if (duplicate) {
    response.status(409).json({error: "name must be unique"})
  }

  entries.push({name, number, id:Math.floor(Math.random()*1e15)})
  console.log("ok");
  response.status(204).end()
})



app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})

