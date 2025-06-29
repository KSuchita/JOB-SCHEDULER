const mongoose = require("mongoose");

const jobDescriptionSchema=new mongoose.Schema({
    joblevel:{
        type:String,
        required:true
    },
    experience:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    }
},{"strict":"throw"})


const JobSchema=new mongoose.Schema({
    jobId:{
        type:String,
        required:true
    },
    company:{
        type: String,
        required: true,
    },
    jobtype:{
        type: String,
        required: true,
    },
    domain:{
        type: String,
    },
    jobinfo:jobDescriptionSchema,
    dateOfCreation: {
        type: String,
        required: true
    },
    dateOfModification: {
        type: String,
        required: true
    },
    isJobActive: {
        type: Boolean,
        required: false
    }
},{"strict":"throw"})

const Job=mongoose.model('job',JobSchema)

module.exports=Job;