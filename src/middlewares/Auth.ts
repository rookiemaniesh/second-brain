import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function Auth(req:Request,res:Response,next:NextFunction){
    const {token}=req.body;
    if(!token){
        res.json({
            message:"Sign In First"
        })
    }
    try {
        const decodedUser=jwt.verify(token,"manishdon")
        req.body.user=decodedUser;
        next();
    }catch(err){
         res.status(401).json({
            message:"Invalid Token"
        })
        return
    }
  
    
}