const mongoose = require("mongoose")

const numberOfArgs = process.argv.length

if (numberOfArgs == 2) {
    console.log("You must give a password.")
    process.exit(1)
} 

const url = process.env.URI
mongoose.set("strictQuery", false)
mongoose.connect(url)

const schema = new mongoose.Schema({
    name: String,
    number: String,
})

const model = mongoose.model("Person", schema)

if (numberOfArgs == 3) {
    console.log("phonebook:");
    model
        .find({})
        .then(persons => {
            persons.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })    
} else {
    const note = new model({
        name: process.argv[3],
        number: process.argv[4],
    })
    note
        .save()
        .then(result => {
            console.log("added", result.name, "number", result.number, "to phonebook");
            mongoose.connection.close()
        })
}
