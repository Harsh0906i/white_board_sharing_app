const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser')
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const authRouter=require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization'],
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
    await mongoose.connect('mongodb+srv://harshit:12345@cluster0.znmuror.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
};

io.on('connection', (socket) => {
    socket.on('roomInfo', (roomid) => {
        socket.join(roomid); // Join the specified room
    });
    socket.on('whiteboardData', (data, roomid) => {
        socket.broadcast.to(roomid).emit('whiteboardDataResponse', data); // Emit only to the specified room
    });
});

server.listen(8080, () => {
    console.log('Server is working on port 8080');
});
