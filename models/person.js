
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
    name: {
        type:String,
        minLength:3,
        required:true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d+$/.test(v) && v.length >= 8

            },
            message: props => `${props.value} is not a valid phone number.`
        },
        required:true

    }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

    }
})


const model = new mongoose.model("Person", personSchema)


module.exports = model