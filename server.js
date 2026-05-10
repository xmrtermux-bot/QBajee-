const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connected"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("bet", (data) => {
        io.emit("result", {
            user: data.user,
            win: Math.random() > 0.5
        });
    });
});

server.listen(3000, () => console.log("Server running"));
