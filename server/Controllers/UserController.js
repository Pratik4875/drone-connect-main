const bcryptjs = require("bcryptjs");
const { get_db } = require("../Utils/MongoConnect.js");
const jwt = require("jsonwebtoken");
const { get_otp_template } = require("../Utils/HtmlEmailTemplates.js");
const sendEmail = require("../Utils/SendEmail.js");
const generateOTP = require("../Utils/GenerateOTP.js");
const tryCatchWrapper = require("../Utils/TryCatchWrapper.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { ObjectId } = require("mongodb");
const sendResponse = require("../Utils/SendResponse.js")
const isObjectIdValid = require("../Utils/ValidObjectId.js")

// cloudnary configration
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET,
    secure: true,
  });


/////////////////////////////Exported functions\\\\\\\\\\\\\\\\\\\\\\\\\\
//1. Login
const ulogin = tryCatchWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return sendResponse(401, "No details provided", res);
    }
    if (email.length < 1) {
        return sendResponse(401, "No email provided", res);
    }
    if (password.length < 1 || password.length < 8) {
        //TODO: set up diagnostic
        console.log(`Invalid password. Length of password is:${password.length}`);
        return sendResponse(
            401,
            "Invalid password provided.Length is less than 8 characters",
            res
        );
    }

    if (!email.match(/\S+@\S+\.\S+/)) {
        //TODO: set up diagnostic
        console.log("Email regex not matched: Email is" + email);
        return sendResponse(401, "Invalid email provided", res);
    }
    const isDigitPresent = password.match(/\d+/);
    const isSmallAlphaPresent = password.match(/[a-z]+/);
    const isUpperAlphaPresent = password.match(/[A-Z]+/);
    const isSpecialCharPresent = password.match(/[^\w]+/);
    if (
        !(
            isDigitPresent &&
            isSmallAlphaPresent &&
            isUpperAlphaPresent &&
            isSpecialCharPresent
        )
    ) {
        var msg = "Invalid password provided";
        if (!isDigitPresent) msg += ": digit not present";
        if (!isSmallAlphaPresent) msg += ": lowercase alphabet not present";
        if (!isUpperAlphaPresent) msg += ": uppercase alphabet not present";
        if (!isSpecialCharPresent) msg += ": special character not present";
        //TODO: set up diagnostic
        console.log(
            "Password regex not matched: Password is " + password + " " + msg
        );
        return sendResponse(401, msg, res);
    }

    let db = get_db();
    let user_col = await db.collection("user");
    let result = await user_col.findOne({ email: email });
    if (!result) {
        return sendResponse(401, "No such user present", res);
    }
    if (bcryptjs.compareSync(password, result.password)) {
        token = jwt.sign(
            { data: email + "?" + Date.now() / 1000 },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
        return res
            .status(200)
            .cookie("token", token, {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                sameSite: "none",
                secure: true,
            })
            .json({
                success: true,
                message: "Login successful",
                user: {
                    city: result.city,
                    district: result.district,
                    email: result.email,
                    name: result.name,
                    pincode: parseInt(result.pincode),
                    state: result.state,
                    user_type: result.user_type,
                },
            });
        //return sendResponse(200, "Login successful", res);
    }
    return sendResponse(401, "Incorrect password", res);
});

//Registration
const uregister = tryCatchWrapper(async (req, res, next) => {
    let db = get_db();
    // Note(458): user type options
    // c=>customer, p=>pilot (freelance), o=>organization(service provider)
    const user_type_options = ["c", "o", "p"];

    const { name, district, city, state, pincode, password, user_type } =
        req.body;
    //get the email only after verifying the request
    let email = req.user_email;
    if (
        !name ||
        !district ||
        !city ||
        !state ||
        !pincode ||
        !city ||
        !email ||
        !password ||
        !user_type
    ) {
        return sendResponse(401, "No details provided", res);
    }

    if (name.length < 1) {
        return sendResponse(401, "No name provided", res);
    }

    if (district.length < 1) {
        return sendResponse(401, "No district provided", res);
    }
    if (city.length < 1) {
        return sendResponse(401, "No city provided", res);
    }
    if (state.length < 1) {
        return sendResponse(401, "No state provided", res);
    }
    if (pincode.length < 1) {
        return sendResponse(401, "No pincode provided", res);
    }
    if (user_type.length < 1) {
        return sendResponse(401, "No user type provided", res);
    }
    if (email.length < 1) {
        return sendResponse(401, "No email provided", res);
    }
    if (password.length < 1 || password.length < 8) {
        //TODO: set up diagnostic
        console.log(`Invalid password. Length of password is:${password.length}`);
        return sendResponse(
            401,
            "Invalid password provided.Length is less than 8 characters",
            res
        );
    }

    if (!email.match(/\S+@\S+\.\S+/)) {
        //TODO: set up diagnostic
        console.log("Email regex not matched: Email is" + email);
        return sendResponse(401, "Invalid email provided", res);
    }

    if (!pincode.match(/\d{6}/)) {
        return sendResponse(401, "Invalide pincode", res);
    }

    const isDigitPresent = password.match(/\d+/);
    const isSmallAlphaPresent = password.match(/[a-z]+/);
    const isUpperAlphaPresent = password.match(/[A-Z]+/);
    const isSpecialCharPresent = password.match(/[^\w]+/);
    if (
        !(
            isDigitPresent &&
            isSmallAlphaPresent &&
            isUpperAlphaPresent &&
            isSpecialCharPresent
        )
    ) {
        var msg = "Invalid password provided";
        if (!isDigitPresent) msg += ": digit not present";
        if (!isSmallAlphaPresent) msg += ": lowercase alphabet not present";
        if (!isUpperAlphaPresent) msg += ": uppercase alphabet not present";
        if (!isSpecialCharPresent) msg += ": special character not present";
        //TODO: set up diagnostic
        console.log(
            "Password regex not matched: Password is " + password + " " + msg
        );
        return sendResponse(401, msg, res);
    }

    if (!user_type_options.includes(user_type)) {
        return sendResponse(401, "Invalid User type", res);
    }

    var salt = bcryptjs.genSaltSync(10);
    var hashed_password = bcryptjs.hashSync(password, salt);

    let user_col = await db.collection("user");

    //TODO: this check is to be done when sending the otp email
    if (await user_col.findOne({ email: email })) {
        return sendResponse(401, "User with this email already exists", res);
    }

    let new_user_doc = {
        name: name,
        district: district,
        city: city,
        state: state,
        pincode: parseInt(pincode),
        email: email,
        password: hashed_password,
        user_type: user_type,
        profile: null,
    };

    // Insert the user into the database
    const userInsertResult = await user_col.insertOne(new_user_doc);

    if (!userInsertResult.insertedId) {
        res
            .status(400)
            .json({ success: false, message: "Insertion in database failed" });
    }

    // Handle specific user types
    const userId = userInsertResult.insertedId;

    if (user_type === "p") {
        // Register pilot details
        const pilotDetails = {
            user_id: userId,
            company_id: null,
            drone_category: null,
            is_company_person: false,
            ia_DGCA_license: null,
            license_number: null,
            available: false,
            socials: [],
        };

        const pilotCollection = db.collection("pilot");
        const pilotInsertResult = await pilotCollection.insertOne(pilotDetails);

        if (!pilotInsertResult.insertedId) {
            return res
                .status(400)
                .json({ success: false, message: "Insertion in database failed" });
        }
    } else if (user_type === "o") {
        // Register company details
        const companyDetails = {
            user_id: userId,
            name: null,
            gst: null,
            website: null,
            logo: null,
            status:"unverified"
        };

        const companyCollection = db.collection("company");
        const companyInsertResult = await companyCollection.insertOne(
            companyDetails
        );

        if (!companyInsertResult.insertedId) {
            return res
                .status(400)
                .json({ success: false, message: "Insertion in database failed" });
        }
    }

    return res
        .status(200)
        .json({ success: true, message: "Registration successful" });
});

//Send Email containing OTP
const sendEmailVerificationOTP = tryCatchWrapper(async (req, res) => {
    const { email } = req.body;
    if (!email || email.length < 1) {
        return sendResponse(401, "No email provided", res);
    }
    if (!email.match(/\S+@\S+\.\S+/)) {
        //TODO: set up diagnostic
        console.log("Email regex not matched: Email is" + email);
        return sendResponse(401, "Invalid email provided", res);
    }

    let user_col = await get_db().collection("user");

    if (await user_col.findOne({ email: email })) {
        return sendResponse(401, "User with this email already exists", res);
    }
    let otp = generateOTP();

    //save the otp in the database
    let otp_col = await get_db().collection("otp");
    if (await otp_col.findOne({ email: email })) {
        await otp_col.deleteMany({ email: email });
    }

    let result = await otp_col.insertOne({
        email: email,
        otp: bcryptjs.hashSync(otp, bcryptjs.genSaltSync(10)),
        created_at: new Date(),
    });
    //let hashed_otp = bcryptjs.hashSync(otp,bcryptjs.genSaltSync(10))

    let status = await sendEmail(
        email,
        get_otp_template(email, otp)
    );

    if (status && result.insertedId) {
        return res
            .status(200)
            .json({ success: true, message: "Email sent successfully" });
    } else if (!status) {
        return res
            .status(400)
            .json({ success: false, message: "Error sending email" });
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Error saving OTP in database" });
    }
});

//Verify the OTP sent
const verifyOTP = tryCatchWrapper(async (req, res, next) => {
    const { otp, email } = req.body;
    if (!otp) {
        return sendResponse(401, "No OTP provided", res);
    }

    if (otp.length < 6 || !otp.match(/\d{6}/)) {
        return sendResponse(401, "Invalid OTP", res);
    }
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    if (!email.match(/\S+@\S+\.\S+/)) {
        //TODO: set up diagnostic
        console.log("Email regex not matched: Email is" + email);
        return sendResponse(401, "Invalid email provided", res);
    }

    let time_now = Date.now();

    let db = get_db();
    let otp_col = await db.collection("otp");
    let result = await otp_col.find({ email: email }).sort({ created_at: -1 });
    let otp_results = [];
    let i = 0;
    for await (const doc of result) {
        otp_results[i] = doc;
        i++;
    }
    if (otp_results.length < 1) {
        return res.status(401).json({
            success: false,
            message: "No valid OTP in the database for this email",
        });
    }
    if (bcryptjs.compareSync(otp, otp_results[0].otp)) {
        //return a jwt token to be used for the next request that is sent after verifying otp
        let token = jwt.sign(
            { data: email + "?" + Date.now() },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        );
        return res
            .status(200)
            .cookie("verify_token", token, {
                expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes in milliseconds
                httpOnly: true,
                sameSite: "none",
                secure: true,
            })
            .json({
                success: true,
                message: "OTP authenticated successfully",
            });
    } else {
        return res.status(401).json({ success: false, message: "Incorrect OTP" });
    }
});

const checkIfEmailExistsAndSendOTP = tryCatchWrapper(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    if (!email.match(/\S+@\S+\.\S+/)) {
        //TODO: set up diagnostic
        console.log("Email regex not matched: Email is" + email);
        return sendResponse(401, "Invalid email provided", res);
    }

    let db = get_db();
    let users_col = await db.collection("user");
    let result = await users_col.findOne({ email: email });
    if (result) {
        let otp = generateOTP();

        //save the otp in the database
        let otp_col = db.collection("otp");
        if (await otp_col.findOne({ email: email })) {
            await otp_col.deleteMany({ email: email });
        }

        let result = await otp_col.insertOne({
            email: email,
            otp: bcryptjs.hashSync(otp, bcryptjs.genSaltSync(10)),
            created_at: new Date(),
        });
        //let hashed_otp = bcryptjs.hashSync(otp,bcryptjs.genSaltSync(10))

        let status = await sendEmail(
            email,
            get_otp_template(email, otp)
        );

        //let token=jwt.sign({data:email+"?"+(Date.now()/1000)},process.env.JWT_SECRET,{ expiresIn: '10m' })
        if (status && result.insertedId) {
            return res
                .status(200)
                .json({ success: true, message: "Email sent successfully" });
        } else if (!status) {
            return res
                .status(400)
                .json({ success: false, message: "Error sending email" });
        } else {
            return res
                .status(400)
                .json({ success: false, message: "Error saving OTP in database" });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "User with entered email doesn't exist",
        });
    }
});

const resetPassword = tryCatchWrapper(async (req, res, next) => {
    const { password } = req.body;
    let email = req.user_email;
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    if (!email.match(/\S+@\S+\.\S+/)) {
        //TODO: set up diagnostic
        console.log("Email regex not matched: Email is" + email);
        return sendResponse(401, "Invalid email provided", res);
    }
    if (!password) {
        return sendResponse(401, "No password provided", res);
    }
    const isDigitPresent = password.match(/\d+/);
    const isSmallAlphaPresent = password.match(/[a-z]+/);
    const isUpperAlphaPresent = password.match(/[A-Z]+/);
    const isSpecialCharPresent = password.match(/[^\w]+/);
    if (
        !(
            isDigitPresent &&
            isSmallAlphaPresent &&
            isUpperAlphaPresent &&
            isSpecialCharPresent
        )
    ) {
        var msg = "Invalid password provided";
        if (!isDigitPresent) msg += ": digit not present";
        if (!isSmallAlphaPresent) msg += ": lowercase alphabet not present";
        if (!isUpperAlphaPresent) msg += ": uppercase alphabet not present";
        if (!isSpecialCharPresent) msg += ": special character not present";
        //TODO: set up diagnostic
        console.log(
            "Password regex not matched: Password is " + password + " " + msg
        );
        return sendResponse(401, msg, res);
    }

    let user_col = await get_db().collection("user");
    let result = await user_col.updateOne(
        { email: email },
        {
            $set: { password: bcryptjs.hashSync(password, bcryptjs.genSaltSync(10)) },
        }
    );
    if (result.modifiedCount == 1) {
        return res
            .status(200)
            .json({ success: true, message: "Password reset successfully" });
    } else {
        //TODO: diagnostics
        console.log("password reset result is:", result);
        return res.status(400).json({
            success: false,
            message: "Password couldn't be reset. Please try again later",
        });
    }
});

const getUser = tryCatchWrapper(async (req, res, next) => {
    let db = get_db();
    let users_col = db.collection("user");
    
    // Find user by email
    let user = await users_col.findOne(
        { email: req.user_email },
        { projection: { password: 0, _id: 1 } } // Exclude password field
    );

    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    let pilot_col = db.collection("pilot");
    let company_col = db.collection("company");
    console.log(user._id);
    console.log( await company_col.findOne({user_id:user._id},{ projection: { _id: 1 } }) );
    
    // Fetch pilot_id and company_id concurrently
    let [pilot, company] = await Promise.all([
        pilot_col.findOne({ user_id: user._id }, { projection: { _id: 1 } }),
        company_col.findOne({ user_id: user._id }, { projection: { _id: 1 } })
    ]);

    return res.status(200).json({
        success: true,
        user: {
            ...user,
            pilot_id: pilot?._id || null,
            company_id: company?._id || null
        }
    });
});



const logout = tryCatchWrapper(async (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Log out successful!",
    });
});

const changeProfileAvatar = tryCatchWrapper(async (req, res, next) => {
    const { path } = req.file;
    let email = req.user_email;
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }
    let db = get_db();
    let users_col = await db.collection("user");
    let result = await users_col.findOne({ email: email });
    if (!result) {
        return sendResponse(401, "User doesn't exists", res);
    }
    if (result.profile) {
        const destroy_result = await cloudinary.uploader
            .destroy(result.profile)
            .catch((error) => {
                return sendResponse(500, error.message, res);
            });
        console.log(destroy_result);

        if (destroy_result.result !== "ok") {
            return sendResponse(500, "Failed to delete image", res);
        }
    }
    const upload_result = await cloudinary.uploader
        .upload(path)
        .catch((error) => {
            return sendResponse(500, error.message, res);
        });
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err);
            return sendResponse(500, err.message, res);
        }
    });
    if (!upload_result) {
        return sendResponse(500, "Failed to upload image", res);
    }
    let update_result = await users_col.updateOne(
        { email: email },
        {
            $set: { profile: upload_result.public_id },
        }
    );
    if (update_result.modifiedCount == 1) {
        return res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            public_id: upload_result.public_id,
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Profile image couldn't be updated. Please try again later",
        });
    }
});

const updateProfileGeneral = tryCatchWrapper(async (req, res, next) => {
    const { name, district, city, state, pincode } = req.body;
    //get the email only after verifying the request
    let email = req.user_email;
    if (!name || !district || !city || !state || !pincode || !city) {
        return sendResponse(401, "No details provided", res);
    }

    if (name.length < 1) {
        return sendResponse(401, "No name provided", res);
    }

    if (district.length < 1) {
        return sendResponse(401, "No district provided", res);
    }
    if (city.length < 1) {
        return sendResponse(401, "No city provided", res);
    }
    if (state.length < 1) {
        return sendResponse(401, "No state provided", res);
    }
    if (pincode.length < 1) {
        return sendResponse(401, "No pincode provided", res);
    }
    if (email.length < 1) {
        return sendResponse(401, "No email provided", res);
    }

    if (!email.match(/\S+@\S+\.\S+/)) {
        //TODO: set up diagnostic
        console.log("Email regex not matched: Email is" + email);
        return sendResponse(401, "Invalid email provided", res);
    }

    if (!pincode.match(/\d{6}/)) {
        return sendResponse(401, "Invalide pincode", res);
    }
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }
    let db = get_db();
    let users_col = await db.collection("user");
    let result = await users_col.findOne({ email: email });
    if (!result) {
        return sendResponse(401, "User doesn't exists", res);
    }
    let update_result = await users_col.updateOne(
        { email: email },
        {
            $set: {
                name: name,
                district: district,
                city: city,
                state: state,
                pincode: parseInt(pincode),
            },
        }
    );
    if (update_result.modifiedCount == 1) {
        return res.status(200).json({
            success: true,
            message: "Profile information updated successfully",
        });
    } else {
        return res.status(400).json({
            success: false,
            message:
            "Profile information couldn't be updated. Please try again later",
        });
    }
});

const updateProfilePassword = tryCatchWrapper(async (req, res, next) => {
    const { old_password, password } = req.body;
    const email = req.user_email; // Assuming the email is passed with the token or session

    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    // Validate email format
    if (!email.match(/\S+@\S+\.\S+/)) {
        console.log("Email regex not matched: Email is " + email);
        return sendResponse(401, "Invalid email provided", res);
    }

    // Ensure new password is provided
    if (!password) {
        return sendResponse(401, "No password provided", res);
    }

    // Validate new password (must contain a digit, lowercase, uppercase, and special character)
    const isDigitPresent = password.match(/\d+/);
    const isSmallAlphaPresent = password.match(/[a-z]+/);
    const isUpperAlphaPresent = password.match(/[A-Z]+/);
    const isSpecialCharPresent = password.match(/[^\w]+/);

    if (
        !(
            isDigitPresent &&
            isSmallAlphaPresent &&
            isUpperAlphaPresent &&
            isSpecialCharPresent
        )
    ) {
        let msg = "Invalid password provided";
        if (!isDigitPresent) msg += ": digit not present";
        if (!isSmallAlphaPresent) msg += ": lowercase alphabet not present";
        if (!isUpperAlphaPresent) msg += ": uppercase alphabet not present";
        if (!isSpecialCharPresent) msg += ": special character not present";
        console.log("Password validation failed: " + msg);
        return sendResponse(401, msg, res);
    }

    // Connect to the database and fetch the user details
    const user_col = await get_db().collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email: email });

    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    // Verify the old password
    const isOldPasswordValid = bcryptjs.compareSync(old_password, user.password);
    if (!isOldPasswordValid) {
        return sendResponse(401, "Old password is incorrect", res);
    }

    // Hash the new password
    const hashedPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));

    // Update the password in the database
    const result = await user_col.updateOne(
        { email: email },
        {
            $set: { password: hashedPassword },
        }
    );

    if (result.modifiedCount === 1) {
        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
    } else {
        console.log("Password update result is:", result);
        return res.status(400).json({
            success: false,
            message: "Password couldn't be updated. Please try again later",
        });
    }
});

const getCompany = tryCatchWrapper(async (req, res, next) => {
    const email = req.user_email; // Assuming the email is passed with the token or session

    if (!email) {
        return sendResponse(401, "No email provided", res);
    }
    // Connect to the database and fetch the user details
    const user_col = await get_db().collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email: email });

    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    const company_col = await get_db().collection("company");

    const company_details = await company_col.findOne(
        { user_id: user._id },
        { projection: { user_id: 0, _id: 0 } }
    );

    if (!company_details) {
        return sendResponse(404, "Company not found", res);
    }
    return res.status(200).json({ success: true, company: company_details });
});

const updateCompanyDetails = tryCatchWrapper(async (req, res, next) => {
    const { gst, name, url } = req.body;
    const email = req.user_email; // Assuming the email is passed with the token or session

    if (!email) {
        return sendResponse(401, "No email provided", res);
    }
    // Connect to the database and fetch the user details
    const user_col = await get_db().collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email: email });

    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    const company_col = await get_db().collection("company");

    const company_details = await company_col.findOne({ user_id: user._id });

    if (!company_details) {
        return sendResponse(404, "Company not found", res);
    }

    const companyDetailsUpdate = await company_col.updateOne(
        { _id: company_details._id },
        {
            $set: {
                name: name,
                gst: gst,
                website: url,
            },
        }
    );

    if (companyDetailsUpdate.modifiedCount == 1) {
        return res.status(200).json({
            success: true,
            message: "Company Details Updated successfully!",
        });
    } else {
        //TODO: diagnostics
        return res.status(400).json({
            success: false,
            message: "Company details not updated. Please try again later",
        });
    }
});

const updateCompanyLogo = tryCatchWrapper(async (req, res, next) => {
    const { path } = req.file;
    let email = req.user_email;
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }
    let db = get_db();
    let users_col = await db.collection("user");
    let result = await users_col.findOne({ email: email });
    if (!result) {
        return sendResponse(401, "User doesn't exists", res);
    }

    const company_col = await get_db().collection("company");

    const company_details = await company_col.findOne({ user_id: result._id });

    if (!company_details) {
        return sendResponse(404, "Company not found", res);
    }

    if (company_details.logo) {
        const destroy_result = await cloudinary.uploader
            .destroy(company_details.logo)
            .catch((error) => {
                return sendResponse(500, error.message, res);
            });
        if (destroy_result.result !== "ok") {
            return sendResponse(500, "Failed to delete image", res);
        }
    }
    const upload_result = await cloudinary.uploader
        .upload(path)
        .catch((error) => {
            return sendResponse(500, error.message, res);
        });
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err);
            return sendResponse(500, err.message, res);
        }
    });
    if (!upload_result) {
        return sendResponse(500, "Failed to upload image", res);
    }

    console.log(upload_result.public_id);

    let company_result = await company_col.updateOne(
        { _id: company_details._id },
        {
            $set: { logo: upload_result.public_id },
        }
    );
    if (company_result.modifiedCount == 1) {
        return res.status(200).json({
            success: true,
            message: "Company image updated successfully",
            public_id: upload_result.public_id,
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Company image couldn't be updated. Please try again later",
        });
    }
});

const getPilotDetails = tryCatchWrapper(async (req, res, next) => {
    const email = req.user_email; // Assuming the email is passed with the token or session

    if (!email) {
        return sendResponse(401, "No email provided", res);
    }
    // Connect to the database and fetch the user details
    const user_col = await get_db().collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email: email });

    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    const pilot_col = await get_db().collection("pilot");

    const pilot_details = await pilot_col.findOne(
        { user_id: user._id },
        { projection: { user_id: 0, _id: 0, socials: 0 } }
    );

    if (!pilot_details) {
        return sendResponse(404, "pilot not found", res);
    }
    if (pilot_details.company_id) {
        const company_col = await get_db().collection("company");
        const company_details = await company_col.findOne({
            _id: pilot_details.company_id,
        },{ projection: { user_id: 0, _id: 0, gst: 0 } });
        pilot_details.company = company_details;

    }
    return res.status(200).json({ success: true, pilot: pilot_details });
});


// utils/validation.js

// Validate DGCA License Number format (example)
validateLicenseNumber = (license_number) => {
    const licenseRegex = /^[A-Za-z0-9\-]+$/; // Example regex for DGCA license number
    return licenseRegex.test(license_number);
};

// Validate Drone Category (example)
validateDroneCategory = (category) => {
    const validCategories = ["micro", "small", "large", "nano", "medium"]; // Define valid categories
    return validCategories.includes(category);
};



const updateProfessionalDetails = tryCatchWrapper(async (req, res, next) => {
    const email = req.user_email; // Assuming the email is passed with the token or session

    // Validate email
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    // Validate request body
    let { ia_DGCA_license, license_number, drone_category, available } = req.body;

    
    // Check if required fields are provided
    if (ia_DGCA_license!== undefined && typeof ia_DGCA_license !== "boolean") {
        return sendResponse(400, "DGCA License status is required", res);
    }

    if (ia_DGCA_license && license_number==="") {
        return sendResponse(400, "DGCA License number required", res);
    }
    // Optional Fields Validation
    if (license_number && !validateLicenseNumber(license_number)) {
        return sendResponse(400, "Invalid DGCA License number format", res);
    }

    if (license_number==="") {
        license_number=null;
    }
    if (drone_category && !validateDroneCategory(drone_category)) {
        return sendResponse(400, "Invalid drone category", res);
    }

    // Check if the 'available' field is provided and valid (optional field)
    if (available !== undefined && typeof available !== "boolean") {
        return sendResponse(400, "'available' must be a boolean value", res);
    }

    // Connect to the database
    const db = await get_db();
    const user_col = db.collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email });
    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    // Fetch professional details (assumed to be in 'professional' collection)
    const pilot_col = db.collection("pilot");
    const pilot_details = await pilot_col.findOne({ user_id: user._id });

    if (!pilot_details) {
        return sendResponse(404, "Professional details not found", res);
    }

    // Prepare update data
    const updateData = {};
    if (ia_DGCA_license !== undefined) updateData.ia_DGCA_license = ia_DGCA_license;
    if (license_number) updateData.license_number = license_number;
    if (drone_category) updateData.drone_category = drone_category;
    if (available !== undefined) updateData.available = available;

    // Update professional details in the database
    const result = await pilot_col.updateOne(
        { _id: pilot_details._id },
        { $set: updateData }
    );

    if (result.matchedCount === 0) {
        return sendResponse(404, "Professional details not found or you are not authorized to update them", res);
    }

    if (result.modifiedCount === 0) {
        return sendResponse(400, "No changes were made to the professional details", res);
    }

    // Respond with success
    return res.status(200).json({
        success: true,
        message: "Professional details updated successfully",
    });
});


const getPilotSocials = tryCatchWrapper(async (req, res, next) => {
    const email = req.user_email; // Assuming the email is passed with the token or session

    if (!email) {
        return sendResponse(401, "No email provided", res);
    }
    // Connect to the database and fetch the user details
    const user_col = await get_db().collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email: email });

    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    const pilot_col = await get_db().collection("pilot");

    const pilot_details = await pilot_col.findOne(
        { user_id: user._id },
        { projection: { user_id: 0, _id: 0 } }
    );

    if (!pilot_details) {
        return sendResponse(404, "pilot not found", res);
    }
    return res
        .status(200)
        .json({ success: true, socials: pilot_details?.socials || [] });
});

const addPilotSocials = tryCatchWrapper(async (req, res, next) => {
    const { platform, account } = req.body;
    const email = req.user_email; // Assuming the email is passed with the token or session

    if (!email) {
        return sendResponse(401, "No email provided", res);
    }
    // Connect to the database and fetch the user details
    const user_col = await get_db().collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email: email });

    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    const pilot_col = await get_db().collection("pilot");

    const pilot_details = await pilot_col.findOne(
        { user_id: user._id },
        { projection: { user_id: 0, _id: 0 } }
    );

    if (!pilot_details) {
        return sendResponse(404, "pilot not found", res);
    }

    if (pilot_details?.socials?.find((value) => value.platform === platform)) {
        return res.status(400).json({
            success: false,
            message: "You have already added this platform",
        });
    }

    const data = {
        platform: platform,
        account: account,
    };
    let pilot_result = await pilot_col.updateOne(
        { user_id: user._id },
        {
            $push: { socials: data }, // Add the new entry while keeping existing ones
        }
    );

    if (pilot_result.modifiedCount == 1) {
        return res.status(200).json({
            success: true,
            message: "Social added successfully",
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Failed to add. Please try again later",
        });
    }
});

const updatePilotSocials = tryCatchWrapper(async (req, res, next) => {
    const { platform, account } = req.body;
    const email = req.user_email; // Assuming the email is passed with the token or session

    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    // Connect to the database and fetch the user details
    const user_col = await get_db().collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email: email });

    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    const pilot_col = await get_db().collection("pilot");

    const pilot_details = await pilot_col.findOne(
        { user_id: user._id },
        { projection: { socials: 1 } }
    );

    if (!pilot_details) {
        return sendResponse(404, "Pilot not found", res);
    }

    const existingSocialIndex = pilot_details.socials?.findIndex(
        (value) => value.platform === platform
    );

    if (existingSocialIndex !== -1) {
        // If the platform exists, update the account
        const updateResult = await pilot_col.updateOne(
            { user_id: user._id, "socials.platform": platform },
            { $set: { "socials.$.account": account } } // Update the specific platform's account
        );

        if (updateResult.modifiedCount === 1) {
            return res.status(200).json({
                success: true,
                message: "Social updated successfully",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Failed to update. Please try again later",
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "No social avaibale. Please try again later",
        });
    }
});
const deletePilotSocial = tryCatchWrapper(async (req, res, next) => {
    const { platform } = req.body;
    const email = req.user_email; // Assuming the email is passed with the token or session

    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    // Connect to the database and fetch the user details
    const user_col = await get_db().collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email: email });

    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    const pilot_col = await get_db().collection("pilot");

    // Check if the user has pilot details
    const pilot_details = await pilot_col.findOne(
        { user_id: user._id },
        { projection: { socials: 1 } }
    );

    if (!pilot_details) {
        return sendResponse(404, "Pilot not found", res);
    }

    // Check if the social platform exists in the user's socials
    const existingSocial = pilot_details.socials?.find(
        (value) => value.platform === platform
    );

    if (!existingSocial) {
        return res.status(404).json({
            success: false,
            message: "Platform not found in socials",
        });
    }

    // Remove the social platform from the socials array
    const deleteResult = await pilot_col.updateOne(
        { user_id: user._id },
        { $pull: { socials: { platform: platform } } } // Remove the entry matching the platform
    );

    if (deleteResult.modifiedCount === 1) {
        return res.status(200).json({
            success: true,
            message: "Social deleted successfully",
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Failed to delete. Please try again later",
        });
    }
});

const addPilotCertificate = tryCatchWrapper(async (req, res, next) => {
    const { name, url, expiry_date } = req.body;
    const email = req.user_email; // Assuming the email is passed with the token or session

    // Validate input
    if (!name || !url || !expiry_date) {
        return sendResponse(
            400,
            "All fields (name, url, expiry_date) are required",
            res
        );
    }

    // Validate URL format
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/;
    if (!urlPattern.test(url)) {
        return sendResponse(400, "Invalid URL format", res);
    }

    // Validate expiry_date format
    const expiryDate = new Date(expiry_date);
    if (isNaN(expiryDate.getTime())) {
        return sendResponse(400, "Invalid expiry_date format", res);
    }
    if (expiryDate < new Date()) {
        return sendResponse(400, "Expiry date cannot be in the past", res);
    }

    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    // Fetch the user details
    const db = await get_db();
    const user_col = db.collection("user");

    const user = await user_col.findOne({ email });
    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    // Fetch pilot details
    const pilot_col = db.collection("pilot");
    const pilot_details = await pilot_col.findOne(
        { user_id: user._id },
        { projection: { user_id: 0 } }
    );

    if (!pilot_details) {
        return sendResponse(404, "Pilot not found", res);
    }

    // Prepare data for insertion
    const data = {
        pilot_id: pilot_details._id,
        name,
        url,
        expiry_date: expiryDate.toISOString(), // Store in a consistent format
    };

    // Insert certificate
    const pilot_certificate_col = db.collection("pilot_certificates");
    const insertResult = await pilot_certificate_col.insertOne(data);

    if (!insertResult.insertedId) {
        return sendResponse(500, "Failed to add certificate", res);
    }

    // Return success response
    return res.status(200).json({
        success: true,
        message: "Certificate added successfully",
    });
});

const getPilotCertificates = tryCatchWrapper(async (req, res, next) => {
    const email = req.user_email; // Assuming the email is passed with the token or session

    // Validate email
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    // Connect to the database
    const db = await get_db();
    const user_col = db.collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email });
    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    // Fetch pilot details
    const pilot_col = db.collection("pilot");
    const pilot_details = await pilot_col.findOne(
        { user_id: user._id },
        { projection: { user_id: 0 } }
    );

    if (!pilot_details) {
        return sendResponse(404, "Pilot not found", res);
    }

    // Fetch pilot certificates
    const pilot_certificate_col = db.collection("pilot_certificates");
    const certificates = await pilot_certificate_col
        .find({ pilot_id: pilot_details._id },{ projection: { pilot_id: 0 } })
        .sort({ created_at: -1 }) // Sort by creation date (most recent first)
        .toArray();

    // Respond with certificates
    return res.status(200).json({
        success: true,
        certificates,
    });
});


const updatePilotCertificate = tryCatchWrapper(async (req, res, next) => {
    const { certificateId, name, url, expiry_date } = req.body; // Fields to update
    const email = req.user_email; // User email from session or token

    // Validate email
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    if (!certificateId) {
        return sendResponse(400, "Certificate ID is required", res);
    }

    if (!name || !url || !expiry_date) {
        return sendResponse(
            400,
            "All fields (name, url, expiry_date) are required",
            res
        );
    }

    // Connect to the database
    const db = await get_db();
    const user_col = db.collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email });
    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    // Fetch pilot details
    const pilot_col = db.collection("pilot");
    const pilot_details = await pilot_col.findOne(
        { user_id: user._id },
        { projection: { user_id: 0 } }
    );

    if (!pilot_details) {
        return sendResponse(404, "Pilot not found", res);
    }

    // Connect to pilot certificates collection
    const pilot_certificate_col = db.collection("pilot_certificates");

    const expiryDate = new Date(expiry_date);

    // Update the certificate      
    const updateResult = await pilot_certificate_col.updateOne(
        { _id: new ObjectId(certificateId), pilot_id: pilot_details._id },
        {
            $set: {
                name : name,
                url : url,
                expiry_date: expiryDate.toISOString(), // Store in a consistent format
            },
        }
    );

    console.log(updateResult);

    if (updateResult.matchedCount === 0) {
        return sendResponse(404, "Certificate not found or does not belong to the pilot", res);
    }

    return res.status(200).json({
        success: true,
        message: "Certificate updated successfully",
    });
});


const deletePilotCertificate = tryCatchWrapper(async (req, res, next) => {
    try {
        const { certificateId } = req.body; // Certificate ID from route parameters
        const email = req.user_email; // User email from session or token

        // Validate email
        if (!email) {
            return sendResponse(401, "No email provided", res);
        }

        if (!certificateId) {
            return sendResponse(400, "Certificate ID is required", res);
        }
        // Connect to the database
        const db = await get_db();
        const user_col = db.collection("user");

        // Find the user by email
        const user = await user_col.findOne({ email });
        if (!user) {
            return sendResponse(404, "User not found", res);
        }

        // Fetch pilot details
        const pilot_col = db.collection("pilot");
        const pilot_details = await pilot_col.findOne(
            { user_id: user._id },
            { projection: { user_id: 0 } }
        );

        if (!pilot_details) {
            return sendResponse(404, "Pilot not found", res);
        }

        // Connect to pilot certificates collection
        const pilot_certificate_col = db.collection("pilot_certificates");

        // Delete the certificate
        const deleteResult = await pilot_certificate_col.deleteOne({
            _id: new ObjectId(certificateId),
            pilot_id: pilot_details._id,
        });

        if (deleteResult.deletedCount === 0) {
            return sendResponse(404, "Certificate not found or does not belong to the pilot", res);
        }

        return res.status(200).json({
            success: true,
            message: "Certificate deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting pilot certificate:", error);
        return sendResponse(500, "An unexpected error occurred", res);
    }
});

const getPilotExperience = tryCatchWrapper(async (req, res, next) => {
    const email = req.user_email; // Assuming the email is passed with the token or session

    // Validate email
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    // Connect to the database
    const db = await get_db();
    const user_col = db.collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email });
    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    // Fetch pilot details
    const pilot_col = db.collection("pilot");
    const pilot_details = await pilot_col.findOne(
        { user_id: user._id },
        { projection: { user_id: 0 } }
    );

    if (!pilot_details) {
        return sendResponse(404, "Pilot not found", res);
    }

    // Fetch pilot certificates
    const pilot_experience_col = db.collection("pilot_experience");
    const experience = await pilot_experience_col
        .find({ pilot_id: pilot_details._id },{ projection: { pilot_id: 0 } })
        .toArray();

    // Respond with certificates
    return res.status(200).json({
        success: true,
        experience,
    });
});

const addPilotExperience = tryCatchWrapper(async (req, res, next) => {
    const email = req.user_email; // Assuming the email is passed with the token or session

    // Validate email
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    // Validate request body
    const {start_date, end_date, details } = req.body;
    if (!start_date || !details) {
        return sendResponse(400, "Required fields are missing (title, start_date, details)", res);
    }

    // Connect to the database
    const db = await get_db();
    const user_col = db.collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email });
    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    // Fetch pilot details
    const pilot_col = db.collection("pilot");
    const pilot_details = await pilot_col.findOne({ user_id: user._id });

    if (!pilot_details) {
        return sendResponse(404, "Pilot not found", res);
    }

    // Add pilot experience
    const pilot_experience_col = db.collection("pilot_experience");
    const newExperience = {
        pilot_id: pilot_details._id,
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : null,
        details,
    };

    const result = await pilot_experience_col.insertOne(newExperience);

    if (!result.acknowledged) {
        return sendResponse(500, "Failed to add pilot experience", res);
    }

    // Respond with success
    return res.status(201).json({
        success: true,
        message: "Pilot experience added successfully",
    });
});

const updatePilotExperience = tryCatchWrapper(async (req, res, next) => {
    const email = req.user_email; // Assuming the email is passed with the token or session

    // Validate email
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    // Validate request body
    const { experience_id, start_date, end_date, details } = req.body;
    if (!experience_id) {
        return sendResponse(400, "Experience ID is required", res);
    }

    // Connect to the database
    const db = await get_db();
    const user_col = db.collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email });
    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    // Fetch pilot details
    const pilot_col = db.collection("pilot");
    const pilot_details = await pilot_col.findOne({ user_id: user._id });

    if (!pilot_details) {
        return sendResponse(404, "Pilot not found", res);
    }

    // Update pilot experience
    const pilot_experience_col = db.collection("pilot_experience");
    const updateData = {};

    if (start_date) updateData.start_date = new Date(start_date);
    if (end_date !== undefined) updateData.end_date = end_date ? new Date(end_date) : null;
    if (details) updateData.details = details;

    const result = await pilot_experience_col.updateOne(
        { _id: new ObjectId(experience_id), pilot_id: pilot_details._id },
        { $set: updateData }
    );

    if (result.matchedCount === 0) {
        return sendResponse(404, "Experience not found or you are not authorized to update it", res);
    }

    if (result.modifiedCount === 0) {
        return sendResponse(400, "No changes were made to the experience", res);
    }

    // Respond with success
    return res.status(200).json({
        success: true,
        message: "Pilot experience updated successfully",
    });
});

const deletePilotExperience = tryCatchWrapper(async (req, res, next) => {
    const email = req.user_email; // Assuming the email is passed with the token or session

    // Validate email
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }

    // Validate request body
    const { experience_id } = req.body;
    if (!experience_id) {
        return sendResponse(400, "Experience ID is required", res);
    }

    // Connect to the database
    const db = await get_db();
    const user_col = db.collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email });
    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    // Fetch pilot details
    const pilot_col = db.collection("pilot");
    const pilot_details = await pilot_col.findOne({ user_id: user._id });

    if (!pilot_details) {
        return sendResponse(404, "Pilot not found", res);
    }

    // Delete pilot experience
    const pilot_experience_col = db.collection("pilot_experience");
    const result = await pilot_experience_col.deleteOne({
        _id: new ObjectId(experience_id),
        pilot_id: pilot_details._id,
    });

    if (result.deletedCount === 0) {
        return sendResponse(404, "Experience not found or you are not authorized to delete it", res);
    }

    // Respond with success
    return res.status(200).json({
        success: true,
        message: "Pilot experience deleted successfully",
    });
});

//TODO: so the pilot can remove themselves from the company?? 
//since we are getting the email from reqAuth, which means the email will be with the user and not the company

const removeFromCompany = tryCatchWrapper(async (req, res, next) => {
    const email = req.user_email; // Assuming the email is passed with the token or session

    const {company_id} = req.body;
    // Validate email
    if (!email) {
        return sendResponse(401, "No email provided", res);
    }
    if (!company_id) {
        return sendResponse(401, "No company id provided", res);
    }
    // Connect to the database
    const db = await get_db();
    const user_col = db.collection("user");

    // Find the user by email
    const user = await user_col.findOne({ email });
    if (!user) {
        return sendResponse(404, "User not found", res);
    }

    // Fetch pilot details
    const pilot_col = db.collection("pilot");
    const pilot_details = await pilot_col.findOne({ user_id: user._id });

    if (!pilot_details) {
        return sendResponse(404, "Pilot not found", res);
    }

    // Update pilot details
    const result = await pilot_col.updateOne(
        { user_id: user._id },
        { $unset: { company_id: null } }
    );

    if (result.modifiedCount === 0) {
        return sendResponse(400, "Failed to remove from company", res);
    }

    // Respond with success
    return res.status(200).json({
        success: true,
        message: "Removed from company successfully",
    });
})


//get the user profile
const getUserProfileDetails = tryCatchWrapper(async(req,res,next)=>{
    const user_id = req.params.id
    if(!isObjectIdValid(user_id)){
        return sendResponse(500, "Invalid object id", res)
    }
    if(!user_id || user_id.length<1){
        return sendResponse(400, "Not enough details provided", res)
    }

    let user_details = {}
    const db = get_db()
    const user_col = await db.collection("user")
    const user = await user_col.findOne({_id:new ObjectId(user_id)})
    if(!user){
        return sendResponse(401,"No such user found",res)
    }
    else if(user.user_type =="p"){
        const pilot_col = await db.collection("pilot") 
        const pilot = await pilot_col.findOne({user_id: user._id}) 
        if(pilot){

            user_details["p_id"] = pilot._id
            user_details["p_drone_category"] = pilot.drone_category
            user_details["p_is_company_person"] = pilot.is_company_person
            user_details["p_ia_DGCA_license"] = pilot.ia_DGCA_license
            user_details["p_license_number"] = pilot.license_number
            user_details["p_available"] = pilot.available

            if(Object.keys(pilot).includes("socials")){
                user_details["p_socials"] = pilot.socials
            }

            // get pilot posts
            const post_col = await db.collection("post");

            const pipeline = [
                {$match:{"user_id":new ObjectId(user_id)}},
              { $sort: { created_at: -1 } }, // Sort by latest
              { $limit: 5 }, // Pagination limit
              {
                  $lookup: {
                      from: "user", // Collection to join
                      localField: "user_id", // Field in the posts collection
                      foreignField: "_id", // Field in the user collection
                      as: "user_info", // Output array field
                  },
              },
              {
                  $unwind: "$user_info", // Deconstruct the array to a single object
              },
              {
                  $project: {
                      description: 1,
                      image: 1,
                      created_at: 1,
                      /*"user_info.name": 1, // Include only the user's name
                      "user_info.profile": 1,
                      "user_info._id": 1,
                      */
                  },
              },
          ];
      
          const posts = await post_col.aggregate(pipeline).toArray();


            // const posts = await post_col.find({user_id:user._id, pilot_id: pilot._id}, {image:1, description:1}).limit(5).toArray()

            user_details["p_posts"] = posts
            //get pilot certificates
            const certificate_col = await db.collection("pilot_certificates")
            const pilot_certificates = await certificate_col.find({pilot_id: pilot._id},{projection:{name:1, url:1, expiry_date:1}}).toArray()
            user_details["p_certificates"] = pilot_certificates

            // get pilot experience
            const exp_col = await db.collection("pilot_experience")
            const pilot_experiences = await exp_col.find({pilot_id:pilot._id}, {projection:{_id:0,pilot_id:0}}).toArray()
            user_details["p_experience"] = pilot_experiences

            //get company name
            if(pilot.is_company_person){
                const comp_col = await db.collection("company")
                const company_name = await comp_col.findOne({_id:pilot.company_id},{projection:{name:1, website:1, logo:1, _id:0}})
                user_details["p_company"] = company_name
            }
        }
    }
    // else if(user.user_type == "o"){
    //     const company_col = await db.collection("company")
    //     const company_details = await company_col.findOne({user_id:user._id})
    //     user_details["company"] = company_details
    // }

    user_details["name"]= user.name
    user_details["city"] = user.city
    user_details["state"] = user.state
    user_details["user_id"] = user._id
    user_details["profile"] = user.profile

    return res.status(200).json(user_details)
})

module.exports = {
    ulogin,
    uregister,
    sendEmailVerificationOTP,
    verifyOTP,
    checkIfEmailExistsAndSendOTP,
    resetPassword,
    getUser,
    logout,
    changeProfileAvatar,
    updateProfileGeneral,
    updateProfilePassword,
    getCompany,
    updateCompanyDetails,
    updateCompanyLogo,
    getPilotDetails,
    updateProfessionalDetails,
    getPilotSocials,
    addPilotSocials,
    updatePilotSocials,
    deletePilotSocial,
    addPilotCertificate,
    getPilotCertificates,
    updatePilotCertificate,
    deletePilotCertificate,
    getPilotExperience,
    addPilotExperience,
    updatePilotExperience,
    deletePilotExperience,
    removeFromCompany,
    getUserProfileDetails
};
