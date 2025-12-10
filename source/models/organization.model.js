import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        unique : true
    },
    collection_name : {
        type : String, 
        required : true,
        unique : true
    },
    admin_user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Admin',
        required : true
    }
    
}, {timestamps: true });;


export const Organization = mongoose.model('Organization', organizationSchema);