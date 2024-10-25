import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function dbConnect() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(String(process.env.DB_URI));
        console.log('Connected to DB');
    } catch {
        console.log('Could not connect to DB');
        process.exit(1);
    }
}

export default dbConnect;
