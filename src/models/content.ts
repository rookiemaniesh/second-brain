import { model, Schema } from "mongoose";

const contentSchema=new Schema({
    userName:String,
    type:{type:String,required:true},
    link:{type:String},
    title:{type:String,required:true},
    tags:[String]

})
export const contentModel=model("content",contentSchema)