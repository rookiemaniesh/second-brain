import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import connectDB from "./config/db";
import { UserModel } from "./models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {z} from "zod";
import { Auth } from "./middlewares/Auth";
import { contentModel } from "./models/content";

require('dotenv').config()

const app=express();

app.use(express.json());
const UserSchema=z.object({
    userName:z.string()
    .min(5,"Username should be Minimum of 5 letters")
    .max(15,"Username Should not exceeds 20 letters"),

    password:z.string()
    .min(8,"Length Should Be Atleast 9")
    .max(20,"Password Too Long")
    .regex(/[A-Z]/,"Must Contain Atleast One Upperase ")
    .regex(/[a-z]/,"Must Contain Atleast One Lowercase")
    .regex(/[0-9]/,"Must Contain Atleast One Number")
    .regex(/[\W_]/,"Must Contain Atleast One Special Character")
})

app.get("/",(req: Request,res:Response)=>{
    res.json({
        message:"Hello"
    })
})

app.post("/signup",async(req: Request,res:Response,next:NextFunction)=>{
    const parseResult=UserSchema.safeParse(req.body);
    if(!parseResult.success){
         res.status(400).json({
            message:"Validation Error",
            errors:parseResult.error.flatten().fieldErrors
        })
    }else{
        const {userName,password}=parseResult.data;
        // const userName=req.body.userName;
        // const password=req.body.password;
        const ExistingUser = await UserModel.findOne({userName})
        if(ExistingUser){
             res.status(404).json({message:"userName Already Exists"})
        }
        try {
            const hashedPassword= await bcrypt.hash(password.toString(),10)
           await UserModel.create({
                userName:userName,
               password: hashedPassword
            })
            const token=jwt.sign({userName},"manishdon")
            res.status(200).json({
                token,
                message:"Account created succesfully"
            })
            
        } catch (error) {
            res.status(404).json({message:"Something went Wrong"})
            console.log(error)
        }

    }


})
app.post("/sigin",async(req:Request,res:Response)=>{
   const {userName,password}=req.body;
   const validUser=await UserModel.findOne({userName})
   if(!validUser){
       res.json({
           message:"User Not Found"}) 
           return
}
const isPasswordValid=await bcrypt.compare(password,validUser.password.toString())
if(!isPasswordValid){
    res.status(400).json({
        message:"Invalid Password"
    })
    return
}
const token=jwt.sign({userName},"manishdon")
res.status(200).json({
    token,
    message:"Login Successfull"
})

})
app.post("/content",Auth,async(req:Request,res:Response)=>{
    const user=req.body.user.userName;
   
   
   
    const{link,tags,title,type}=req.body
    try {
        
        await contentModel.create({
            userName:user,
            link,
            title,
            tags,
            type
        })
        res.json({
            message:"Added"
        })
    } catch (error) {
        res.json({
            message:"Something Went Wrong"
        })
        console.log(error)
    }

})
app.get("/content",Auth,async(req:Request,res:Response)=>{
    const userName=req.body.user.userName;
    const content=await contentModel.find({userName:userName})
    console.log(content);
    res.json({
        content
    })
})
app.delete("/delete/:id",Auth,async(req,res)=>{
    const {id}=req.params
    try{
        const DeletedContent=await contentModel.findOneAndDelete({_id:id});
        if(!DeletedContent){
            res.status(500).json({
                message:"Item not found"
            })
            return
        }
        else{
            res.status(200).json({
                message:"Deleted"
            })
        }

    }catch(e){
        res.status(500).json({message:"Something Went Wrong"})
        console.log(e)
    }
})

connectDB().then(()=>{
    app.listen(3000,()=>{
        console.log("Running on port 3000")
    })
})