import connectDB from "./config/db.config.js";
import app from "./app.js";

const startServer = async () => {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        console.error('ERROR: JWT_SECRET debe tener al menos 32 caracteres.');
        process.exit(1);
    }

    connectDB();
    app.listen(process.env.PORT, () => {
        console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    });
}

export default startServer;