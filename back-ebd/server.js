const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const {notFound, errorHandler} =require("../back-ebd/middleware/errorMiddleware")
const path = require('path')
require('dotenv').config({path:path.resolve(__dirname,'./.env')})

dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("API is running good");
});

app.use("/api/user",userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


app.use(notFound);
app.use(errorHandler);

// Use the environment port or 5000
const PORT = process.env.PORT || 5000;

// Start the server with error handling
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
}).on('error', (err) => {
    console.error("Failed to start the server:", err);
});
