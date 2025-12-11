import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    organization_name: {
        type: String,
        required: true
    }

}, { timestamps: true });

export const Admin = mongoose.model('Admin', adminSchema);  // saving the schema as a model named 'Admin' and can refer it in other models