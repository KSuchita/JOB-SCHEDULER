const exp=require("express")
const JobSeeker=require("../models/jobSeekerModel")
const jobseekerApp=exp.Router()
const JobSeekerModel=require("../models/jobSeekerModel")
const expressAsyncHandler=require("express-async-handler")
const JobModel=require("../models/jobModel")



//read all jobs
jobseekerApp.get('/job',expressAsyncHandler(async (req, res) => {
    //read all jobs from db
    const listOfJobs = await JobModel.find({ isJobActive: true });
    res.status(200).send({ message: "jobs", payload: listOfJobs })
}))
jobseekerApp.get('/job', expressAsyncHandler(async (req, res) => {
    try {
        const listOfJobs = await JobModel.find({ isJobActive: true });
        if (listOfJobs.length === 0) {
            console.log("No active jobs found.");
            return res.status(404).send({ message: "No active jobs found" });
        }
        
        res.status(200).send({ message: "Jobs", payload: listOfJobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).send({ message: "Error fetching jobs", error: error.message });
    }
}));


jobseekerApp.post("/jobseeker",expressAsyncHandler( async(req,res)=>{
    const newJobSeeker=req.body;
    const JobSeekerInDb=await JobSeekerModel.findOne({email:newJobSeeker.email})
    if(JobSeekerInDb!==null){
        if(newJobSeeker.role===JobSeekerInDb.role){
            res.status(200).send({message:newJobSeeker.role,payload:JobSeekerInDb})
        }
        else{
            res.status(200).send({message:"Invalid Role"})
        }
    }
    else{
        let newJobSeekers=new JobSeekerModel(newJobSeeker)
        let newJobSeekerDoc=await newJobSeekers.save()
        res.status(201).send({message:newJobSeekerDoc.role,payload:newJobSeekerDoc})
    }
}))


module.exports=jobseekerApp;