import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const url = "mongodb://nikhilkumargkp1012_db_user:fXLrKKYuQJiHU0ct@ac-w05vzka-shard-00-00.keeyc3m.mongodb.net:27017,ac-w05vzka-shard-00-01.keeyc3m.mongodb.net:27017,ac-w05vzka-shard-00-02.keeyc3m.mongodb.net:27017/?ssl=true&replicaSet=atlas-w05vzka-shard-0&authSource=admin&retryWrites=true&w=majority";

const test = async () => {
    try {
        console.log("Connecting with manual string...");
        await mongoose.connect(url);
        console.log("Connected successfully!");
        process.exit(0);
    } catch (e) {
        console.error("Connection failed:", e.message);
        process.exit(1);
    }
}

test();
