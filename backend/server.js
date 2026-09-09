import app from"./app.js";
import Cloudinary from "cloudinary"
import { dbconnection } from "./database/dbconnection.js";

Cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const startServer = async () => {
    await dbconnection();

    app.listen(process.env.PORT, () =>{
        console.log(`server listening on port ${process.env.PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Failed to start backend:", error);
    process.exit(1);
});
