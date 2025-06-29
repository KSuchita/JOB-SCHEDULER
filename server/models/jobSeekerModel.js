const mongoose = require("mongoose");

//define User or Author schema
const jobSeekerSchema = new mongoose.Schema({
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
    resumeUrl: {
        type: String,
    }
}, { "strict": "throw" })


//create model for user author schema
const JobSeeker = mongoose.model('jobseeker', jobSeekerSchema)

//export
module.exports = JobSeeker;