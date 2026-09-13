import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const keepAlive = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connection.db.admin().ping();
        console.log("Ping a MongoDB Atlas exitoso:", new Date().toISOString());
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error al hacer ping a MongoDB Atlas:", error.message);
        process.exit(1);
    }
};

keepAlive();
