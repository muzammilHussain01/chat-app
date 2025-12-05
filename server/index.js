const express = require("express"); // import express
const cors = require("cors");
const http = require("http"); // import http
const {Server} = require("socket.io"); // import socket.io
const app = express(); // inetilize express
const server = http.createServer(app); // add socket to server
const io = new Server(server,
    {
        cors: {
            // cors origin
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    }); // create new server instance
// when a client connect with backend
io.on("connection", (socket)=> {
    console.log(`User connected ${socket.id}`)
    socket.on("sendMessage", (message) =>{
        console.log(`Message from user at backend ${message}`)
        socket.broadcast.emit("reciveMessage", message)
        console.log("Message sent fron backend to frontend", message)
    })
    socket.on("disconnect", () => {
        console.log(`User disconnected ${socket.id}`)
    })

})
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> {
    console.log(`Srever is at PORT no. ${PORT}`)
})