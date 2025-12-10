import express from 'express';
import {connectDB} from './library/db.js';
import dotenv from 'dotenv'

dotenv.config();    // laoding env variables

const app = express();
app.use(express.json());

connectDB();
const PORT = process.env.PORT || 5000;


app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

app.listen(PORT, () => { 
    console.log(`Server is running on port: ${PORT}`);
})