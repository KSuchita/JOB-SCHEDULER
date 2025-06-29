const mongoose = require("mongoose");

//define User or Author schema
const EmployerSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
       // required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    profileImageUrl: {
        type: String,

    },
    isActive: {
        type: Boolean,
        default: true
    },
    position:{
        type: String,
        //required:true,
    },
    company:{
        type: String,
        //required: true,
    },
}, { "strict": "throw" })


//create model for user author schema
const Employer = mongoose.model('employer', EmployerSchema)

//export
module.exports = Employer;