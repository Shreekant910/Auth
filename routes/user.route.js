const express = require("express");
const userrouter = express.Router();
const db = require("../db/index");
const { userTable , sessionT } = require("../db/schema");
const { randomBytes, createHmac , randomUUID } = require("node:crypto");
const { eq } = require("drizzle-orm");
const jwt = require("jsonwebtoken")
const {requireRole} = require("../middleware/session.middleware")


const adminrestricetedMiddleWare = requireRole('ADMIN');

// route for all admin to access all users

userrouter.get("/allusers",adminrestricetedMiddleWare,async (req,res)=>{

    const allUser = await db.select({
        id:userTable.id,
        name :userTable.name,
        role:userTable.role
    }).from(userTable)

    return res.status(200).json({
        users:allUser
    })
})








userrouter.patch("/update",async (req,res)=>{
    const user = req.user;

    if(!user){
        return res.json({error:'no user found'})
    }
    const {name} = req.body;

    await db.update(userTable).set({name}).where(eq(userTable.id,user.id))
    return res.json({status:' success'})
})






// to get to know the person logged in
userrouter.get("/",adminrestricetedMiddleWare,(req,res)=>{
console.log(" heyy i am here")
    const user = req.user;

    if(!user){
        return res.status(404).json({error: ' UNauthenticated' })
    }
    return res.status(200).json({user})
}); 

//signup
userrouter.post("/signup", async (req, res) => {
  console.log("inside signup route");

  const {id, name, email, password } = req.body;

  const existingUser = await db
    .select({ email: userTable.email })
    .from(userTable)
    .where((table) => eq(table.email, email));

  if (existingUser.length > 0) {
    return res.json({
      error: `email ${email} already exists`,
    });
  }
  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [result] = await db.insert(userTable).values({
    id,
    name,
    email,
    password: hashedPassword,
    salt
  });

  return res.status(201).json({ status: `user created` });
});

//login
userrouter.post("/login",async(req,res)=>{
    console.log("user inside login")
    const {email , password} = req.body
    const [existingUser]= await db.select(
        {id:userTable.id,
        email:userTable.email,
        salt:userTable.salt,
        password:userTable.password,
        role:userTable.role
    }).from(userTable).where((table)=>eq(table.email,email));
console.log(existingUser)

    if(!existingUser){
        return res.status(404).json({message: "Email does not exist"})
    }

    const salt = existingUser.salt;
    const hashedPassword = existingUser.password;
console.log(`hash ${hashedPassword} , salt ${salt}`)
    const newhash = createHmac("sha256",salt).update(password).digest("hex");
    if(newhash!=hashedPassword){
        return res.status(404).json({error:'invalid cred'})
    }

// const sessionId = randomUUID();
//    const result = await db.insert(sessionT).values({
//     id:sessionId,
//   userId: existingUser.id,
// });

payload={
    id: existingUser.id,
    email: existingUser.email,
    name : existingUser.name,
    role: existingUser.role
}

const token = jwt.sign(payload,"secret");


return res.status(200).json({
  success: "user logged in",
//   sessionId,
  token
});

})

module.exports = userrouter;
