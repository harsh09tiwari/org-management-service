import mongoose from "mongoose";
import { Organization } from "./organization.model";

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

export const Admin = mongoose.model('Admin', adminSchema);