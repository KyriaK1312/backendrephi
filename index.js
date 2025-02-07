import express from "express";
import { connectToDatabase } from "./database/index.js";
import appRouter from "./routes/index.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';



config();
const app = express();
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

const PORT = 3001;

app.use(express.json());

app.use("/accordsapp/backend/", appRouter);

connectToDatabase().then(() => {
    
    try {
        app.listen(PORT, () => console.log("Server Open At port:", PORT));
        
    } catch (error) {
            console.log("Error occured with mysql connection. Error=", error);
            process.exit(0);
    }
})