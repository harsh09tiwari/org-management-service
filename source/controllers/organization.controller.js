import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {Organization} from '../models/organization.model.js';
import {Admin} from '../models/admin.model.js';
import e from 'express';


//  Function to create a dynamic collection for an organization which can be used to store organization-specific data
const createDynamicOrgCollection = async (collectionName) => {

    // checking if the collection already exists or not
    if(mongoose.models[collectionName]) {
        return mongoose.models[collectionName];
    }

    const dynamicSchema = new mongoose.Schema({ 
        data_field : String,
        created_at: {type: Date, default: Date.now}
    }, {strict: false});    // false will allow dynamic schema

    const DynamicModel = mongoose.model(collectionName, dynamicSchema);   // Compile the model (this registers it in Mongoose)
    
    await DynamicModel.create({ data_field: 'Initial data entry' });  // Initializing with a sample document
};





//   Controller function to handle organization creation
export const createOrganization = async (req, res) => {

    try {
        const { organization_name, email, password } = req.body;
        // console.log("1. Received org creation request for:", organization_name, email)   ;        
        

        // Check for missing fields
        if (!organization_name || !email || !password) {
            // console.log("2. lol");
            return res.status(400).json({ message: 'Please provide all details' });
        }



        const existingOrg = await Organization.findOne({ email });
        // console.log("3. Org Check Complete. Exists?", !!existingOrg);

        if (existingOrg) {
            return res.status(400).json({ message: 'Organization already exists with this email' });
        }


        const existingAdmin = await Admin.findOne({ email });
        // console.log("4 admin exist", !!existingAdmin);
        
        if (existingAdmin) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

//  Now we will hash the password before saving for security
        const salt = await bcrypt.genSalt(10)  //  "genSalt()" is a bcrypt library method name. 
        const hashedPassword = await bcrypt.hash(password,salt)   
        // console.log("5. Password hashed");



// saving admin user first and then organization details        
        const newAdmin = new Admin({ 
            email, 
            password: hashedPassword, 
            organization_name 
        });
        await newAdmin.save();
        // console.log("6. Admin user created with ID:", newAdmin._id);
        

//  Now creating dynamic collection for the organization        
        const collection_name = `org_${organization_name.toLowerCase().replace(/\s+/g, '_')}`;
        await createDynamicOrgCollection(collection_name);
        // console.log("7. Dynamic collection created:", collection_name);

//  Now saving organization details
        const newOrganization = new Organization({
            organization_name,
            collection_name,
            admin_user_id: newAdmin._id
        });
        await newOrganization.save();
        // console.log("8. Organization created with ID:", newOrganization._id);




        res.status(201).json({
            message: 'Organization created successfully',
            data:{
                organization_name: newOrganization.organization_name,
                collection_name: newOrganization.collection_name,
                admin_user_id: newOrganization.admin_user_id
            }
        })
    }
    catch (error) {
        console.error('Error in creating organization controller: ', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate field value entered (Email or Org Name already exists)' });
        }
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}




export const getOrganization = async (req, res) => {

    try {   
        const { organization_name } = req.query; // receiving the name from the url

        if(!organization_name){
            return res.status(400).json({message : "Please provide organization name"})
        }

        const organization = await Organization.findOne({organization_name});
        
        if(!organization){
            return res.status(404).json({message: "Organization not found"});
        }

        res.status(200).json({
            message : "Organization fetched successfully",
            data : organization
        })
        
    } catch (error) {
        console.error('Error in getting organization controller: ', error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
};