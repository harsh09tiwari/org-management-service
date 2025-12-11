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
        ref : 'Admin',   // Reference to Admin model because moongoose globally registers models which allows cross referencing without importing them
        required : true
    }

}, {timestamps: true });;


export const Organization = mongoose.model('Organization', organizationSchema);   // saving the schema as a model named 'Organization' and can refer it in other models