import mongoose, { Document, model } from "mongoose";
import { Schema } from "mongoose";
export interface Iuser extends Document{
    userName: String,
    password:String
}
const UserSchema= new Schema<Iuser>({
  
        userName:{type:String,},
        password:{type:String,required:true}
    
})
export const UserModel= model<Iuser>("User",UserSchema);

