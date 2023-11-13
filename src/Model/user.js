import mongoose from "mongoose";
const mongoSchema=mongoose.Schema({
    FullName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    }
});
export const User = new mongoose.model("user", mongoSchema);
const msgSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Phone:{
        type:Number,
        required:true
    },
    Message:{
        type:String,
        required:true
    }
});
export const Msg=new mongoose.model("message",msgSchema);
const serviceSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Service:{
        type:String,
        enum:["Rest APIs","Custome Website","CoinMarketCap","Single Page Website","Rest API with JWT"],
        required:true
    },
    Requirement:{
        type:String,
        required:true
    }
});
export const Service=new mongoose.model("service",serviceSchema);