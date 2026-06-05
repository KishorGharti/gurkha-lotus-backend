import admin from "../models/admin.models.js";
import bcrypt from 'bcrypt'
import 'dotenv/config'
import jwt from "jsonwebtoken";


export const loginController=async(req,res,next)=>{
    try{
        const{username,password}=req.body;

        const checker=await admin.findOne({username});
        if(!checker){
            return res.status(500).json({message:'admin not found'})
        }

    
        const pass = await bcrypt.compare(password,checker.password);

        if(!pass){
            return res.status(500).json({message:'Password Wrong'})
        }



        const token = jwt.sign(
        { userId: checker._id, role: checker.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );

        res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({message:'Login successfull'})
    }
    catch(err){
        next(err)
    }
}