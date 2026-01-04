const db = require("../db/index");
const { userTable , sessionT } = require("../db/schema");
const { eq } = require("drizzle-orm");
const jwt = require('jsonwebtoken')


const sessionMiddle = async (req,res,next)=>{
    try {
        console.log("inside session middleware")
        // const sessionId = req.headers['session-id'];
        //  if(!sessionId){
        //     return next()
        // }
        //  const [data] = await db.select({
        //     id: userTable.id,
        //     sessionId: sessionT.id,
        //     name: userTable.name,
        //     email: userTable.email,
        //     role:userTable.role
        // }).from(sessionT)
        // .innerJoin(userTable, eq(userTable.id, sessionT.userId))
        // .where(eq(sessionT.id, sessionId));

        //  if(!data){
        //     return next()
        // }
        // req.user = data;
        //  next();

         const tokenHeader = req.headers['authorization']
        if(!tokenHeader){
            return next()
        }
        if(!tokenHeader.startsWith('Bearer')){
            return res.status(400).json({error:'auth header must be bearer'})
        }
       
       const token = tokenHeader.split(' ')[1];

       const decoded = jwt.verify(token,"secret")
    console.log("debugging decoded",decoded);
       req.user= decoded;
       next();
        
        
    } catch (error) {
        console.error("Session middleware error:", error);
        return next();
    }
}

// New middleware for role-based access (e.g., admin only)
const requireRole = function (role) {
    return function(req,res,next){
        if (req.user.role != role){
          return res.status(401).json({error:"you are not authorized here"}) 
        }

return next();
    }
     
};

module.exports = { sessionMiddle, requireRole };