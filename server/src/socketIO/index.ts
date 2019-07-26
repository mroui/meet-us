import * as socketIO from "socket.io";
import {PORT, SOCKET_IO_PATH} from "../../config/index";
import {messageHandler} from './message.event';
import {joinChatroomHandler, leaveChatroomHandler} from './change-channels.event';

let initializedSocketIO;

async function initializeSocketIO(expressHttpServer) {
    return new Promise((resolve, reject) => {
        const io = socketIO(expressHttpServer, {path: SOCKET_IO_PATH});
        console.log(`💭 socket.io ready at http://localhost:${PORT}${SOCKET_IO_PATH}`);

        io.on("connection", function (socket) {
            //Init handlers
            messageHandler(socket);
            joinChatroomHandler(socket);
            leaveChatroomHandler(socket);
            return resolve({io, socket});
        });
    });
}

export default async function getSocketIO(expressHttpServer?: any) {
    initializedSocketIO = initializedSocketIO || await initializeSocketIO(expressHttpServer);
    return initializedSocketIO;
}