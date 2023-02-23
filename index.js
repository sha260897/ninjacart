const express=require('express');
const app = express();
const port=4021;

app.use(express.json());



const auth=(req,res,next)=>{
        if(req.headers.authorization){
            const token = req.headers.authorization.split(" ")[1];
            if(token){
                console.log("Token is there");
                next();
            }
            else{
                return res.status(403).json({
                    msg:"Token is not available"
                })
            }
        }
        else{
            return res.status(403).json({
                msg:"Authorization header is missing"
            })
        }
}


const checkUser = (applicableRoles) => {
    return (req,res,next)=>{
        const userRole=req.body.role;
        applicableRoles.forEach((role)=>{
            if(userRole==role){
                return next();
            }
            else{
                return res.status(403).json({
                    msg:"Don't have access to this route"
                })
            }
        })   
    }
}

app.get("/user/:id",auth,checkUser(["Admin","User"]),function(req,res){
    return res.status(200).json({
        msg:"Have access to this route"
    })
})

app.delete("/user",auth,checkUser(["Admin"]),function(req,res){
    return res.status(200).json({
        msg:"Have access to this route"
    })
})




app.listen(port,(err,succ)=>{
    if(err){
        console.log(`Port number is busy ${port}`);
    }
    else{
        console.log("Server is connected");
    }
})