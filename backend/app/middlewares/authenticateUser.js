const jwt = require('jsonwebtoken');

const authenticateUser = (req,res,next)=>{
    const token = req.headers['authorization'];
    if(!token){
        return res.status(401).json({error:'token not provided'});
    }
    try{
        let tokenData = jwt.verify(token,'secret@123');
        console.log('token data',tokenData);
        req.userId = tokenData.userId;
        next();
    }catch(err){
        return res.status(401).json({error:err.message});
    }
}
module.exports = authenticateUser;