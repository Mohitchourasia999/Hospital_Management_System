import dotenv from "dotenv";
import app from "./app.js";
import cloudinary from "cloudinary";
import { dbConnection } from "./database/dbConnection.js";

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database connection
dbConnection();

// Server start
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});