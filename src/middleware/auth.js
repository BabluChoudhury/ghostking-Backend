import jwt from 'jsonwebtoken';
const jwtSecret="BA45BL5U456";
export function authToken(req,res,next){
    const token=req.header('Authorization');
    if(!token){
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    jwt.verify(token,jwtSecret,(err,result)=>{
        if(err){
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
       req.user=result
       next();
    })
}