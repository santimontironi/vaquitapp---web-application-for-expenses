import app from "../app.js";
import connectDB from "../config/db.config.js";

// En Vercel (serverless) nunca se ejecuta app.listen de server.js,
// por eso la conexión a MongoDB se hace acá al cargar la función.
await connectDB();

export default app;
