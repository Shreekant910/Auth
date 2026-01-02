const express = require("express");
const userroute = require("./routes/user.route")
const sessionMiddle = require("./middleware/session.middleware")
const app = express();
app.use(express.json());

app.use('/user',sessionMiddle,userroute)


app.get('/checking',(req,res)=>{
 return res.json({message:"runninggg"})
})

const PORT = process.env.PORT ?? 8000;

app.listen(PORT,()=>{
    console.log(`running on port ${PORT}`)
})