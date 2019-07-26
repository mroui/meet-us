export const joinChatroomHandler = (socket) => socket.on("join", function (room) {
    try {
        console.log("[Socket]: Joining room", room);
        socket.join(room);
        socket.to(room).emit("user joined", socket.id);
    } catch (e) {
        console.log("[Error]: Joining room", e);
        socket.emit("error", e);
    }
});

export const leaveChatroomHandler = (socket) => socket.on("leave", function (room) {
    try {
        console.log("[Socket]: Leaving room", room);
        socket.leave(room);
        socket.to(room).emit("user left", socket.id);
    } catch (e) {
        console.log("[Error]: Leaving room", e);
        socket.emit("error", e);
    }
});