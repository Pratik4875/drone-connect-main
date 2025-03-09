const jwt = require("jsonwebtoken");
const {get_db} = require("../Utils/MongoConnect.js")
const sendResponse = require("../Utils/SendResponse.js")

const reqAuth = (req, res, next) => {
  try {
    let token;
    
    if (req.cookies && req.cookies["token"]) {
      token = req.cookies["token"];
      //console.log("cookie");
      
    } else {
      token = req.headers.authorization?.split(" ")[1];
    }


    if (!token || token === undefined) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this resource" });
    }

    // token = token.match(/(?<=Bearer\s*)\S+/)[0];
    //console.log("Token is: ", token);

    let result = jwt.verify(token, process.env.JWT_SECRET);

    if (result) {
      //console.log(result)
      let email = result.data.split("?")[0];
      req.user_email = email;
        console.log("Request authorized")
      next();
    } else {
      return res
        .status(401)
        .json({ message: "Failed to authorize the request " });
    }
  } catch (err) {
    //TODO : dignostic
    console.log("Error while authorizing the request ");
    console.log(err);
    return res.status(401).json({
      message: "Couldn't validate the request due to some internal error.",
    });
  }
};

const verifyAuth = (req, res, next) => {
  try {
    let token;
    console.log("verifyyy tokennnn");
    
    if (req.cookies && req.cookies["verify_token"]) {
      token = req.cookies["verify_token"];
    } else {
      token = req.headers.authorization?.split(" ")[1];
    }

    console.log(token);

    if (!token || token === undefined) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this resource" });
    }

    // token = token.match(/(?<=Bearer\s*)\S+/)[0];
    console.log("Token is: ", token);

    let result = jwt.verify(token, process.env.JWT_SECRET);

    if (result) {
      //console.log(result)
      let email = result.data.split("?")[0];
      req.user_email = email;
      next();
    } else {
      return res
        .status(401)
        .json({ message: "Failed to authorize the request " });
    }
  } catch (err) {
    //TODO : dignostic
    console.log("Error while authorizing the request ");
    console.log(err);
    return res.status(401).json({
      message: "Couldn't validate the request due to some internal error.",
    });
  }
};

const checkWhetherUserisAdmin = async(req,res,next)=>{
    try{
        const db= get_db()
        const user_email = req.user_email
        if(!user_email){
            return sendResponse(400,"Middleware - No user email provided",res)
        }
        
        const user = await db.collection("user").findOne({email:user_email})
        if(!user){

            return sendResponse(404,"Middleware - No user found with this email",res)
        }

        if(user.user_type!="a"){
            return sendResponse(403,"Only admins are allowed to access this resource",res)
        }

        next()

    }
    catch(err){

        console.log(err)
        return sendResponse(500, "Error while trying to verify whether the user is an admin",res)
    }


}
module.exports = {reqAuth,verifyAuth,checkWhetherUserisAdmin};
