const db = require("../db/index");
const { userTable , sessionT } = require("../db/schema");
const { eq } = require("drizzle-orm");
const jwt = require('jsonwebtoken')


const sessionMiddle = async (req,res,next)=>{
    try {
        console.log("inside session middleware")
        const sessionId = req.headers['session-id'];
         if(!sessionId){
            return next()
        }
         const [data] = await db.select({
            id: userTable.id,
            sessionId: sessionT.id,
            name: userTable.name,
            email: userTable.email
        }).from(sessionT)
        .innerJoin(userTable, eq(userTable.id, sessionT.userId))
        .where(eq(sessionT.id, sessionId));

         if(!data){
            return next()
        }
        req.user = data;
         next();

        
        
    } catch (error) {
        console.error("Session middleware error:", error);
        return next();
    }
}

module.exports = sessionMiddle