const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');
const { JWTPASS } = require("../utilities/config");
const User = require('../model/user');

const userController = {
    signup: async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const user = await User.findOne({ email })
            if (user) {
                return res.json({message:"Already This email used"})
            }
            else {
                const passwordHash = await bcrypt.hash(password, 10)
                const user = new User({
                    name,email,passwordHash
                })
                await user.save()
                return res.json({message:"user created"})
            }
      
        } catch (error) {
            console.log('signup error',error)
            return res.json({message:"signup erro"})
        }
    },
    signIn: async (req, res) => {
        try {
            const { email, password } = req.body
            const user=await User.findOne({email})
            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.passwordHash)
                if (!passwordMatch) {
                    return res.json({message:"Invaild Password"})
                }
                const Token = jwt.sign({
                    email: email,
                    id:user._id
                }, JWTPASS)
                return res.json({Token,message:"User Login success",user})
            }
            return res.json({message:"Invaild User"})
        } catch (error) {
            console.log('signIn error',error)
            return res.json({message:"signIn error"})
        }
    },
    resetPassword: async(req, res) =>{
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({meaasge:"Invaild User"})
        }
        const OTP = Math.random().toString(36).slice(-6);
        user.reset_OTP = OTP
        await user.save()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'parthapn2017@gmail.com',
              pass: 'zceeslzyuudjptea',
            },
          });
          const Link=`https://notes-app-ps.netlify.app/reset-password/new-password/${OTP}`
          const mailOptions = {
            from: 'Password_resest_noreply@gmail.com',
            to: email,
            subject: 'Reset Your Password',
            text: `you are receiving this email because you request has passwords reset for your account .\n\n please use the following Link  to  Click reset your password:${Link} \n\n if you did not request a password to ignore this email. `,
          };
        
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              return res.json({ message: 'Error sending reset email' });
            } else {
              return res.json({ message: 'Reset email sent successfully' });
            }
          });
    },
    newpassword: async (req, res) => {
        try {
            const { OTP } = req.params;
        const { password } = req.body;
        if (!password) {
            return res.json({ message: "please enter the new password" });
        }
        const user = await User.findOne({ reset_OTP: OTP })
        if (!user) {
            return res.json({ message: "Invalid OTP" });
        }
        const NewPass = await bcrypt.hash(password, 10);
        user.passwordHash = NewPass;
        user.reset_OTP = null;
           
        await user.save();

        res.json({meaasge:"password reset successfull"})
        }
        catch (e) {
            console.log(e)
        }
    }
}
module.exports = userController;