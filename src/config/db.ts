import mongoose from "mongoose";

 const connectDB = async():Promise<void>=>{
    try {
        const con=await  mongoose.connect("mongodb+srv://imh1001523:q4lBsyQJVjIGAMzm@cluster0.gyicou3.mongodb.net/second-brain");
        console.log("Mongoose Connection Established${con.connection.name}");
    } catch (error) {
        console.log("Mongoose Connection Error",error);
    }
 }
 export default connectDB;