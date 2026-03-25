import connectDB from "./config/db.config.js";
import app from "./app.js";

const startServer = async () => {
    connectDB();
    app.listen(process.env.PORT, () => {
        console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    });
}

export default startServer;