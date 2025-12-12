import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {Organization} from '../models/organization.model.js';
import {Admin} from '../models/admin.model.js';


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

    const DynamicModel = mongoose.model(collectionName, dynamicSchema, collectionName);   // Compile the model (this registers it in Mongoose)  // the third parameter is to specify collection name explicitly as mongoose by default pluralizes the model name by adding 's' at the end
    
    await DynamicModel.create({ data_field: 'Initial data entry' });  // Initializing with a sample document
};



//   Controller function to handle organization creation
export const createOrganization = async (req, res) => {

    try {
        const { organization_name, email, password } = req.body;
        
        // Check for missing fields
        if (!organization_name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all details' });
        }

        const existingOrg = await Organization.findOne({ email });

        if (existingOrg) {
            return res.status(400).json({ message: 'Organization already exists with this email' });
        }

        const existingAdmin = await Admin.findOne({ email });
        
        if (existingAdmin) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

//  Now we will hash the password before saving for security
        const salt = await bcrypt.genSalt(10)  //  "genSalt()" is a bcrypt library method name. 
        const hashedPassword = await bcrypt.hash(password,salt)   

// saving admin user first and then organization details        
        const newAdmin = new Admin({ 
            email, 
            password: hashedPassword, 
            organization_name 
        });
        await newAdmin.save();
    
//  Now creating dynamic collection for the organization        
        const collection_name = `org_${organization_name.toLowerCase().replace(/\s+/g, '_')}`;
        await createDynamicOrgCollection(collection_name); 

//  Now saving organization details
        const newOrganization = new Organization({
            organization_name,
            collection_name,
            admin_user_id: newAdmin._id
        });
        await newOrganization.save();

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
            return res.status(400).json({message : "Please provide organization name"});
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

// function to list all the organizations (for testing purposes)
export const listOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find({}, 'organization_name collection_name admin_user_id createdAt');
        res.status(200).json({
            message: "Organizations fetched successfully",
            data: organizations
        });
        
    } catch (error) {
        console.log('Error in listing organizations controller: ', error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}


export const deleteOrganization = async (req, res) => {

    try {
        const { organization_name } = req.body;

        if(!organization_name){
            return res.status(400).json({message : "Please provide organization name"});
        }

        const organization = await Organization.findOne({organization_name});

        if(!organization){
            return res.status(404).json({message: "Organization not found"});
        }


        // Deleting Collection associated with the organization
        const collectionName = organization.collection_name;
        try {
            await mongoose.connection.db.dropCollection(collectionName);
            console.log(`Collection ${collectionName} dropped successfully.`);
        } catch (error) {
            console.error(` Collection ${collectionName} not found or already deleted: `, error);
        }

        // Deleting Admin User associated with the organization
        await Admin.findByIdAndDelete(organization.admin_user_id);

        // Deleting Organization
        await Organization.findByIdAndDelete(organization._id);

        res.status(200).json({
            message : `${organization_name} Organization and associated data deleted successfully`
        })

    }
    catch (error) {
        console.error('Error in deleting organization controller: ', error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
};



//  We will create a helper fuction to rename the collection when organization name is updated
const updateOrgCollectionName = async (oldName, newName) => {
    try {
        await mongoose.connection.db.renameCollection(oldName, newName);
        console.log(`Collection renamed from ${oldName} to ${newName} successfully.`);
    } catch (error) {
        console.log(`Could not rename collection from ${oldName} to ${newName}: `, error);
    }
}

export const updateOrganization = async (req, res) => {
    try {
        const currentOrgName= req.query.organization_name;
        const {new_organization_name, email, password} = req.body;

        if(!currentOrgName){
            return res.status(400).json({message : "Please provide current organization name"});
        }

        const organization = await Organization.findOne({organization_name: currentOrgName});
        if(!organization){
            return res.status(404).json({message: "Organization not found"});
        }

        const admin = await Admin.findById(organization.admin_user_id);

        //  checking if passwrord needs to be updated
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            admin.password = hashedPassword;
        }

        // We are using two email keywords here. First one is checking if email is provided in the request body and the second is checking if the provided email is different from the existing email of the admin.
        if(email && email !== admin.email){
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ message: 'An account with this email already exists' });
            }
            admin.email = email;
        }
        
        // checking if organization name needs to be updated
        if(new_organization_name && new_organization_name !== organization.organization_name){
            const existingOrg = await Organization.findOne({ organization_name: new_organization_name });
            if (existingOrg) {
                return res.status(400).json({ message: 'Organization already exists with this name' });
            }
            organization.organization_name = new_organization_name;   // update the organization name

            // now updating the collection name accordingly
            const oldCollectionName = organization.collection_name;
            const newCollectionName = `org_${new_organization_name.toLowerCase().replace(/\s+/g, '_')}`;

            updateOrgCollectionName(oldCollectionName, newCollectionName);   // calling the helper function to rename collection
            
            organization.collection_name = newCollectionName;   // update the collection name
            admin.organization_name = new_organization_name; // update organization name in admin as well
        }
        
        await admin.save();
        await organization.save();

        res.status(200).json({
            message : "Organization updated successfully",
            data : {
                organization_name: organization.organization_name,
                collection_name: organization.collection_name,
                admin_user_id: organization.admin_user_id
            }
        })
        
    } catch (error) {
        console.error('Error in updating organization controller: ', error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}