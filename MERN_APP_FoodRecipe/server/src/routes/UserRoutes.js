import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/Users.js";
import otpGenerator from "otp-generator";
import mongoose from "mongoose";


const router = express.Router();

router.post("/register", async (req, res) => {
    try{

        const {name, username, email, password, cpassword} = req.body;
        const user = await User.findOne({email});

        
        if(name.length < 2 || name.length > 50){
            return res.json({
                status: 400,
                message: "name is too long or short"
            })
        }

        if(username.length < 3 || username.length > 50){
            return res.json({
                status: 400,
                message: "username either too long or short"
            })
        }

        // Validate email format using regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.json({
                status: 400,
                message: "Invalid Email format"
            })
        }

         // Validate password strength (e.g., minimum length)
        if (password.length < 6) {
            return res.json({
                 status: 400,
                 message: 'Password strength is too weak',
            });
        }

         // Check if passwords matches confimr password
        if (password !== cpassword) {
            return res.json({ 
                status: 400, 
                message: 'Passwords do not match' 
            });
        }

      

        //Checking if the user exist in database
        if(user)
        {
            return res.json({
                status: 409,
                message: 'User is already existing',
            })
        }

        // Generate OTP code
        const otpCode = otpGenerator.generate(6, {specialChars: false, lowerCaseAlphabets: true, digits: true});


        //====SENDING AN EMAIL WITH OTP VERIFICATION CODE====
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Read the contents of the email template file
        const emailTemplatePath = path.join(__dirname, '../emails', 'verify_email_template.html');
        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

        // Recipient's information
        const recipientName = name;

        // Replace the placeholder "{{OTP}}" with the otp generated
        const emailContent = emailTemplate
            .replace('{{RECIPIENT_NAME}}', recipientName)
            .replace('{{OTP}}', otpCode);

        //NODE MAILER FOR SENDING EMAIL
        var transporter = nodemailer.createTransport({
            host: 'smtp.titan.email',
            port: 465,
            secure: true,
            debug: true,
            connectionTimeout: 10000,
            auth: {
              user: process.env.GRIEVANCE_EMAIL, //GOTTON FROM ENV FILE
              pass: process.env.GRIEVANCE_EMAIL_PASSWORD  //GOTTON FROM ENV FILE
            }
        });

        var mailOptions = {
            from: process.env.GRIEVANCE_EMAIL,
            to: email,
            subject: 'Email Verification',
            html: emailContent, //The actual verify_email_template.html under emails folder
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                concole.log(error);
                return res.json({
                    status: 500,
                    message: 'Error validating email '
                }) 
            } else {
                return res.json({
                    status: 200,
                    message: 'OTP verification Code sent'
                }); 
            }
        });


        
        // Extract IP address from request
        const iPAddress = req.ip;
        const hashPasword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            email,
            password: hashPasword,
            iPAddress: iPAddress,
            otpCode: otpCode,
        })

        await newUser.save();
        return res.json({
            status: 200,
            message: 'Please verity your email'
        });

        



    }catch(error){
        console.log("Error: ", error.message);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }


});

router.post("/verify-email", async(req, res) => {
    try{

        const {otp} = req.body;

        if(!otp){
            return res.json({
                status: 404,
                message: 'Verification Code is Required'
            })
        }

        const user = await User.findOne({ otpCode: otp });

        // Checking and Compare the stored OTP code with the OTP code provided in the forms
        if(!user || user.otpCode !== otp) {
            return res.json({
                status: 404,
                message: 'OTP Verificaton Code is Invalid'
            });
        }


        // Reset the OTP field in the user document after successful verification
        user.otpCode = null;
        user.emailVarify = 1;
        user.updatedAt = Date.now();
        await user.save();

        return res.json({
            status: 200,
            message: 'Email Verificaton was Successful.'
        });
        

    }catch(error){
        console.log("Error: ", error.message);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        })
    }

});

router.post("/login", async(req, res) => {

    try{

        const {username, password } = req.body;
        const user = await User.findOne({username});
    

        if(!username || !password){
            return res.json({
                status: 400,
                message: "Username/Password is required"
            });
        }

        //check if username exist
        if(!user){
            return res.json({
                status: 401,
                message: 'Invalid Credentials'
            });
        }

        //verify the given password
        const validatePassword  = await bcrypt.compare(password, user.password);
        if(!validatePassword){
            return res.json({
                status: 401,
                message: 'Invalid password Provided'
            });
        }

        user.isLoggedIn = true;

        await user.save();

        //Generating JWT token
        const generareJWT = (payload, secret, expiresIn) => {
            return jwt.sign(payload, secret, { expiresIn });
        };

        //Generic payload
        const payload = {
            userId: user._id,
            username: user.username,
            role: user.role,
            status: user.status
        }

        // Example secret key (replace with your own secret key)
        const secretKey = process.env.ACCESS_TOKEN_SECRET;

        //Add an expiration time to our token
        const expiresIn = '1h';

        // Generate a JWT token with the gererateJwt function
        const authToken = generareJWT(payload, secretKey, expiresIn);

        res.cookie("token", authToken, {secure: true, sameSite: 'lax', httpOnly: true, maxAge: 3600000})
        return res.json({
            status: 200,
            role: payload.role,
            // message: 'Login was successful'
        });

    }catch(error){
        console.log("Error: ", error.message);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        });
    }

});


router.post('/forgot-password', async(req, res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email});


        //Validate the input fields
        if(!email)
        {
            return res.json({
                status: 400,
                message: 'All fields are required'
            })
        }

        // Validate email format using regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) 
        {
            return res.json({
                status: 400,
                message: 'Invalid email format',
            });
        }

        //checking if user email exists 
        if(!user)
        {
            return res.json({
                status: 401,
                message: 'Invalid email address'
            })
        }

       

        const token = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5m'}); //Generate a token

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Read the contents of the email template file
        const emailTemplatePath = path.join(__dirname, '../emails', 'forgotpassword_email.html');
        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');


        // Recipient's information
        const recipientName = user.name;

        // Replace the placeholder "{{TOKEN}}" and {{RECIPIENT_USERNAME}} with 
        //the actual JWT and USERNAME token in the email template
        const emailContent = emailTemplate
            .replace('{{RECIPIENT_NAME}}', recipientName)
            .replace('{{TOKEN}}', token);

        //NODE MAILER FOR SENDING EMAIL
        var transporter = nodemailer.createTransport({
            host: 'smtp.titan.email',
            port: 465,
            secure: true,
            debug: true,
            connectionTimeout: 10000,
            auth: {
              user: process.env.GRIEVANCE_EMAIL, //GOTTON FROM ENV FILE
              pass: process.env.GRIEVANCE_EMAIL_PASSWORD  //GOTTON FROM ENV FILE
            }
        });
          
        var mailOptions = {
            from: process.env.GRIEVANCE_EMAIL,
            to: email,
            subject: 'Reset Password',
            html: emailContent, //The actual email_template.html under routes/emails folder
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                concole.log(error);

                return res.json({
                    status: 500,
                    message: 'Error sending email'
                }) 
            } else {
                return res.json({
                    status: 200,
                    message: 'Password reset link sent'
                }); 
            }
        });


    }catch(error)
    {
        console.error('Error:', error.message);
        return res.json({
            status: 500,
            message: 'Server: Error sending email'
        })
    }

});


router.post('/reset-password/:token', async(req, res) => {

    try{
         const {token} = req.params;
         const {password, cpassword} = req.body;
 
 
         // Validate request body
         if (!password || !cpassword) {
             return res.json({
                 status: 400,
                 message: 'All fields are required'
             })
         }
 
         // Check if passwords matches
         if (password !== cpassword) {
             return res.json({ 
                 status: 400, 
                 message: 'Passwords do not match' 
             });
         }
 
         // Hash the new password
         const hashedPassword = await bcrypt.hash(password, 10);
 
 
         //first we verify the token
         const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         const id = verifyToken.id;
 
         // Update user's password
         const user = await User.findByIdAndUpdate({_id: id}, {password: hashedPassword});
         if (!user) {
             return res.json({
                 status: 404,
                 message: 'User not found'
             });
         }else{
             return res.json({ 
                 status: 200, 
                 message: 'Password Updated successfully'
             });
         }
    }catch(error)
     {
         console.error('Error:', error.message);
         return res.json({
             status: 500,
             message: 'Reset password link expired'
         })
     }
 
 });


// Middleware to verify user request 
const verifyUser = (req, res, next) => {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
        return res.json({ 
            status: 401,
            message: 'Unauthorized' 
        });
    }

    // Parse the cookie header
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
    }, {});

    const token = cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;

        // Check if user status is 1 = active
        if (decoded.status !== 1) {
            return res.json({ 
                status: 401,
                message: 'Unauthorized' 
            });
        }
        next();

    } catch (error) {
        return res.json({ 
            status: 401,
            message: 'Unauthorized' 
        });
    }
};

//check if a user is logged in and prevent them from accessing login/register/verify routes
router.get("/checkloginstatus", verifyUser, (req, res) => {
    return res.json({
        status: 200,
        message: 'You are Logged in',
    })
})


//Check if logged in for front end navbar to show logout button if logged in
router.get("/checkifloggedin", verifyUser, (req, res) => {
    return res.json({
        status: 200,
        message: 'User is logged in',
    })
})


//Verify admin before accessing the route
router.get('/verifyadmin', verifyUser, (req, res) => {
    return res.json({
        status: 200,
        message: 'Authorized',
    })
});

//Verify if the user is who they say they are
router.get('/verifyuser', verifyUser, (req, res) => {
    return res.json({
        status: 200,
        message: 'Authorized',
    })
});



//getting admin details
router.get('/adminprofile', verifyUser, (req, res) => {
    const user = req.user //user infor extracted from jwt token
    return res.json({
        status: 200,
        username: user.username,
    })
})


//getting the user details
router.get('/userprofile', verifyUser, (req, res) => {
    const user = req.user //user infor extracted from jwt token
    return res.json({
        status: 200,
        username: user.username,
        message: 'fetched',
    })
})



router.post('/logout', verifyUser, async(req, res) => {
    const userId = req.user.userId;
    try {
        // Find the user by ID and update the isLoggedIn field
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        user.isLoggedIn = false;
        await user.save();

        // Clear the token cookie
        res.clearCookie('token');
        return res.json({
            status: 200,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error("Error during logout", error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
})


export {router as userRoutes}