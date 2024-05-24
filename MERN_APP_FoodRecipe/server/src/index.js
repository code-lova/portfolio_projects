import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes } from "./routes/UserRoutes.js";
import { CategoryRoutes } from "./routes/CategoryRoutes.js"
import { ChefRoutes } from "./routes/ChefRoutes.js";
import { DashboardRouter } from "./routes/DashboardRoutes.js";
import { RecipeRoutes } from "./routes/RecipeRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { RatingRoutes } from "./routes/RatingRoutes.js";
import { CommentRoutes } from "./routes/CommentRoutes.js";

const app = express();

// Define a whitelist of allowed origins
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(express.json());

app.use(cookieParser());

// Middleware to serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '/uploads');
app.use('/uploads', express.static(uploadDir));


app.use("/auth", userRoutes)

app.use("/api", CategoryRoutes)

app.use("/api", ChefRoutes)

app.use("/api", DashboardRouter)

app.use("/api", RecipeRoutes)

app.use("/api", RatingRoutes)

app.use("/api", CommentRoutes)


//import dotenv then configure it with config method
//so we can use it in our server connection
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);




// Get the default connection
const db = mongoose.connection;

// Event handlers for connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Checking connection status
if (db.readyState === 1) {
    console.log('MongoDB is connected');
} else {
    console.log('MongoDB is not connected');
}

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}..`);
})