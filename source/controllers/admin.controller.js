import bcrypt from 'bcrypt';
import {Admin} from '../models/admin.model.js';
import {generateToken} from '../library/jwt.util.js';



//  Admin Login Controller
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {

// checking for missing fields
        if(!email || !password){
            return res.status(400).json({message : "Pleses provide all details"})
        }


        const admin = await Admin.findOne({email});    // finding admin by email
        if(!admin){
            return res.status(400).json({message : "Invalid Credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid Credentials"})
        }


        // generating jwt token
        const token = generateToken(admin._id, admin.organization_name);

        res.status(200).json(
            {
                message : "Admin logged in successfully",
                token
            }
    )
        
    } catch (error) {
        console.log("Error in login Controller", error.message);
        res.status(500).json({message : "Internal Server Error"})
    }
}