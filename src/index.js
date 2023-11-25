import express  from "express";
import './DB/conn.js'
import {User} from './Model/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {Msg} from './Model/user.js'
import {Service} from './Model/user.js'
import { authToken } from "./middleware/auth.js";
import './middleware/auth.js'
import cors from 'cors'
const jwtSecret="BA45BL5U456"
const app=express();
const port=process.env.PORT || 3000
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // This allows cookies and headers with credentials
  optionsSuccessStatus: 204,
  allowedHeaders: 'Authorization,Content-Type',  // Include any other headers you are using
}));

app.get("/user",authToken,async(req,res)=>{
    const id=req.user.user.id
    const result=await User.findOne({_id:id})
    if(!result){
        return res.status(404).json({ errors: [{ msg: 'Invalid token' }] });
    }
res.status(200).send(result)

});

app.post("/signup",async(req,res)=>{
    try{
        const{name,email,username,password} =req.body
        if(name== undefined||name== null||name==  "" &email== undefined||email== null||email==  ""&username== undefined||username== null||username==  "" &password== undefined||password== null||password==  "" ){
            res.status(400).send({message:"Bed Request"})
        }
        else{
            const hpass= await bcrypt.hash(password,10);
        const result=User({
            FullName:name,
            Email:email,
            username:username,
            password:hpass
        });
        const insertData= result.save();
        // res.status(201).json({ message: 'Signup Successfully' });

        const payload = {
            user: {
                id:insertData._id 
            }
        };
        jwt.sign(payload,jwtSecret,{expiresIn:'1h'},(err,token)=>{
            if(err) throw err
            res.status(201).send({token})
            // res.cookie("jwt-Token",token).status(201).json({message:"signup successfully"})
        })
        }
    }catch(e){
        
        res.status(404).json({ message:"An error occurred during Signup"});
    }
})
app.post("/login",async(req,res)=>{
    try{
        const {username,password} =req.body;
        if(username== undefined||username== null||username==  "" &password== undefined||password== null||password==  ""){
            res.status(400).send({message:"Bed Request"})
        }
        else{
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
            // res.cookie("jwt-Token",token,{maxAge:100000});
            res.status(201).send({token})
        })
        }
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
