
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async(req,res,next)=>{
    try{
       
       const token =  req.header("Authorization").replace("Bearer ","");
        console.log(token);
    
    //    checking token is available or not
       if(!token){
        res.status(401).json({
            success:false,
            message:"Token not found"
        })
       }

    //    verifying token
        try{

            const payload  = jwt.verify(token,process.env.JWT_SECRET_KEY);
            
            console.log(payload);
        
            req.user = payload;
        }catch(err)
        {
            res.status(401).json({
                        success:false,
                        message:'token is invalid',
            })
        } 
        next();

    }
    catch(err)
    {
        res.status(500).json({
            success:false,
            message:"Internal server error in auth",
            error:err.message,
        });
    }

};

exports.isstudent =  (req,res,next)=>{
  try{  
    if(req.user.role !== "Student"){
       return  res.json({
            message:"access denied it is a controlled route for students",
            success:false
        })
    }
    }
    catch(err){
   return  res.status(500).json({
        success:false,
        message:"Internal server error in isStudent"
        });
    }       
    next();
};


exports.isDeen = (req,res,next)=>{
    try
    {
        if(req.user.role !== "Dean")
        {
           return res.json({
                    message:"access denied it is a controlled route for Dean",
                    success:false
                     })
        }
    }catch(err)
    {
       return res.status(500).json({
            success:false,
            message:"Internal server error in isDean "
        });
    }

    next();
};