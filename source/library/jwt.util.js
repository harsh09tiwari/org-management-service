import jwt from 'jsonwebtoken';

export const generateToken = (id, organization_name) => {

// generating jwt token and returning it    
    return jwt.sign(
        { 
            admin: {
                id,
                organization_name 
            }
        },
        process.env.JWT_SECRET,
        { expiresIn: '20m' }
    );
}