import express from 'express';
import {connectDB} from './library/db.js';
import dotenv from 'dotenv'

import adminAuthRoute from './routes/admin.auth.route.js';

dotenv.config();    // laoding env variables
const PORT = process.env.PORT || 5000;



const app = express();
app.use(express.json());




app.use('/api', adminAuthRoute);






// app.get('/test', (req, res) => {
//     res.json({ message: 'Server is working' });
// });

app.listen(PORT, () => { 
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
})