import mongoose from "mongoose";

const connnectDB = async() =>{

    mongoose.connection.on("connected",()=>{
        console.log("MongoDB Connected...")
    })
    
    await mongoose.connect(`${process.env.MONGODB_URI}/imagify`)
}

export default connnectDB;