require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Removed trailing slash
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization', 'Content-Type'],
        credentials: true
    }
});

main()
    .then(() => {
        console.log("success");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(process.env.MONGOURI);
};

io.on('connection', (socket) => {
    socket.on('roomInfo', (roomid) => {
        socket.join(roomid);
    });
    socket.on('whiteboardData', (data, roomid) => {
        socket.broadcast.to(roomid).emit('whiteboardDataResponse', data);
    });
});

app.get('/', (req, res) => {
    res.send('working!');
});

server.listen(8000, () => {
    console.log('Server is working on port 8000');
});
