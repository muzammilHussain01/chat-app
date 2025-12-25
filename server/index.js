require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/mongoDbconfig");
const userRoute = require("./route/userRoute");

const app = express();
const server = http.createServer(app);

// ---------- Middlewares ----------
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
}));
app.use(express.json());

// ---------- Routes ----------
app.use("/api", userRoute);


// ---------- Socket.IO ----------
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", ({ text, roomId }) => {
        console.log(`Message received for room ${roomId}: ${text}`);

        socket.to(roomId).emit("receiveMessage", {
            text,
            from: socket.id
        });
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// ---------- Server Startup ----------
const PORT = process.env.PORT || 5000;

(async () => {
    await connectDB(); // ✅ DB first
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();
