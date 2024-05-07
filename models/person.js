
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

mongoose.connect(process.env.URI)
    .then(response => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.log("Error connecting to MongoDB");
    })


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

    }
})

module.exports = new mongoose.model("Person", personSchema)