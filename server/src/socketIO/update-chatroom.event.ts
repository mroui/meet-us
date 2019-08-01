export const updateChatroomHandler = (socket) => socket.on('chatroomUpdate', function (chatroom) {
    const {chatId} = chatroom.id;
    const isUserInPassedChat = !!Object.keys(socket.rooms).includes(chatId);

    socket.to(isUserInPassedChat && chatId).emit("chatroomUpdate", chatroom);
});