const {get_db} = require("../Utils/MongoConnect.js")
const sendResponse = require("../Utils/SendResponse.js")
const isObjectIdValid = require("../Utils/ValidObjectId.js")
const tryCatchWrapper = require("../Utils/TryCatchWrapper.js")
const {ObjectId} = require('mongodb')

const isCompanyRequest = tryCatchWrapper(async(req,res,next)=>{
    const company_email = req.user_email

    const company_id = req.params.id

    if(!company_email || company_email.length <1){
        return sendResponse(400,"No company email provided",res)
    }
    if(!company_email.match(/\S+@\S+\.\S+/)){
        return sendResponse(400, "Invalid email provided",res)
    }

    if(!isObjectIdValid(company_id)){
        return sendResponse(400, "Invalid company id provided",res)
    }
   

    const db = get_db()

    const user= (await db.collection("user").findOne({email:company_email}))
    if(!user){
        return sendResponse(500,"No user found with this email",res)
    }

    const user_via_company = (await db.collection("company").findOne({_id: new ObjectId(company_id)}))

    if(!user_via_company){
        return sendResponse(500, "No company found with this id",res)

    }

    if((String) (user._id) == (String) (user_via_company.user_id)){
        console.log(user)
        console.log(user_via_company)
        req.is_company_req = true
        //return res.status(401).json({message:"Not authenticated. The company email and id don't match"})
    }

    next()

}
)
module.exports=isCompanyRequest
