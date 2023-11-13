import express  from "express";
import './DB/conn.js'
import {User} from './Model/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {Msg} from './Model/user.js'
import {Service} from './Model/user.js'
import { authToken } from "./middleware/auth.js";
import './middleware/auth.js'
const jwtSecret="BA45BL5U456"
const app=express();
const port=process.env.PORT || 3000
app.use(express.json());
app.get("user",authToken,(req,res)=>{
   const{user,pass}= req.query
});
app.get("user",authToken,)
app.post("/signup",async(req,res)=>{
    try{
        const{name,email,username,password} =req.body
        const hpass= await bcrypt.hash(password,10);
        const result=User({
            FullName:name,
            Email:email,
            username:username,
            password:hpass
        });
        const insertData= result.save();
        res.status(201).json({ message: 'Signup Successfully' });

        const payload = {
            user: {
                id:insertData._id 
            }
        };
        jwt.sign(payload,jwtSecret,{expiresIn:'1h'},(err,token)=>{
            if(err) throw err
            res.status(201).send({token})
        })
    }catch(e){
        
        res.status(404).json({ message:"An error occurred during Signup"});
    }
})
app.post("/login",async(req,res)=>{
    try{
        const {username,password} =req.body;
        const result=await User.findOne({username})
        if(!result){
            return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        const isValidPassword= await bcrypt.compare(password,result.password);
        if(!isValidPassword){
            return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        const payload = {
            user: {
                id: result._id 
            }
        };
        jwt.sign(payload, jwtSecret,{expiresIn:'1h'},(err,token)=>{
            if(err) throw err;
            res.status(201).send({token})
        })
    }catch(e){
        res.status(404).json({ message:"An error occurred during login"});
    }
})
app.post("/contact",async(req,res)=>{
    try{
        const {name,email,phone,message}=req.body
        const result=Msg({
            Name:name,
            Email:email,
            Phone:phone,
            Message:message
        })
        const insertMsg=await result.save();
        res.status(201).json({ message: 'Message send' });
    }catch(e){
        res.status(404).json({ message: 'An error occurred during Message' });
    }
})
app.post("/services",async(req,res)=>{
    try{
        const {name,email,service,requirement}=req.body
        const result=Service({
            Name:name,
            Email:email,
            Service:service,
            Requirement:requirement
        })
        const data=await result.save();
        res.status(201).json({ message: 'Request send' });
    }catch(e){
        res.status(404).json({ message: 'An error occurred during Request'+e });
    }
    
})
app.listen(port,()=>{
    console.log(`server run at http://localhost:${port}`)
})