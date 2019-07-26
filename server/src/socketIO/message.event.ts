export const messageHandler = (socket) => socket.on('message', function (msg) {
    const {chatId} = msg;
    const isUserInPassedChat = !!Object.keys(socket.rooms).includes(chatId);

    socket.to(isUserInPassedChat && chatId).emit("message", msg);
});