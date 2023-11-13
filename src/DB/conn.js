import mongoose from "mongoose";
mongoose.connect("mongodb+srv://ghostking:bablu@cluster0.w40lgu9.mongodb.net/ghostking?retryWrites=true&w=majority")
.then(()=>{
    console.log("Connected");
})
.catch((e)=>{
    console.log("Not Connected");
});